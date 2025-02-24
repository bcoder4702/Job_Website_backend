import { Request, RequestHandler, Response } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { db } from "../database/firebase";
import { Job } from "../models/job";
import { collection, doc, writeBatch, setDoc, getDocs, Query, Firestore, query, where, DocumentData, Timestamp, orderBy, limit } from "firebase/firestore";
import  { mapNaukriJobToJobPosting }  from "../utils/naukri-job";
import { JobPosting } from "../models/jobPosting";
import redisClient from "../config/redis-client";

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
export const upload = multer({ storage });

/**
 * Upload a JSON file containing job postings to Firebase Firestore
 */

export const uploadJobData = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath, "utf8");
    const naukriJobs = JSON.parse(fileData);

    if (!Array.isArray(naukriJobs)) {
      fs.unlinkSync(filePath); // Delete the uploaded file
      res.status(400).json({ message: "Invalid JSON format" });
      return;
    }

    // Transform Naukri job data to Job model
    const jobs: JobPosting[] = naukriJobs.map((naukriJob: any) => mapNaukriJobToJobPosting(naukriJob));

    // Insert jobs into Firebase
    const batch = writeBatch(db);
    jobs.forEach((job) => {
      const jobRef = doc(collection(db, "jobs"), job.jobId);
      batch.set(jobRef, job.toPlainObject()); // Convert Job instance to plain object
    });

    await batch.commit();

    // unlink the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });
     // 🔹 Clear cached job results when new data is uploaded
    //  console.log("Flushing Redis cache...");
    //  await redisClient.flushall(); // `flushall()` in ioredis does not take arguments

    res.status(201).json({ message: "Jobs inserted successfully", count: jobs.length });
  } catch (error) {
    console.error("Error uploading JSON file:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};



export const getAllJobs: RequestHandler = async (req: Request, res: Response) => {
  try {
    const cacheKey = "latest_jobs";

    // ✅ **Check Redis first**
    // const cachedJobs = null //await redisClient.get(cacheKey);
    // if (cachedJobs) {
    //   console.log("✅ Serving jobs from Redis cache");
    //   res.status(200).json(JSON.parse(cachedJobs));
    //   return;
    // }

    console.log("⏳ Fetching top 1000 jobs from Firestore...");
    const jobsRef = collection(db, "jobs");
    const jobQuery = query(jobsRef, orderBy("createdAt", "desc"), limit(1000));

    const snapshot = await getDocs(jobQuery);
    if (snapshot.empty) {
      res.status(404).json({ message: "No jobs found" });
      return;
    }

    const jobs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: new Timestamp(doc.data().createdAt.seconds, doc.data().createdAt.nanoseconds)
    }));

    // ✅ **Store in Redis with a 4-hour expiration**
    // await redisClient.set(cacheKey, JSON.stringify(jobs), "EX", 14400);

    res.status(200).json(jobs);
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};



async function fetchNewJobsFromFirebase(lastFetchedTimestamp: Timestamp | null): Promise<JobPosting[]> {
  if (!lastFetchedTimestamp) return [];

  console.log(`⏳ Fetching jobs newer than ${lastFetchedTimestamp.toDate()}`);

  console.log(`⏳ Fetching jobs newer than ${lastFetchedTimestamp.toDate()}`);
  console.log("lastFetchedTimestamp Type:", typeof lastFetchedTimestamp);
  console.log("lastFetchedTimestamp Value:", lastFetchedTimestamp);

  const jobsRef = collection(db, "jobs");
  const adjustedTimestamp = new Timestamp(
    lastFetchedTimestamp.seconds, 
    lastFetchedTimestamp.nanoseconds + 1 // 🔥 Ensure we get only newer jobs
  );

  const jobQuery = query(
    jobsRef,
    orderBy("createdAt", "desc"), // ✅ Order by `createdAt` (descending)
    where("createdAt", ">", adjustedTimestamp), 
    limit(1000)
  );

  const snapshot = await getDocs(jobQuery);
  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      jobId: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp 
        ? data.createdAt // ✅ Use Firestore Timestamp directly
        : new Timestamp(data.createdAt.seconds, data.createdAt.nanoseconds) // ✅ Handle manual conversion if needed
    } as JobPosting;
  });
}




async function fetchJobsFromFirebase(): Promise<JobPosting[]> {
  const jobsRef = collection(db, "jobs");
  const jobQuery = query(jobsRef, orderBy("createdAt", "desc"), limit(1000));
  const snapshot = await getDocs(jobQuery);
  return snapshot.docs.map((doc) => ({ jobId: doc.id, ...doc.data() } as JobPosting));
}


