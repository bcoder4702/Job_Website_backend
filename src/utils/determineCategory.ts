import { Category } from "../models/jobPosting";

function determineCategory(jobTitle: string): Category {
  const lowerTitle = jobTitle.toLowerCase();

  if (
    lowerTitle.includes("developer") ||
    lowerTitle.includes("engineer") ||
    lowerTitle.includes("software") ||
    lowerTitle.includes("programmer") ||
    lowerTitle.includes("full stack") ||
    lowerTitle.includes("backend") ||
    lowerTitle.includes("frontend")
  ) {
    return Category.DEVELOPMENT;
  }

  if (
    lowerTitle.includes("tester") ||
    lowerTitle.includes("qa") ||
    lowerTitle.includes("quality assurance") ||
    lowerTitle.includes("test engineer")
  ) {
    return Category.TESTING;
  }

  if (
    lowerTitle.includes("designer") ||
    lowerTitle.includes("ui") ||
    lowerTitle.includes("ux") ||
    lowerTitle.includes("graphic") ||
    lowerTitle.includes("visual design")
  ) {
    return Category.DESIGN;
  }

  if (
    lowerTitle.includes("marketing") ||
    lowerTitle.includes("seo") ||
    lowerTitle.includes("digital marketing") ||
    lowerTitle.includes("social media")
  ) {
    return Category.MARKETING;
  }

  if (
    lowerTitle.includes("support") ||
    lowerTitle.includes("technical support") ||
    lowerTitle.includes("customer service") ||
    lowerTitle.includes("bpo")
  ) {
    return Category.SUPPORT;
  }

  if (
    lowerTitle.includes("network") ||
    lowerTitle.includes("cloud") ||
    lowerTitle.includes("security") ||
    lowerTitle.includes("devops") ||
    lowerTitle.includes("system administrator")
  ) {
    return Category.ENGINEERING;
  }

  if (
    lowerTitle.includes("sales") ||
    lowerTitle.includes("business development") ||
    lowerTitle.includes("inside sales") ||
    lowerTitle.includes("lead generation")
  ) {
    return Category.SALES;
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

  return Category.OTHER; // Default category
}

export { determineCategory };
