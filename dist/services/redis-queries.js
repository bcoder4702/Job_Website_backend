"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRedis = exports.applyFilters = exports.storeJobsInRedis = exports.getJobsFromRedis = void 0;
const firestore_1 = require("firebase/firestore");
const redis_client_1 = __importDefault(require("../config/redis-client"));
const parseExperience_1 = __importDefault(require("../utils/parseExperience"));
const parseSalary_1 = __importDefault(require("../utils/parseSalary"));
const getJobsFromRedis = async () => {
    const keys = await redis_client_1.default.keys("latest_jobs:*");
    console.log(`🔍 Found ${keys.length} keys in Redis matching prefix 'latest_jobs:'`);
    const jobs = [];
    for (const key of keys) {
        if (key === "latest_jobs:lastVisible")
            continue; // ✅ Skip `lastVisible` key
        const jobData = await redis_client_1.default.call("JSON.GET", key, "$");
        // console.log(`📌 Redis Key: ${key}, Retrieved Data:`, jobData); // 🔍 Debugging
        if (jobData) {
            try {
                const parsedArray = JSON.parse(jobData);
                const parsedJob = Array.isArray(parsedArray) ? parsedArray[0] : parsedArray;
                if (!parsedJob || !parsedJob.createdAt) {
                    console.error(`❌ Missing createdAt in Redis data for key: ${key}`);
                    continue;
                }
                jobs.push({
                    ...parsedJob,
                    createdAt: new firestore_1.Timestamp(parsedJob.createdAt.seconds, parsedJob.createdAt.nanoseconds),
                });
            }
            catch (error) {
                console.error(`❌ Error parsing job data from Redis (key: ${key}):`, error);
            }
        }
    }
    // ✅ Get `lastVisible` ID as a string, NOT JSON
    const lastVisibleId = await redis_client_1.default.get("latest_jobs:lastVisible");
    return { jobs, lastVisibleId };
};
exports.getJobsFromRedis = getJobsFromRedis;
/*export const storeJobsInRedis = async(jobs: JobPosting[], lastVisible: QueryDocumentSnapshot<DocumentData> | null) => {
  for (const job of jobs) {
    if (!job || !job.jobId) {
      console.error("❌ Invalid job data. Skipping storage in Redis.");
      continue;
    }

    try {
      const jobData = {
        ...job,
        createdAt: {
          seconds: job.createdAt.seconds,
          nanoseconds: job.createdAt.nanoseconds,
        },
      };

      await redisClient.call("JSON.SET", `latest_jobs:${job.jobId}`, "$", JSON.stringify(jobData));
    } catch (error) {
      console.error(`❌ Error storing job in Redis (jobId: ${job.jobId}):`, error);
    }
  }

  // ✅ Store `lastVisible` as a string, NOT JSON
  if (lastVisible) {
    await redisClient.set("latest_jobs:lastVisible", lastVisible.id, "EX", 14400);
  }

  console.log("✅ Jobs and lastVisible stored in Redis.");
}*/
const storeJobsInRedis = async (jobs, lastVisible) => {
    try {
        console.time("RedisStoreJobs");
        const pipeline = redis_client_1.default.pipeline();
        // Batch store jobs
        jobs.forEach(job => {
            if (!job?.jobId) {
                console.error("❌ Invalid job data - skipping");
                return;
            }
            const jobData = {
                ...job,
                createdAt: {
                    seconds: job.createdAt.seconds,
                    nanoseconds: job.createdAt.nanoseconds
                }
            };
            pipeline.call("JSON.SET", `latest_jobs:${job.jobId}`, "$", JSON.stringify(jobData));
        });
        // Store lastVisible
        if (lastVisible) {
            pipeline.set("latest_jobs:lastVisible", lastVisible.id, "EX", 14400);
        }
        await pipeline.exec();
        console.timeEnd("RedisStoreJobs");
        console.log(`✅ Stored ${jobs.length} jobs in Redis`);
    }
    catch (error) {
        console.error("🔥 Redis store error:", error);
    }
};
exports.storeJobsInRedis = storeJobsInRedis;
const applyFilters = async (filters, redisKey, required_limit) => {
    let query = "*"; // Default query (fetch all)
    let conditions = [];
    if (filters.category) {
        conditions.push(`@category:{${filters.category}}`);
    }
    if (filters.position) {
        const positionArray = filters.position.split(",");
        const positionQuery = positionArray.map(pos => `"${pos}"`).join("|");
        conditions.push(`@position:(${positionQuery})`);
    }
    if (filters.experience) {
        const parsedExp = (0, parseExperience_1.default)(filters.experience);
        if (parsedExp) {
            conditions.push(`@experienceMin:[-inf ${parsedExp.max}] @experienceMax:[${parsedExp.min} +inf]`);
        }
    }
    if (filters.salary) {
        const parsedSalary = (0, parseSalary_1.default)(filters.salary);
        if (parsedSalary) {
            conditions.push(`@salaryRangeStart:[-inf ${parsedSalary.max}] @salaryRangeEnd:[${parsedSalary.min} +inf]`);
        }
    }
    if (filters.location) {
        const locationArray = filters.location.split(","); // Split locations by comma
        const locationQuery = locationArray.map(loc => `${loc}`).join("|");
        conditions.push(`@locations:{${locationQuery}}`);
    }
    if (filters.jobType) {
        const jobTypeArray = filters.jobType.split(",");
        const jobTypeQuery = jobTypeArray.map(type => `"${type}"`).join("|");
        conditions.push(`@jobType:(${jobTypeQuery})`);
    }
    if (filters.companyName) {
        const sanitizedCompanyName = filters.companyName.trim().toLowerCase().replace(/"/g, ''); // Sanitize input
        conditions.push(`@companyName:(${sanitizedCompanyName}*)`); // Partial match with wildcard
    }
    if (filters.timeRange) {
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
        let minTimestamp = 0;
        switch (filters.timeRange) {
            case "Past 24 hours":
                minTimestamp = currentTimestamp - 24 * 60 * 60; // 24 hours ago
                break;
            case "Past week":
                minTimestamp = currentTimestamp - 7 * 24 * 60 * 60; // 7 days ago
                break;
            case "Any time":
                // No filtering based on time
                break;
            default:
                console.warn(`⚠️ Unknown timeRange: ${filters.timeRange}`);
                break;
        }
        if (filters.timeRange !== "anytime") {
            conditions.push(`@createdAtSeconds:[${minTimestamp} ${currentTimestamp}]`);
        }
    }
    if (conditions.length > 0) {
        query = conditions.join(" ");
    }
    console.log(`🔍 Redis Query: ${query}`);
    try {
        const result = await redis_client_1.default.call("FT.SEARCH", "idx:latest_jobs", query || "*", "LIMIT", "0", required_limit.toString());
        // console.log("Redis Search Result:", result); // Debugging
        const jobs = [];
        const searchResult = result;
        for (let i = 1; i < searchResult.length; i += 2) { // Skip index 0 (total count)
            try {
                const jsonData = JSON.parse(result[i + 1][1]); // Extract JSON string from result
                jobs.push(jsonData);
            }
            catch (error) {
                console.error("❌ Error parsing Redis job data:", error);
            }
        }
        // console.log("✅ Parsed Jobs from Redis:", jobs);
        return jobs;
    }
    catch (error) {
        console.error("❌ Redis search error:", error);
        return [];
    }
};
exports.applyFilters = applyFilters;
/*export const checkRedis = async(): Promise<boolean> => {
  const keys = await redisClient.keys("latest_jobs:*");
  console.log(`🔍 Found ${keys.length} keys in Redis matching prefix 'latest_jobs:'`);

  return keys.length > 0;
}*/
/*export const checkRedis = async (): Promise<{ jobsPresent: boolean; lastVisibleId: string | null }> => {
  const keys = await redisClient.keys("latest_jobs:*");
  console.log(`🔍 Found ${keys.length} keys in Redis matching prefix 'latest_jobs:'`);

  if (keys.length > 0) {
    // Retrieve the lastVisibleId from Redis
    const lastVisibleId = await redisClient.get("latest_jobs:lastVisible");
    return { jobsPresent: true, lastVisibleId };
  }

  return { jobsPresent: false, lastVisibleId: null };
};*/
const checkRedis = async () => {
    try {
        console.time("RedisCheck");
        const [keys, lastVisibleId] = await Promise.all([
            redis_client_1.default.scan(0, "MATCH", "latest_jobs:*", "COUNT", 100),
            redis_client_1.default.get("latest_jobs:lastVisible")
        ]);
        console.timeEnd("RedisCheck");
        return {
            jobsPresent: keys[1].length > 0,
            lastVisibleId
        };
    }
    catch (error) {
        console.error("🔥 Redis check error:", error);
        return { jobsPresent: false, lastVisibleId: null };
    }
};
exports.checkRedis = checkRedis;
//# sourceMappingURL=redis-queries.js.map