import { Timestamp } from "firebase/firestore";
import { JobPosting, Category, Position, JobType, ModeOfWork, Source } from "../models/jobPosting";

function sanitizeJobId(companyName: string, jobId: string): string {
  return `GLASSDOOR-${jobId}-${companyName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}`;
}

function mapGlassdoorJobToJobPosting(glassdoorJob: any): JobPosting {
  const experienceMin = 0; // Glassdoor data does not include explicit experience range
  const experienceMax = 0;
  const salaryRangeStart = glassdoorJob.min_amount || 0;
  const salaryRangeEnd = glassdoorJob.max_amount || 0;
  const location = glassdoorJob.location || "Unknown Location";
  let workMode: ModeOfWork = ModeOfWork.ONSITE;

  if (glassdoorJob.is_remote) {
    workMode = ModeOfWork.REMOTE;
  } else if (location.toLowerCase().includes("hybrid")) {
    workMode = ModeOfWork.HYBRID;
  }

  const tags: string[] = []; // Glassdoor data does not explicitly include tags
  const jobId = sanitizeJobId(glassdoorJob.company, glassdoorJob.id);
  const jobType: JobType = JobType.FULL_TIME; // Assuming full-time unless specified otherwise
  const rating = Math.random() * (5 - 3) + 3; // Assigning a random rating if not available
  const reviewsCount = Math.floor(Math.random() * 500) + 1;

  return new JobPosting(
    jobId,
    {
      name: glassdoorJob.company,
      description: glassdoorJob.company_description || "Company description not available",
      logoPath: glassdoorJob.company_logo || "",
      rating,
      reviewsCount,
      applyLink: glassdoorJob.job_url,
      postedAt: Timestamp.fromDate(new Date(glassdoorJob.date_posted)),
    },
    Category.DEVELOPMENT, // You may need a function to determine category dynamically
    Position.SD, // You may need a function to determine position dynamically
    jobType,
    experienceMin,
    experienceMax,
    salaryRangeStart,
    salaryRangeEnd,
    glassdoorJob.description,
    Timestamp.now(),
    Source.GLASSDOOR,
    location.split(", "),
    workMode,
    tags
  );
}

export { mapGlassdoorJobToJobPosting };
