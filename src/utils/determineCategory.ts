import { Category } from "../models/jobPosting";

function determineCategory(jobTitle: string): Category {
  const lowerTitle = jobTitle.toLowerCase();

  if (lowerTitle.includes("developer") || lowerTitle.includes("engineer")) {
    return Category.DEVELOPMENT;
  }
  if (lowerTitle.includes("tester") || lowerTitle.includes("qa")) {
    return Category.TESTING;
  }
  if (lowerTitle.includes("designer") || lowerTitle.includes("ui") || lowerTitle.includes("ux")) {
    return Category.DESIGN;
  }
  if (lowerTitle.includes("marketing") || lowerTitle.includes("seo") || lowerTitle.includes("digital marketing")) {
    return Category.MARKETING;
  }
  if (lowerTitle.includes("support") || lowerTitle.includes("technical support")) {
    return Category.SUPPORT;
  }
  if (lowerTitle.includes("network") || lowerTitle.includes("cloud") || lowerTitle.includes("security") || lowerTitle.includes("devops")) {
    return Category.ENGINEERING;
  }
  if (lowerTitle.includes("sales") || lowerTitle.includes("business development")) {
    return Category.SALES;
  }

  return Category.DEVELOPMENT; // Default category
}

export { determineCategory };