function parseExperience(exp: string) {
  console.log("Raw Experience Query Param:", exp);
  let minExp = 0, maxExp = 50;

  if (exp.includes("-")) {
    const [min, max] = exp.split("-").map((num) => parseInt(num.trim()));
    console.log("Parsed exp Range:", { min, max });
    return { min, max };
  } else if (exp.includes("+")) {
    const extractedExp = parseInt(exp.split("+")[0].trim());
    console.log("Parsed exp Range:", { extractedExp, maxExp });
    return { min: extractedExp, max: 50 };
  }

  return null;
}

function parseSalary(salary: string) {
  console.log("Raw Salary Query Param:", salary);
  let minSalary = 0, maxSalary = Infinity;

  if (salary.includes("-")) {
    const [min, max] = salary.split("-").map((num) => parseInt(num.trim()));
    console.log("Parsed Salary Range:", { min, max });
    return { min, max };
  } else if (salary.includes("+")) {
    const extractedSalary = parseInt(salary.split("+")[0].trim());
    console.log("Parsed Salary Range:", { extractedSalary, maxSalary });
    return { min: extractedSalary, max: Infinity };
  }

  return null;
}







export const getJobs: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { category, position, experience, salary, location, jobType, page = 1 } = req.query;
    const limit = 60; // Fetch 3 pages worth of jobs (12 jobs per page)
    const offset = (Number(page) - 1) * limit;

    console.log("⏳ Checking Redis for cached jobs...");
    let jobs: JobPosting[] = [];
    let lastFetchedTimestamp: Date | null = null;


    // ✅ Try getting jobs from Redis
    const cachedJobs = await getJobsFromRedis();//redisClient.get("latest_jobs");
    if (cachedJobs.length!==0) {
      console.log(`✅ Found ${cachedJobs.length} jobs in Redis cache.`);
      jobs = cachedJobs;//JSON.parse(cachedJobs as unknown as string);
      lastFetchedTimestamp = jobs.length > 0 && jobs[jobs.length - 1].createdAt
  ? new Date(jobs[jobs.length - 1].createdAt.seconds * 1000)
  : null;
      console.log("here is the lastfetchedtimestamp",lastFetchedTimestamp);
      // console.log(`✅ Found ${jobs.length} jobs in Redis cache.`);
    } else {
      console.log("🚀 Fetching first 1000 jobs from Firestore...");
      jobs = await fetchJobsFromFirebase();
      // console.log(jobs);
      if (jobs.length > 0) {
        lastFetchedTimestamp = new Date(jobs[jobs.length - 1].createdAt.seconds * 1000);
        console.log("here is the lastfetchedtimestamp",lastFetchedTimestamp);
        // await redisClient.set("latest_jobs", JSON.stringify(jobs), "EX", 14400); // Store for 4 hours
        const jobPostings = jobs.map(job => new JobPosting(
          job.jobId,
          job.company,
          job.category,
          job.position,
          job.jobType,
          job.experienceMin,
          job.experienceMax,
          job.salaryRangeStart,
          job.salaryRangeEnd,
          job.jobDescription,
          job.createdAt,
          job.source,
          job.locations,
          job.modesOfWork,
          job.tags
        ));
        await storeJobsInRedis(jobPostings);
        
      }
    }
    // ✅ Ensure jobs are available
    if (jobs.length === 0) {
      console.log("⚠️ No jobs found in Firestore. Returning empty list.");
      res.status(200).json({ jobs: [], totalAvailable: 0, hasMore: false });
      return;
    }

    // ✅ Apply Filters on Cached Data (use lastFetchedTimestamp)
    let filteredJobs = await applyFilters(
      { category, position, experience, salary, location, jobType },
      "latest_jobs"
      // lastFetchedTimestamp
    );
    console.log(`🔍 Jobs after filtering (from Redis): ${filteredJobs.length}`);


    // ✅ Handle pagination & additional fetching logic
    let fetchCount = 0; // Prevent infinite loops

    while (filteredJobs.length < offset + limit) {
      if (fetchCount >= 5) {
        console.log("⚠️ Max fetch attempts reached. Stopping additional fetches.");
        break;
      }


      console.log(`⚠️ Fetching more jobs from Firestore (current: ${filteredJobs.length})...`);
      if (!lastFetchedTimestamp || isNaN(new Date(lastFetchedTimestamp).getTime())) {
        console.log("🚫 Invalid lastFetchedTimestamp. Skipping additional fetch.");
        break;
      } 
      const timestamp = lastFetchedTimestamp 
      ? (lastFetchedTimestamp instanceof Timestamp 
           ? lastFetchedTimestamp
           : Timestamp.fromDate(lastFetchedTimestamp))
      : null;
      const newJobs = await fetchNewJobsFromFirebase(timestamp);
      console.log(`✅ Fetched ${newJobs.length} new jobs from Firestore.`);
      if (newJobs.length === 0) {
        console.log("🚫 No more new jobs available. Stopping fetch.");
        break;
      }
      lastFetchedTimestamp = new Date(newJobs[newJobs.length - 1].createdAt.seconds * 1000);

      jobs = [...jobs, ...newJobs].filter(
        (job, index, self) => index === self.findIndex((j) => j.jobId === job.jobId)
      );
      const newjobPostings = newJobs.map(job => new JobPosting(
        job.jobId,
        job.company,
        job.category,
        job.position,
        job.jobType,
        job.experienceMin,
        job.experienceMax,
        job.salaryRangeStart,
        job.salaryRangeEnd,
        job.jobDescription,
        job.createdAt,
        job.source,
        job.locations,
        job.modesOfWork,
        job.tags
      ));
      await storeJobsInRedis(newjobPostings);
      

      const newFilteredJobs = await applyFilters(
        { category, position, experience, salary, location, jobType },
        "latest_jobs"
        
      );

      console.log(`🔍 Jobs after filtering sahjfb: ${newFilteredJobs.length}`);
      filteredJobs = newFilteredJobs;

      console.log(`✅ Total jobs after adding fresh data: ${filteredJobs.length}`);
      fetchCount++;
    }

    // ✅ Return paginated response
    const paginatedJobs = filteredJobs.slice(offset, offset + limit);

    res.status(200).json({
      jobs: paginatedJobs,
      totalAvailable: filteredJobs.length,
      hasMore: filteredJobs.length > offset + limit,
    });
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


