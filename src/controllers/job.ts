import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { db } from "../database/firebase";
import { Job } from "../models/job";
import { collection, doc, writeBatch, setDoc, getDocs, Query, Firestore, query, where, DocumentData } from "firebase/firestore";
import  { mapNaukriJobToJobPosting }  from "../utils/naukri-job";
import { JobPosting } from "models/jobPosting";
// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
export const upload = multer({ storage });

/**
 * Upload and process a JSON file, then insert jobs into Firebase
 */
/*export const uploadJobData = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
       res.status(400).json({ message: "No file uploaded" });
       return;
    }

    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath, "utf8");
    const jobs: Job[] = JSON.parse(fileData);
    console.log(jobs);

    if (!Array.isArray(jobs)) {
      res.status(400).json({ message: "Invalid JSON format" });
      return;
    }

    // Insert jobs into Firebase
    const batch = writeBatch(db);
    jobs.forEach((job) => {
      const jobRef = doc(collection(db, "jobs"), job.jobId);
      batch.set(jobRef, job);
    });

    await batch.commit();
    res.status(201).json({ message: "Jobs inserted successfully", count: jobs.length });
  } catch (error) {
    console.error("Error uploading JSON file:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};*/

/*export const uploadJobData = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath, "utf8");
    const naukriJobs = JSON.parse(fileData);

    if (!Array.isArray(naukriJobs)) {
      res.status(400).json({ message: "Invalid JSON format" });
      return;
    }

    // Transform Naukri job data to Job model
    const jobs: Job[] = naukriJobs.map((naukriJob: any) => mapNaukriJobToJobModel(naukriJob));

    // Insert jobs into Firebase
    const batch = writeBatch(db);
    jobs.forEach((job) => {
      const jobRef = doc(collection(db, "jobs"), job.jobId);
      batch.set(jobRef, job);
    });

    await batch.commit();
    res.status(201).json({ message: "Jobs inserted successfully", count: jobs.length });
  } catch (error) {
    console.error("Error uploading JSON file:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};*/

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

// export const getJobs = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { category, position, experience, salary, location, jobType } = req.query;

//     let jobsRef = collection(db, "jobs"); // ✅ Firestore collection reference
//     let jobQuery: Query = query(jobsRef); // ✅ Initialize query

//     // Apply filters dynamically
//     if (category) {
//       const categoryArray = (category as string).split(",");
//       jobQuery = query(jobQuery, where("category", "in", categoryArray));
//     }

//     if (position) {
//       const positionArray = (position as string).split(",");
//       jobQuery = query(jobQuery, where("position", "in", positionArray));
//     }

//     if (experience) {
//       const experienceArray = (experience as string).split(",");
//       jobQuery = query(jobQuery, where("experienceRequired", "in", experienceArray));
//     }

//     if (salary) {
//       const salaryRange = (salary as string).split(",");
//       jobQuery = query(jobQuery, where("salaryRangeStart", ">=", parseInt(salaryRange[0])));
//       jobQuery = query(jobQuery, where("salaryRangeEnd", "<=", parseInt(salaryRange[1])));
//     }

//     if (location) {
//       const locationArray = (location as string).split(",");
//       jobQuery = query(jobQuery, where("locations", "array-contains-any", locationArray));
//     }

//     if (jobType) {
//       const jobTypeArray = (jobType as string).split(",");
//       jobQuery = query(jobQuery, where("jobType", "in", jobTypeArray));
//     }

//     // Fetch results
//     const snapshot = await getDocs(jobQuery);
//     const jobs = snapshot.docs.map((doc) => ({ jobId: doc.id, ...doc.data() }));

//     res.status(200).json(jobs);
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     res.status(500).json({ message: "Error fetching jobs", error });
//   }
// };

// export const getJobs = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { category, position, experience, salary, location, jobType } = req.query;

//     let jobsRef = collection(db, "jobs"); // ✅ Firestore collection reference
//     let jobQuery: Query<DocumentData> = query(jobsRef); // ✅ Initialize query

