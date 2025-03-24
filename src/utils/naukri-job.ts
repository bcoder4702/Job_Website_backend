import { Timestamp } from "firebase/firestore";
import { JobPosting, Category, Position, JobType, ModeOfWork, Source } from "../models/jobPosting";
import { determineCategory } from "./determineCategory";
import { determinePosition } from "./determinePosition";

function sanitizeJobId(companyName: string, jobId: string): string {
  return `${jobId}-${companyName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}`;
}

/*function parseExperience(experienceLabel: string): { experienceMin: number; experienceMax: number } {
  const match = experienceLabel.match(/(\d+)-?(\d+)?/);
  
  if (match) {
    const experienceMin = parseInt(match[1]); // Extracts the lower range
    const experienceMax = match[2] ? parseInt(match[2]) : experienceMin; // Uses upper range or defaults to min
    return { experienceMin, experienceMax };
  }
  
  return { experienceMin: 0, experienceMax: 0 }; // Default if no experience is found
}*/
function parseExperience(experienceLabel: string): { experienceMin: number; experienceMax: number } {
  const match = experienceLabel.match(/(\d+)-?(\d+)?/);

  if (match) {
    const experienceMin = parseInt(match[1]); // Extracts the lower range
    const experienceMax = match[2] ? parseInt(match[2]) : 1000; // ✅ If no upper range, set it to 1000
    return { experienceMin, experienceMax };
  }

  return { experienceMin: 0, experienceMax: 1000 }; // Default if no experience is found
}


function mapNaukriJobToJobPosting(naukriJob: any): JobPosting {
  let experienceMin = 0;
  let experienceMax = 0;
  let salaryRangeStart = 0;
  let salaryRangeEnd = 0;
  let location = "";
  let workMode: ModeOfWork = ModeOfWork.ONSITE;

  naukriJob.placeholders.forEach((placeholder: any) => {
    if (placeholder.type === "experience") {
      const experience = parseExperience(placeholder.label);
      experienceMin = experience.experienceMin;
      experienceMax = experience.experienceMax;
    }
    if (placeholder.type === "salary") {
      const salaryParts = placeholder.label.replace(" Lacs PA", "").split("-");
      salaryRangeStart = parseFloat(salaryParts[0]) || 0;
      salaryRangeEnd = parseFloat(salaryParts[1]) || 0;
    }
    if (placeholder.type === "location") {
      location = placeholder.label;
      if (location.toLowerCase().includes("hybrid")) {
        workMode = ModeOfWork.HYBRID;
      } else if (location.toLowerCase().includes("remote")) {
        workMode = ModeOfWork.REMOTE;
      }
    }
  });

  const tags = naukriJob.tagsAndSkills ? naukriJob.tagsAndSkills.split(",") : [];
  const jobId = sanitizeJobId(naukriJob.companyName, naukriJob.jobId);
  const jobType: JobType = JobType.FULL_TIME;
  const rating = parseFloat(naukriJob.ambitionBoxData?.AggregateRating) || Math.random() * (5 - 3) + 3;
  const reviewsCount = naukriJob.ambitionBoxData?.ReviewsCount || Math.floor(Math.random() * 500) + 1;
  const category = determineCategory(naukriJob.title);
  const position = determinePosition(naukriJob.title);

  return new JobPosting(
    jobId,
    {
      name: naukriJob.companyName,
      description: "Company description not available",
      logoPath: naukriJob.logoPath,
      rating,
      reviewsCount,
      applyLink: `https://www.naukri.com${naukriJob.jdURL}`,
      postedAt: Timestamp.fromMillis(naukriJob.createdDate),
    },
    category, // You may need a function to determine category dynamically
    position, // You may need a function to determine position dynamically
    jobType,
    experienceMin,
    experienceMax,
    salaryRangeStart,
    salaryRangeEnd,
    naukriJob.jobDescription,
    Timestamp.now(),
    Source.NAUKRI,
    location.split(", "), // Convert to an array of locations
    workMode,
    tags
  );
}

export { mapNaukriJobToJobPosting };