async function getJobsFromRedis(): Promise<JobPosting[]> {
  const keys = await redisClient.keys("latest_jobs:*");
  console.log(`🔍 Found ${keys.length} keys in Redis matching prefix 'latest_jobs:'`);

  const jobs: JobPosting[] = [];

  for (const key of keys) {
    const jobData = await redisClient.call("JSON.GET", key, "$");
    if (jobData) {
      try {
        const parsedArray = JSON.parse(jobData as string);
        const parsedJob = Array.isArray(parsedArray) ? parsedArray[0] : parsedArray; // ✅ Extract first element if array
        if (!parsedJob || !parsedJob.createdAt) {
          console.error(`❌ Missing createdAt in Redis data for key: ${key}`);
          continue;
        }
        jobs.push({
          ...parsedJob,
          createdAt: new Timestamp(parsedJob.createdAt.seconds, parsedJob.createdAt.nanoseconds), // ✅ Convert back to Firestore Timestamp
        });
      } catch (error) {
        console.error(`❌ Error parsing job data from Redis (key: ${key}):`, error);
      }
    }
  }

  return jobs;
}

async function storeJobsInRedis(jobs: JobPosting[]) {
  for (const job of jobs) {
    if (!job || !job.jobId) {
      console.error("❌ Invalid job data. Skipping storage in Redis.");
      continue;
    }

    try {
      // Convert nested timestamp fields to numeric values
      const jobData = {
        ...job.toPlainObject(),
        company: {
          ...job.company,
          postedAtSeconds: job.company.postedAt.seconds,
          postedAtNanoseconds: job.company.postedAt.nanoseconds,
        },
        createdAt: {
          seconds: job.createdAt.seconds, 
          nanoseconds: job.createdAt.nanoseconds,
        },
      };

      // Remove HTML from jobDescription
      if (jobData.company.description) {
        jobData.company.description = jobData.company.description.replace(/<[^>]+>/g, "");
      }

      const jobDataString = JSON.stringify(jobData);
      // console.log(`✅ Storing job in Redis (jobId: ${job.jobId}):`, jobDataString);
      // await redisClient.set(`latest_jobs:${job.jobId}`, jobDataString, "EX", 14400);
      await redisClient.call("JSON.SET", `latest_jobs:${job.jobId}`, "$", JSON.stringify(jobData));
    } catch (error) {
      console.error(`❌ Error storing job in Redis (jobId: ${job.jobId}):`, error);
    }
  }
  console.log("✅ Jobs stored in Redis with the correct prefix.");
}


async function applyFilters(filters: any, redisKey: string): Promise<JobPosting[]> {
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
      conditions.push(`@experienceMin:[0 ${parsedExp.max}]`);
      conditions.push(`@experienceMax:[${parsedExp.min} 50]`);
    }
  }

  if (filters.salary) {
    const parsedSalary = parseSalary(filters.salary as string);
    if (parsedSalary) {
      conditions.push(`@salaryRangeStart:[0 ${parsedSalary.max}]`);
      conditions.push(`@salaryRangeEnd:[${parsedSalary.min} +inf]`);
    }
  }

  if (filters.location) {
    const locationArray = (filters.location as string).split(",");
    const locationQuery = locationArray.map(loc => `"${loc}"`).join("|");
    conditions.push(`@locations:(${locationQuery})`);
  }

  if (filters.jobType) {
    const jobTypeArray = (filters.jobType as string).split(",");
    const jobTypeQuery = jobTypeArray.map(type => `"${type}"`).join("|");
    conditions.push(`@jobType:(${jobTypeQuery})`);
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
      "LIMIT", "0", "1000",
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