"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobs = exports.getAllJobs = exports.uploadJobData = exports.upload = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const firebase_1 = require("../database/firebase");
const firestore_1 = require("firebase/firestore");
const naukri_job_1 = require("../utils/naukri-job");
const redis_queries_1 = require("../services/redis-queries");
const firebase_queries_1 = require("../services/firebase-queries");
const linkedin_job_1 = require("../utils/linkedin-job");
// Configure Multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path_1.default.extname(file.originalname));
    },
});
exports.upload = (0, multer_1.default)({ storage });
/**
 * Upload a JSON file containing job postings to Firebase Firestore
 */
/*export const uploadJobData = async (req: Request, res: Response): Promise<void> => {
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
      batch.set(jobRef, job);
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
};*/
/*export const uploadJobData = async (req: Request, res: Response): Promise<void> => {
  const { source } = req.query;
  let filePath: string | null = null; // Track file path
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    filePath = req.file.path;
    const fileData = fs.readFileSync(filePath, "utf8");
    const cleanedFileData = fileData.replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Removes bad control chars
    const jobData = JSON.parse(cleanedFileData);

    if (!Array.isArray(jobData)) {
      fs.unlinkSync(filePath); // Delete the uploaded file
      res.status(400).json({ message: "Invalid JSON format" });
      return;
    }

    let jobs: JobPosting[] = [];
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
      batch.set(jobRef, JSON.parse(JSON.stringify(job))); // ✅ Convert class instance to plain object
    });

    await batch.commit();

    // unlink the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });

    res.status(201).json({ message: "Jobs inserted successfully", count: jobs.length });
  } catch (error) {
    console.error("Error uploading JSON file:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};*/
const uploadJobData = async (req, res) => {
    const { source } = req.query;
    let filePath = null; // Track file path
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        filePath = req.file.path; // Store the file path
        const fileData = fs_1.default.readFileSync(filePath, "utf8");
        const cleanedFileData = fileData.replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Removes bad control chars
        const jobData = JSON.parse(cleanedFileData);
        if (!Array.isArray(jobData)) {
            res.status(400).json({ message: "Invalid JSON format" });
            return;
        }
        let jobs = [];
        if (source === "naukri") {
            jobs = jobData.map((job) => (0, naukri_job_1.mapNaukriJobToJobPosting)(job));
        }
        else if (source === "linkedin") {
            jobs = jobData.map((job) => (0, linkedin_job_1.mapLinkedInJobToJobPosting)(job));
        }
        else {
            res.status(400).json({ message: "Invalid source provided" });
            return;
        }
        // Insert jobs into Firebase
        const batch = (0, firestore_1.writeBatch)(firebase_1.db);
        jobs.forEach((job) => {
            const jobRef = (0, firestore_1.doc)((0, firestore_1.collection)(firebase_1.db, "jobs"), job.jobId);
            batch.set(jobRef, JSON.parse(JSON.stringify(job))); // Convert class instance to plain object
        });
        await batch.commit();
        res.status(201).json({ message: "Jobs inserted successfully", count: jobs.length });
    }
    catch (error) {
        console.error("Error uploading JSON file:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
    finally {
        // ✅ Always delete the file, even if an error occurs
        if (filePath) {
            fs_1.default.unlink(filePath, (err) => {
                if (err)
                    console.error("Error deleting file:", err);
                else
                    console.log("✅ Uploaded file deleted successfully");
            });
        }
    }
};
exports.uploadJobData = uploadJobData;
/**
 * This function is for only testing purposes
 */
const getAllJobs = async (req, res) => {
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
        const jobsRef = (0, firestore_1.collection)(firebase_1.db, "jobs");
        const jobQuery = (0, firestore_1.query)(jobsRef, (0, firestore_1.orderBy)("createdAt", "desc"), (0, firestore_1.limit)(1000));
        const snapshot = await (0, firestore_1.getDocs)(jobQuery);
        if (snapshot.empty) {
            res.status(404).json({ message: "No jobs found" });
            return;
        }
        const jobs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: new firestore_1.Timestamp(doc.data().createdAt.seconds, doc.data().createdAt.nanoseconds)
        }));
        // ✅ **Store in Redis with a 4-hour expiration**
        // await redisClient.set(cacheKey, JSON.stringify(jobs), "EX", 14400);
        res.status(200).json(jobs);
    }
    catch (error) {
        console.error("❌ Error fetching jobs:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
exports.getAllJobs = getAllJobs;
/**
 * Get job postings with optional filters
 */
const getJobs = async (req, res) => {
    try {
        const { companyName, timeRange, category, position, experience, salary, location, jobType, page = 1 } = req.query;
        const limit = 60;
        const offset = (Number(page) - 1) * limit;
        console.log("companyNmae", companyName);
        console.log("⏳ Checking Redis for cached jobs...");
        // let lastVisibleId: string | null = null;
        // const job_present = await checkRedis();
        const { jobsPresent, lastVisibleId: redisLastVisibleId } = await (0, redis_queries_1.checkRedis)();
        let lastVisibleId = redisLastVisibleId;
        if (!jobsPresent) {
            // console.log("✅ Found jobs in Redis cache.");
            // lastVisibleId = redisLastVisibleId;
            // console.log("📍 this lastVisibleId from redis will be passed to firebase:", lastVisibleId);
            const { jobs: fetchedJobs, lastDoc } = await (0, firebase_queries_1.fetchJobsFromFirebase)();
            // jobs = fetchedJobs;
            lastVisibleId = lastDoc?.id || null;
            if (fetchedJobs.length > 0) {
                console.log("📍 Storing lastVisibleId:", lastVisibleId);
                await (0, redis_queries_1.storeJobsInRedis)(fetchedJobs, lastDoc);
            }
        }
        let filteredJobs = await (0, redis_queries_1.applyFilters)({ companyName, timeRange, category, position, experience, salary, location, jobType }, "latest_jobs", limit + offset);
        console.log(`🔍 Jobs after filtering (from Redis): ${filteredJobs.length}`);
        let fetchCount = 0;
        while (filteredJobs.length < offset + limit && fetchCount < 5) {
            console.log(`⚠️ Fetching more jobs from Firestore (current: ${filteredJobs.length})...`);
            const { jobs: newJobs, lastDoc } = await (0, firebase_queries_1.fetchNewJobsFromFirebase)(lastVisibleId);
            console.log(`✅ Fetched ${newJobs.length} new jobs from Firestore.`);
            if (newJobs.length === 0) {
                console.log("🚫 No more new jobs available. Stopping fetch.");
                break;
            }
            lastVisibleId = lastDoc?.id || null;
            await (0, redis_queries_1.storeJobsInRedis)(newJobs, lastDoc);
            filteredJobs = await (0, redis_queries_1.applyFilters)({ companyName, timeRange, category, position, experience, salary, location, jobType }, "latest_jobs", limit + offset);
            console.log(`✅ Total jobs after adding fresh data: ${filteredJobs.length}`);
            fetchCount++;
        }
        const paginatedJobs = filteredJobs;
        res.status(200).json(paginatedJobs);
    }
    catch (error) {
        console.error("❌ Error fetching jobs:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
exports.getJobs = getJobs;
//# sourceMappingURL=job.js.map