//     // ✅ Apply category filter
//     if (category) {
//       const categoryArray = (category as string).split(",");
//       jobQuery = query(jobQuery, where("category", "in", categoryArray));
//     }

//     // ✅ Apply position filter
//     if (position) {
//       const positionArray = (position as string).split(",");
//       jobQuery = query(jobQuery, where("position", "in", positionArray));
//     }

//     let experienceResults: DocumentData[] = [];
//     if (experience) {
//       const experienceArray = (experience as string).split(",");
//       const experienceQueries: Query<DocumentData>[] = [];

//       experienceArray.forEach((exp) => {
//         if (exp === "0 years") {
//           experienceQueries.push(query(jobsRef, where("experienceMin", "==", 0)));
//         } else if (exp.includes("-")) {
//           const [min, max] = exp.split("-").map((num) => parseInt(num));
//           experienceQueries.push(query(jobsRef, where("experienceMin", "<=", max)));
//           experienceQueries.push(query(jobsRef, where("experienceMax", ">=", min)));
//         } else if (exp.includes("+")) {
//           const min = parseInt(exp);
//           experienceQueries.push(query(jobsRef, where("experienceMin", ">=", min)));
//         }
//       });

//       // 🔹 Execute all experience queries separately
//       const experienceSnapshots = await Promise.all(experienceQueries.map((expQuery) => getDocs(expQuery)));

//       // 🔹 Merge results from all experience queries
//       experienceSnapshots.forEach((snapshot) => {
//         snapshot.docs.forEach((doc) => {
//           experienceResults.push({ jobId: doc.id, ...doc.data() } as { jobId: string });
//         });
//       });
//     }

//     // ✅ Fetch all jobs **without** experience filter first
//     const snapshot = await getDocs(jobQuery);
//     let jobs = snapshot.docs.map((doc) => ({ jobId: doc.id, ...doc.data() }));

//     // ✅ Merge jobs from experience filters (avoiding duplicates)
//     if (experienceResults.length > 0) {
//       const jobIds = new Set(jobs.map((job) => job.jobId)); // Track existing jobs
//       experienceResults.forEach((expJob) => {
//         if (!jobIds.has(expJob.jobId)) {
//           jobs.push(expJob as { jobId: string });
//         }
//       });
//     }

//     // ✅ Handle salary range
//     if (salary) {
//       const salaryRange = (salary as string).split(",");
//       jobQuery = query(jobQuery, where("salaryRangeStart", ">=", parseInt(salaryRange[0])));
//       jobQuery = query(jobQuery, where("salaryRangeEnd", "<=", parseInt(salaryRange[1])));
//     }

//     // ✅ Handle location filter
//     if (location) {
//       const locationArray = (location as string).split(",");
//       jobQuery = query(jobQuery, where("locations", "array-contains-any", locationArray));
//     }

//     // ✅ Handle jobType filter
//     if (jobType) {
//       const jobTypeArray = (jobType as string).split(",");
//       jobQuery = query(jobQuery, where("jobType", "in", jobTypeArray));
//     }

//     // 🔹 Fetch main job query results
//     const mainSnapshot = await getDocs(jobQuery);
//     let mainJobs = mainSnapshot.docs.map((doc) => ({ jobId: doc.id, ...doc.data() }));

//     // 🔹 Merge jobs from experience filters (avoiding duplicates)
//     if (experienceResults.length > 0) {
//       const jobIds = new Set(mainJobs.map((job) => job.jobId)); // Track existing jobs
//       experienceResults.forEach((expJob) => {
//         if (!jobIds.has(expJob.jobId)) {
//           mainJobs.push(expJob as { jobId: string });
//         }
//       });
//     }

//     res.status(200).json(jobs);
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     res.status(500).json({ message: "Error fetching jobs", error });
//   }
// };


// export const getJobs = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { category, position, experience, salary, location, jobType } = req.query;

