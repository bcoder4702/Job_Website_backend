import { DocumentData, Timestamp, QueryDocumentSnapshot } from "firebase/firestore";
import { JobPosting } from "../models/jobPosting";
import redisClient from "../config/redis-client";
import parseExperience from "../utils/parseExperience";
import parseSalary from "../utils/parseSalary";



export const getJobsFromRedis = async(): Promise<{ jobs: JobPosting[], lastVisibleId: string | null }>  => {
    const keys = await redisClient.keys("latest_jobs:*");
    console.log(`🔍 Found ${keys.length} keys in Redis matching prefix 'latest_jobs:'`);
  
    const jobs: JobPosting[] = [];
  
    for (const key of keys) {
      if (key === "latest_jobs:lastVisible") continue; // ✅ Skip `lastVisible` key
  
      const jobData = await redisClient.call("JSON.GET", key, "$");
      // console.log(`📌 Redis Key: ${key}, Retrieved Data:`, jobData); // 🔍 Debugging
      if (jobData) {
        try {
          const parsedArray = JSON.parse(jobData as string);
          const parsedJob = Array.isArray(parsedArray) ? parsedArray[0] : parsedArray;
          if (!parsedJob || !parsedJob.createdAt) {
            console.error(`❌ Missing createdAt in Redis data for key: ${key}`);
            continue;
          }
  
          jobs.push({
            ...parsedJob,
            createdAt: new Timestamp(parsedJob.createdAt.seconds, parsedJob.createdAt.nanoseconds),
          });
        } catch (error) {
          console.error(`❌ Error parsing job data from Redis (key: ${key}):`, error);
        }
      }
    }
  
    // ✅ Get `lastVisible` ID as a string, NOT JSON
    const lastVisibleId = await redisClient.get("latest_jobs:lastVisible");
  
    return { jobs, lastVisibleId };
  }
  
  
  export const storeJobsInRedis = async(jobs: JobPosting[], lastVisible: QueryDocumentSnapshot<DocumentData> | null) => {
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
  }
  
  
  
  export const applyFilters = async(filters: any, redisKey: string, required_limit: number): Promise<JobPosting[]>  => {
    let query = "*"; // Default query (fetch all)
    let conditions: string[] = [];
  
    if (filters.category) {
      conditions.push(`@category:{${filters.category}}`);
    }
  
    if (filters.position) {
      const positionArray = (filters.position as string).split(",");
      const positionQuery = positionArray.map(pos => `"${pos}"`).join("|");
      conditions.push(`@position:(${positionQuery})`);
    }
  
    if (filters.experience) {
      const parsedExp = parseExperience(filters.experience as string);
      if (parsedExp) {
        // conditions.push(`@experienceMax:[${parsedExp.min} 50]`);
        // conditions.push(`@experienceMin:[0 ${parsedExp.max}]`);
        conditions.push(`@experienceMin:[${parsedExp.min} +inf]`);
  
        // Ensure experienceMax is at most parsedExp.max
        conditions.push(`@experienceMax:[-inf ${parsedExp.max}]`);
      }
    }
  
    if (filters.salary) {
      const parsedSalary = parseSalary(filters.salary as string);
      if (parsedSalary) {
        conditions.push(`@salaryRangeStart:[${parsedSalary.min} +inf]`);
        conditions.push(`@salaryRangeEnd:[-inf ${parsedSalary.max}]`);
      }
    }
  
    if (filters.location) {
      const locationArray = (filters.location as string).split(","); // Split locations by comma
      const locationQuery = locationArray.map(loc => `${loc}`).join("|");
      conditions.push(`@locations:{${locationQuery}}`);
    }
  
    if (filters.jobType) {
      const jobTypeArray = (filters.jobType as string).split(",");
      const jobTypeQuery = jobTypeArray.map(type => `"${type}"`).join("|");
      conditions.push(`@jobType:(${jobTypeQuery})`);
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
      const result = await redisClient.call(
        "FT.SEARCH",
        "idx:latest_jobs",
        query || "*",
        "LIMIT", "0", required_limit.toString(),
      );
  
      // console.log("Redis Search Result:", result); // Debugging
  
      const jobs: JobPosting[] = [];
  
      const searchResult = result as any[];
      for (let i = 1; i < searchResult.length; i += 2) { // Skip index 0 (total count)
        try {
          const jsonData = JSON.parse((result as any[])[i + 1][1]); // Extract JSON string from result
          jobs.push(jsonData as JobPosting);
        } catch (error) {
          console.error("❌ Error parsing Redis job data:", error);
        }
      }
      
      // console.log("✅ Parsed Jobs from Redis:", jobs);
      return jobs;
    } catch (error) {
      console.error("❌ Redis search error:", error);
      return [];
    }
  }


  export const checkRedis = async(): Promise<boolean> => {
    const keys = await redisClient.keys("latest_jobs:*");
    console.log(`🔍 Found ${keys.length} keys in Redis matching prefix 'latest_jobs:'`);
  
    return keys.length > 0;
  }