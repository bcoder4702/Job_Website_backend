import { Request, RequestHandler, Response } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { db } from "../database/firebase";
import { collection, doc, writeBatch, getDocs, query, Timestamp, orderBy, limit } from "firebase/firestore";
import  { mapNaukriJobToJobPosting }  from "../utils/naukri-job";
import { JobPosting } from "../models/jobPosting";
import { applyFilters, getJobsFromRedis, storeJobsInRedis } from "../services/redis-queries";
import { fetchJobsFromFirebase, fetchNewJobsFromFirebase } from "../services/firebase-queries";
import { mapLinkedInJobToJobPosting } from "../utils/linkedin-job";

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
  const { source } = req.query;
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath, "utf8");
    // const naukriJobs = JSON.parse(fileData);
    // const jobData = JSON.parse(fileData);
    // xlet jobData;
    const cleanedFileData = fileData.replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Removes bad control chars
    const jobData = JSON.parse(cleanedFileData);


    if (!Array.isArray(jobData)) {
      fs.unlinkSync(filePath); // Delete the uploaded file
      res.status(400).json({ message: "Invalid JSON format" });
      return;
    }
    let jobs: JobPosting[] = [];
    // Transform Naukri job data to Job model
    // const jobs: JobPosting[] = naukriJobs.map((naukriJob: any) => mapNaukriJobToJobPosting(naukriJob));

    if (source === "naukri") {
      jobs = jobData.map((job: any) => mapNaukriJobToJobPosting(job));
    } else if (source === "linkedin") {
      jobs = jobData.map((job: any) => mapLinkedInJobToJobPosting(job));
    } else {
      fs.unlinkSync(filePath);
      res.status(400).json({ message: "Invalid source provided" });
      return;
    }

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

/**
 * This function is for only testing purposes
 */

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


/**
 * Get job postings with optional filters
 */


export const getJobs: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { timeRange, category, position, experience, salary, location, jobType, page = 1 } = req.query;
    const limit = 60;
    const offset = (Number(page) - 1) * limit;

    console.log("⏳ Checking Redis for cached jobs...");
    let jobs: JobPosting[] = [];
    let lastVisibleId: string | null = null;

    // ✅ Try getting jobs from Redis
    const redisData = await getJobsFromRedis();

    if(redisData.jobs.length!==0){
      jobs = redisData.jobs;
      lastVisibleId = redisData.lastVisibleId;
      console.log(`✅ Found ${jobs.length} jobs in Redis cache.`);
    }
    else{
        const { jobs: fetchedJobs, lastDoc } = await fetchJobsFromFirebase();
        jobs = fetchedJobs;
        lastVisibleId = lastDoc?.id || null;
        if (jobs.length > 0) {
          console.log("📍 Storing lastVisibleId:", lastVisibleId);
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
          await storeJobsInRedis(jobPostings, lastDoc);
    }
  }

    if (jobs.length === 0) {
      console.log("⚠️ No jobs found. Returning empty list.");
      res.status(200).json({ jobs: [], totalAvailable: 0, hasMore: false });
      return;
    }

    let filteredJobs = await applyFilters({ timeRange, category, position, experience, salary, location, jobType }, "latest_jobs");
    console.log(`🔍 Jobs after filtering (from Redis): ${filteredJobs.length}`);

    let fetchCount = 0;
    while (filteredJobs.length < offset + limit && fetchCount < 5) {

      console.log(`⚠️ Fetching more jobs from Firestore (current: ${filteredJobs.length})...`);

      const { jobs: newJobs, lastDoc } = await fetchNewJobsFromFirebase(lastVisibleId);
      console.log(`✅ Fetched ${newJobs.length} new jobs from Firestore.`);

      if (newJobs.length === 0) {
        console.log("🚫 No more new jobs available. Stopping fetch.");
        break;
      }

      lastVisibleId = lastDoc?.id || null;
      jobs = [...jobs, ...newJobs].filter((job, index, self) => index === self.findIndex((j) => j.jobId === job.jobId));
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
      await storeJobsInRedis(newjobPostings, lastDoc);

      filteredJobs = await applyFilters({ timeRange, category, position, experience, salary, location, jobType }, "latest_jobs");
      console.log(`✅ Total jobs after adding fresh data: ${filteredJobs.length}`);

      fetchCount++;
    }

    const paginatedJobs = filteredJobs.slice(0, offset + limit);
    res.status(200).json(
      paginatedJobs
  );
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};



/*export const getJobs: RequestHandler = async (req: Request, res: Response) => {
    const { timeRange, category, position, experience, salary, location, jobType, page = 1 } = req.query;
    const limit = 60;
    const offset = (Number(page) - 1) * limit;
    const job_counter  = limit+offset;
    let jobs: JobPosting[] = [];

    try{

      while(job_counter > 0){
        let filteredJobs = await applyFilters({ timeRange, category, position, experience, salary, location, jobType }, "latest_jobs");

        if(filteredJobs.length ==0 ){
           let firebaseJobs = await fetchNewJobsFromFirebase(null);
        }
      }

    } catch (error) {
        console.error("❌ Error fetching jobs:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}*/