//     let jobsRef = collection(db, "jobs"); // Firestore collection reference
//     let jobQuery: Query<DocumentData> = query(jobsRef); // Initialize query

//     // ✅ Apply category filter
//     if (category) {
//       const categoryArray = (category as string).split(",");
//       jobQuery = query(jobQuery, where("category", "in", categoryArray));
//     }

//     // ✅ Apply position filter
//     if (position) {
//       const positionArray = (position as string).split(",");
//       jobQuery = query(jobQuery, where("position", "in", positionArray));
//     }

//     // ✅ Apply experience filter
//     if (experience) {
//       const experienceArray = (experience as string).split(",");
//       let experienceQueries: Query<DocumentData>[] = [];

//       experienceArray.forEach((exp) => {
//         if (exp === "0 years") {
//           experienceQueries.push(query(jobsRef, where("experienceMin", "==", 0)));
//         } else if (exp.includes("-")) {
//           const [min, max] = exp.split("-").map((num) => parseInt(num));
//           experienceQueries.push(
//             query(jobsRef, where("experienceMin", "<=", max), where("experienceMax", ">=", min))
//           );
//         } else if (exp.includes("+")) {
//           const min = parseInt(exp);
//           experienceQueries.push(query(jobsRef, where("experienceMin", ">=", min)));
//         }
//       });

//       // 🔹 Fetch all experience-based queries separately
//       const experienceSnapshots = await Promise.all(experienceQueries.map((expQuery) => getDocs(expQuery)));

//       // 🔹 Merge results from all experience queries
//       let experienceResults: DocumentData[] = [];
//       experienceSnapshots.forEach((snapshot) => {
//         snapshot.docs.forEach((doc) => {
//           experienceResults.push({ jobId: doc.id, ...doc.data() });
//         });
//       });
//     }

//     // ✅ Apply salary range filter
//     if (salary) {
//       const salaryRange = (salary as string).split(",");
//       const minSalary = parseInt(salaryRange[0]);
//       const maxSalary = parseInt(salaryRange[1]);

//       if (!isNaN(minSalary) && !isNaN(maxSalary)) {
//         jobQuery = query(
//           jobQuery,
//           where("salaryRangeStart", ">=", minSalary),
//           where("salaryRangeEnd", "<=", maxSalary)
//         );
//       }
//     }

//     // ✅ Apply location filter
//     if (location) {
//       const locationArray = (location as string).split(",");
//       jobQuery = query(jobQuery, where("locations", "array-contains-any", locationArray));
//     }

//     // ✅ Apply jobType filter
//     if (jobType) {
//       const jobTypeArray = (jobType as string).split(",");
//       jobQuery = query(jobQuery, where("jobType", "in", jobTypeArray));
//     }

//     // 🔹 Fetch final job query results
//     const snapshot = await getDocs(jobQuery);
//     const jobs = snapshot.docs.map((doc) => ({ jobId: doc.id, ...doc.data() }));

//      res.status(200).json(jobs);
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     res.status(500).json({ message: "Error fetching jobs", error });
//   }
// };

// export const getJobs = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { category, position, experience, salary, location, jobType } = req.query;

//     let jobsRef = collection(db, "jobs");
//     let jobQuery: Query<DocumentData> = query(jobsRef);

//     // ✅ Apply category filter
//     if (category) {
//       const categoryArray = (category as string).split(",");
//       jobQuery = query(jobQuery, where("category", "in", categoryArray));
//     }

//     // ✅ Apply position filter
//     if (position) {
//       const positionArray = (position as string).split(",");
//       jobQuery = query(jobQuery, where("position", "in", positionArray));
//     }

//     // ✅ Apply experience filter (Using a single query)
//     if (experience) {
//       const experienceArray = (experience as string).split(",");
//       let minExp = Infinity, maxExp = -Infinity;

