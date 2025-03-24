"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineCategory = determineCategory;
const jobPosting_1 = require("../models/jobPosting");
function determineCategory(jobTitle) {
    const lowerTitle = jobTitle.toLowerCase();
    if (lowerTitle.includes("developer") ||
        lowerTitle.includes("engineer") ||
        lowerTitle.includes("software") ||
        lowerTitle.includes("programmer") ||
        lowerTitle.includes("full stack") ||
        lowerTitle.includes("backend") ||
        lowerTitle.includes("frontend")) {
        return jobPosting_1.Category.DEVELOPMENT;
    }
    if (lowerTitle.includes("tester") ||
        lowerTitle.includes("qa") ||
        lowerTitle.includes("quality assurance") ||
        lowerTitle.includes("test engineer")) {
        return jobPosting_1.Category.TESTING;
    }
    if (lowerTitle.includes("designer") ||
        lowerTitle.includes("ui") ||
        lowerTitle.includes("ux") ||
        lowerTitle.includes("graphic") ||
        lowerTitle.includes("visual design")) {
        return jobPosting_1.Category.DESIGN;
    }
    if (lowerTitle.includes("marketing") ||
        lowerTitle.includes("seo") ||
        lowerTitle.includes("digital marketing") ||
        lowerTitle.includes("social media")) {
        return jobPosting_1.Category.MARKETING;
    }
    if (lowerTitle.includes("support") ||
        lowerTitle.includes("technical support") ||
        lowerTitle.includes("customer service") ||
        lowerTitle.includes("bpo")) {
        return jobPosting_1.Category.SUPPORT;
    }
    if (lowerTitle.includes("network") ||
        lowerTitle.includes("cloud") ||
        lowerTitle.includes("security") ||
        lowerTitle.includes("devops") ||
        lowerTitle.includes("system administrator")) {
        return jobPosting_1.Category.ENGINEERING;
    }
    if (lowerTitle.includes("sales") ||
        lowerTitle.includes("business development") ||
        lowerTitle.includes("inside sales") ||
        lowerTitle.includes("lead generation")) {
        return jobPosting_1.Category.SALES;
    }
    // if (
    //   lowerTitle.includes("civil engineer") ||
    //   lowerTitle.includes("construction") ||
    //   lowerTitle.includes("structural")
    // ) {
    //   return Category.CIVIL_ENGINEERING;
    // }
    // if (
    //   lowerTitle.includes("electrical engineer") ||
    //   lowerTitle.includes("electrical design") ||
    //   lowerTitle.includes("electronics")
    // ) {
    //   return Category.ELECTRICAL_ENGINEERING;
    // }
    // if (
    //   lowerTitle.includes("mechanical engineer") ||
    //   lowerTitle.includes("automobile") ||
    //   lowerTitle.includes("manufacturing")
    // ) {
    //   return Category.MECHANICAL_ENGINEERING;
    // }
    // if (
    //   lowerTitle.includes("financial analyst") ||
    //   lowerTitle.includes("investment banking") ||
    //   lowerTitle.includes("capital market")
    // ) {
    //   return Category.FINANCE;
    // }
    // if (
    //   lowerTitle.includes("recruiter") ||
    //   lowerTitle.includes("talent acquisition") ||
    //   lowerTitle.includes("hr")
    // ) {
    //   return Category.HUMAN_RESOURCES;
    // }
    return jobPosting_1.Category.OTHER; // Default category
}
//# sourceMappingURL=determineCategory.js.map