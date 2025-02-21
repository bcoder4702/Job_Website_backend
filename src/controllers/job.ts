import { Request, RequestHandler, Response } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { db } from "../database/firebase";
import { Job } from "../models/job";
import { collection, doc, writeBatch, setDoc, getDocs, Query, Firestore, query, where, DocumentData } from "firebase/firestore";
import  { mapNaukriJobToJobPosting }  from "../utils/naukri-job";
import { JobPosting } from "models/jobPosting";
// import redisClient from "../config/redis-client"
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
     console.log("Flushing Redis cache...");
    //  await redisClient.flushall(); // `flushall()` in ioredis does not take arguments

    res.status(201).json({ message: "Jobs inserted successfully", count: jobs.length });
  } catch (error) {
    console.error("Error uploading JSON file:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};



/**
 * Get all job postings from Firebase Firestore
 */
export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    // console.log("Fetching all jobs");
    const jobsCollection = collection(db, "jobs");
    const snapshot = await getDocs(jobsCollection);

    if (snapshot.empty) {
      res.status(404).json({ message: "No jobs found" });
      return;
    }

    const jobs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getJobs: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { category, position, experience, salary, location, jobType } = req.query;

    console.log("⏳ Fetching from Firestore...");
    let jobsRef = collection(db, "jobs");
    let jobQuery: Query<DocumentData> = jobsRef; // Start with base reference

    // Apply the most selective filter first
    if (category) {
      jobQuery = query(jobQuery, where("category", "==", category));
    }

    // Fetch jobs based on the initial filter
    const snapshot = await getDocs(jobQuery);
    let jobs = snapshot.docs.map((doc) => ({ jobId: doc.id, ...doc.data() } as JobPosting));

    // Apply remaining filters in memory
    if (position) {
      const positionArray = (position as string).split(",");
      jobs = jobs.filter(job => positionArray.includes(job.position));
    }

    if (experience) {
      const parsedExp = parseExperience(experience as string);
      if (parsedExp) {
        jobs = jobs.filter(job => job.experienceMin <= parsedExp.max && job.experienceMax >= parsedExp.min);
      }
    }

    if (salary) {
      const parsedSalary = parseSalary(salary as string);
      if (parsedSalary) {
        jobs = jobs.filter(job => job.salaryRangeStart <= parsedSalary.max && job.salaryRangeEnd >= parsedSalary.min);
      }
    }

    if (location) {
      const locationArray = (location as string).split(",");
      jobs = jobs.filter(job => locationArray.some(loc => job.locations.includes(loc)));
    }

    if (jobType) {
      const jobTypeArray = (jobType as string).split(",");
      jobs = jobs.filter(job => jobTypeArray.includes(job.jobType));
    }

    console.log("Total jobs:", jobs.length);
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Error fetching jobs", error });
  }
};

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