//       experienceArray.forEach((exp) => {
//         if (exp === "0 years") {
//           minExp = Math.min(minExp, 0);
//           maxExp = Math.max(maxExp, 0);
//         } else if (exp.includes("-")) {
//           const [min, max] = exp.split("-").map(Number);
//           minExp = Math.min(minExp, min);
//           maxExp = Math.max(maxExp, max);
//         } else if (exp.includes("+")) {
//           const min = parseInt(exp);
//           minExp = Math.min(minExp, min);
//           maxExp = Math.max(maxExp, 50); // Assume 50+ is max for safety
//         }
//       });

//       if (minExp !== Infinity && maxExp !== -Infinity) {
//         jobQuery = query(jobQuery, where("experienceMax", ">=", minExp), where("experienceMin", "<=", maxExp));
//       }
//     }

//     // ✅ Apply salary range filter
//     if (salary) {
//       const [minSalary, maxSalary] = (salary as string).split(",").map(Number);
//       if (!isNaN(minSalary) && !isNaN(maxSalary)) {
//         jobQuery = query(jobQuery, where("salaryRangeStart", ">=", minSalary), where("salaryRangeEnd", "<=", maxSalary));
//       }
//     }

//     // ✅ Apply location filter
//     if (location) {
//       const locationArray = (location as string).split(",");
//       jobQuery = query(jobQuery, where("locations", "array-contains-any", locationArray));
//     }

//     // ✅ Apply jobType filter
//     if (jobType) {
//       const jobTypeArray = (jobType as string).split(",");
//       jobQuery = query(jobQuery, where("jobType", "in", jobTypeArray));
//     }

//     // 🔹 Fetch jobs based on filters
//     const snapshot = await getDocs(jobQuery);
//     const jobs = snapshot.docs.map((doc) => ({ jobId: doc.id, ...doc.data() }));

//     res.status(200).json(jobs);
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//      res.status(500).json({ message: "Error fetching jobs", error });
//   }
// };


