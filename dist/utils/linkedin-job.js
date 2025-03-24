"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLinkedInJobToJobPosting = mapLinkedInJobToJobPosting;
const firestore_1 = require("firebase/firestore");
const jobPosting_1 = require("../models/jobPosting");
const determineCategory_1 = require("./determineCategory");
const determinePosition_1 = require("./determinePosition");
/*function sanitizeJobId(companyName: string, jobId: string): string {
  return `LINKEDIN-${jobId}-${companyName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}`;
}*/
function sanitizeJobId(companyName, jobId) {
    const safeCompanyName = companyName ? companyName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") : "UnknownCompany";
    const safeJobId = jobId ? jobId : `UnknownJob-${Date.now()}`;
    return `LINKEDIN-${safeJobId}-${safeCompanyName}`;
}
function parseExperience(description) {
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
function parseSalary(description) {
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
function parseModesOfWork(description) {
    if (description.toLowerCase().includes("remote"))
        return jobPosting_1.ModeOfWork.REMOTE;
    if (description.toLowerCase().includes("hybrid"))
        return jobPosting_1.ModeOfWork.HYBRID;
    return jobPosting_1.ModeOfWork.ONSITE;
}
function extractTags(description) {
    return description.match(/\b([A-Za-z]+)\b/g) || [];
}
function mapLinkedInJobToJobPosting(linkedinJob) {
    const jobId = sanitizeJobId(linkedinJob["Company Name"], linkedinJob["Poster Id"]);
    const category = (0, determineCategory_1.determineCategory)(linkedinJob.Title);
    const position = (0, determinePosition_1.determinePosition)(linkedinJob.Title);
    const jobType = jobPosting_1.JobType.FULL_TIME;
    const experience = parseExperience(linkedinJob.Description);
    const salary = parseSalary(linkedinJob.Description);
    const workMode = parseModesOfWork(linkedinJob["Primary Description"]);
    const tags = extractTags(linkedinJob.Description);
    const companyName = linkedinJob["Company Name"] || "Unknown Company";
    return new jobPosting_1.JobPosting(jobId, {
        name: companyName,
        description: linkedinJob.Description || "Company description not available",
        logoPath: linkedinJob["Company Logo"] || "",
        rating: Math.random() * (5 - 3) + 3, // Fallback rating
        reviewsCount: Math.floor(Math.random() * 500) + 1, // Placeholder
        applyLink: linkedinJob["Detail URL"],
        postedAt: firestore_1.Timestamp.fromDate(new Date(linkedinJob["Created At"])),
    }, category, position, jobType, experience.experienceMin, experience.experienceMax, salary.salaryRangeStart, salary.salaryRangeEnd, linkedinJob.Description, firestore_1.Timestamp.now(), jobPosting_1.Source.LINKEDIN, linkedinJob.Location.split(", "), workMode, tags);
}
//# sourceMappingURL=linkedin-job.js.map