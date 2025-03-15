import { Timestamp } from "firebase/firestore";
import { JobPosting, Category, Position, JobType, ModeOfWork, Source } from "../models/jobPosting";
import { determineCategory } from "./determineCategory";
import { determinePosition } from "./determinePosition";

/*function sanitizeJobId(companyName: string, jobId: string): string {
  return `LINKEDIN-${jobId}-${companyName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}`;
}*/

function sanitizeJobId(companyName: string | undefined, jobId: string | undefined): string {
    const safeCompanyName = companyName ? companyName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") : "UnknownCompany";
    const safeJobId = jobId ? jobId : `UnknownJob-${Date.now()}`;
    return `LINKEDIN-${safeJobId}-${safeCompanyName}`;
  }
  

function parseExperience(description: string): { experienceMin: number; experienceMax: number } {
  const experienceRegex = /(\d+)[+ -]*(\d+)?/;
  const match = description.match(experienceRegex);
  if (match) {
    return {
      experienceMin: parseInt(match[1]),
      experienceMax: match[2] ? parseInt(match[2]) : parseInt(match[1]),
    };
  }
  return { experienceMin: 0, experienceMax: 0 };
}

function parseSalary(description: string): { salaryRangeStart: number; salaryRangeEnd: number } {
  const salaryRegex = /\$?(\d{1,3}(?:,\d{3})*)(?:\s*-\s*\$?(\d{1,3}(?:,\d{3})*))?/;
  const match = description.match(salaryRegex);
  if (match) {
    return {
      salaryRangeStart: parseInt(match[1].replace(/,/g, "")) || 0,
      salaryRangeEnd: match[2] ? parseInt(match[2].replace(/,/g, "")) : 0,
    };
  }
  return { salaryRangeStart: 0, salaryRangeEnd: 0 };
}

function parseModesOfWork(description: string): ModeOfWork {
  if (description.toLowerCase().includes("remote")) return ModeOfWork.REMOTE;
  if (description.toLowerCase().includes("hybrid")) return ModeOfWork.HYBRID;
  return ModeOfWork.ONSITE;
}

function extractTags(description: string): string[] {
  return description.match(/\b([A-Za-z]+)\b/g) || [];
}

function mapLinkedInJobToJobPosting(linkedinJob: any): JobPosting {

  const jobId = sanitizeJobId(linkedinJob["Company Name"], linkedinJob["Poster Id"]);
  const category = determineCategory(linkedinJob.Title);
  const position = determinePosition(linkedinJob.Title);
  const jobType: JobType = JobType.FULL_TIME;
  const experience = parseExperience(linkedinJob.Description);
  const salary = parseSalary(linkedinJob.Description);
  const workMode = parseModesOfWork(linkedinJob["Primary Description"]);
  const tags = extractTags(linkedinJob.Description);
  const companyName = linkedinJob["Company Name"] || "Unknown Company";

  return new JobPosting(
    jobId,
    {
      name: companyName,
      description: linkedinJob.Description || "Company description not available",
      logoPath: linkedinJob["Company Logo"] || "",
      rating: Math.random() * (5 - 3) + 3, // Fallback rating
      reviewsCount: Math.floor(Math.random() * 500) + 1, // Placeholder
      applyLink: linkedinJob["Detail URL"],
      postedAt: Timestamp.fromDate(new Date(linkedinJob["Created At"])),
    },
    category,
    position,
    jobType,
    experience.experienceMin,
    experience.experienceMax,
    salary.salaryRangeStart,
    salary.salaryRangeEnd,
    linkedinJob.Description,
    Timestamp.now(),
    Source.LINKEDIN,
    linkedinJob.Location.split(", "),
    workMode,
    tags
  );
}

export { mapLinkedInJobToJobPosting };