export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, position, experience, salary, location, jobType } = req.query;
    // console.log("Query params:", req.query.category, position, experience, salary, location, jobType);
    console.log("query params:" , req.query.salary)
    let jobsRef = collection(db, "jobs");
    let jobQuery: Query<DocumentData> = jobsRef; // Start with base reference
    let experienceResults: DocumentData[] = []; // To store experience-filtered results

    // ✅ Apply category filter
    if (category) {
      const categoryArray = (category as string).split(",");
      jobQuery = query(jobQuery, where("category", "in", categoryArray));
    }

    // ✅ Apply position filter
    if (position) {
      const positionArray = (position as string).split(",");
      jobQuery = query(jobQuery, where("position", "in", positionArray));
    }

    // ✅ Apply experience filter
    // if (experience) {
    //   const experienceArray = (experience as string).split(",");
    //   let minExp = Infinity, maxExp = -Infinity;

    //   experienceArray.forEach((exp) => {
    //     if (exp === "0 years") {
    //       minExp = Math.min(minExp, 0);
    //       maxExp = Math.max(maxExp, 0);
    //     } else if (exp.includes("-")) {
    //       const [min, max] = exp.split("-").map((num) => parseInt(num));
    //       // console.log("Experience range:", min, max);
    //       minExp = Math.min(minExp, min);
    //       maxExp = Math.max(maxExp, max);
    //     } else if (exp.includes("+")) {
    //       const min = parseInt(exp.replace(" years", ""));
    //       minExp = Math.min(minExp, min);
    //       maxExp = Math.max(maxExp, 50); // Assume 50+ as the highest limit
    //     }
    //   });

    //   if (minExp !== Infinity && maxExp !== -Infinity) {
    //     // Firestore does NOT allow multiple range conditions in a single query
    //     console.log("Experience range:", minExp, maxExp);
    //       jobQuery = query(
    //       jobQuery,
    //       where("experienceMax", ">=", minExp), 
    //       where("experienceMin", "<=", maxExp)
    //     );
    //   }
    // }
    if (experience) {
      console.log("Raw Experience Query Param:", experience);
  
      // Fix the issue: Replace double spaces ("  ") back to "+"
      let normalizedExperience = (experience as string).replace(/\s{2}/g, "+");
  
      console.log("Normalized Experience:", normalizedExperience);
  
      const experienceArray = normalizedExperience.split(",");
      let minExp = Infinity, maxExp = -Infinity;
  
      experienceArray.forEach((exp) => {
          if (exp === "0 years") {
              minExp = Math.min(minExp, 0);
              maxExp = Math.max(maxExp, 0);
          } else if (exp.includes("-")) {
              const [min, max] = exp.split("-").map((num) => parseInt(num.trim()));
              minExp = Math.min(minExp, min);
              maxExp = Math.max(maxExp, max);
          } else if (exp.includes("+")) {
              const extractedExp = exp.split("+")[0].trim(); // Extract only the number before "+"
              console.log("Extracted Experience Value Before Parsing:", extractedExp);
  
              minExp = Math.min(minExp, parseInt(extractedExp));
              maxExp = Math.max(maxExp, 50); // Assume 50+ as the highest limit
          }
      });
  
      if (minExp !== Infinity && maxExp !== -Infinity) {
          // Firestore does NOT allow multiple range conditions in a single query
          console.log("Final Experience Range:", minExp, maxExp);
          jobQuery = query(
              jobQuery,
              where("experienceMax", ">=", minExp), 
              where("experienceMin", "<=", maxExp)
          );
      }
  }
  

    // ✅ Apply salary range filter
    if (salary) {
      console.log("Raw Salary Query Param:", salary);
  
      // Fix the issue: Replace double spaces ("  ") back to "+"
      let normalizedSalary = (salary as string).replace(/\s{2}/g, "+");
  
      console.log("Normalized Salary:", normalizedSalary);
  
      let minSalary = 0, maxSalary = Infinity;
  
      if (typeof normalizedSalary === "string" && normalizedSalary.includes("-")) {
          const [min, max] = normalizedSalary.split("-").map((num) => parseInt(num.trim()));
          minSalary = min;
          maxSalary = max;
      } else if (typeof normalizedSalary === "string" && normalizedSalary.includes("+")) {
          const extractedValue = normalizedSalary.split("+")[0].trim();
          console.log("Extracted salary value before parsing:", extractedValue);
  
          minSalary = parseInt(extractedValue);
          maxSalary = Infinity; // No upper limit for "10+ LPA"
      }
  
      console.log("Final Salary Range:", minSalary, maxSalary);
  
      jobQuery = query(
          jobQuery,
          where("salaryRangeEnd", ">=", minSalary), // Job's max salary should be greater than minSalary
          where("salaryRangeStart", "<=", maxSalary) 
      );
  }
    

    // ✅ Apply location filter
    if (location) {
      const locationArray = (location as string).split(",");
      jobQuery = query(jobQuery, where("locations", "array-contains-any", locationArray));
    }

    // ✅ Apply jobType filter
    if (jobType) {
      const jobTypeArray = (jobType as string).split(",");
      jobQuery = query(jobQuery, where("jobType", "in", jobTypeArray));
    }

    // 🔹 Fetch jobs based on other filters
    const snapshot = await getDocs(jobQuery);
    // console.log("Fetched jobs:", snapshot.size);
    let jobs = snapshot.docs.map((doc) => ({ jobId: doc.id, ...doc.data() }));

    // 🔹 Merge experience filter results with other filters (avoiding duplicates)
    if (experienceResults.length > 0) {
      const jobIds = new Set(jobs.map((job) => job.jobId)); // Track existing jobs
      experienceResults.forEach((expJob) => {
        if (!jobIds.has(expJob.jobId)) {
          jobs.push(expJob as { jobId: string });
        }
      });
    }
    console.log("Total jobs:", jobs.length);
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Error fetching jobs", error });
  }
};
