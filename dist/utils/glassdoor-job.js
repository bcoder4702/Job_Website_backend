"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapGlassdoorJobToJobPosting = mapGlassdoorJobToJobPosting;
const firestore_1 = require("firebase/firestore");
const jobPosting_1 = require("../models/jobPosting");
function sanitizeJobId(companyName, jobId) {
    return `GLASSDOOR-${jobId}-${companyName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}`;
}
function mapGlassdoorJobToJobPosting(glassdoorJob) {
    const experienceMin = 0; // Glassdoor data does not include explicit experience range
    const experienceMax = 0;
    const salaryRangeStart = glassdoorJob.min_amount || 0;
    const salaryRangeEnd = glassdoorJob.max_amount || 0;
    const location = glassdoorJob.location || "Unknown Location";
    let workMode = jobPosting_1.ModeOfWork.ONSITE;
    if (glassdoorJob.is_remote) {
        workMode = jobPosting_1.ModeOfWork.REMOTE;
    }
    else if (location.toLowerCase().includes("hybrid")) {
        workMode = jobPosting_1.ModeOfWork.HYBRID;
    }
    const tags = []; // Glassdoor data does not explicitly include tags
    const jobId = sanitizeJobId(glassdoorJob.company, glassdoorJob.id);
    const jobType = jobPosting_1.JobType.FULL_TIME; // Assuming full-time unless specified otherwise
    const rating = Math.random() * (5 - 3) + 3; // Assigning a random rating if not available
    const reviewsCount = Math.floor(Math.random() * 500) + 1;
    return new jobPosting_1.JobPosting(jobId, {
        name: glassdoorJob.company,
        description: glassdoorJob.company_description || "Company description not available",
        logoPath: glassdoorJob.company_logo || "",
        rating,
        reviewsCount,
        applyLink: glassdoorJob.job_url,
        postedAt: firestore_1.Timestamp.fromDate(new Date(glassdoorJob.date_posted)),
    }, jobPosting_1.Category.DEVELOPMENT, // You may need a function to determine category dynamically
    jobPosting_1.Position.SD, // You may need a function to determine position dynamically
    jobType, experienceMin, experienceMax, salaryRangeStart, salaryRangeEnd, glassdoorJob.description, firestore_1.Timestamp.now(), jobPosting_1.Source.GLASSDOOR, location.split(", "), workMode, tags);
}
//# sourceMappingURL=glassdoor-job.js.map