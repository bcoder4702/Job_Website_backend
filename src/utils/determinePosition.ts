import { Position } from "../models/jobPosting";

function determinePosition(jobTitle: string): Position {
  const lowerTitle = jobTitle.toLowerCase();

  if (lowerTitle.includes("intern") || lowerTitle.includes("trainee") || lowerTitle.includes("apprentice")) {
    return Position.INTERN;
  }
  if (lowerTitle.includes("junior") || lowerTitle.includes("associate") || lowerTitle.includes("fresher")) {
    return Position.ASE;
  }
  if (lowerTitle.includes("software developer") || lowerTitle.includes("software engineer") || lowerTitle.includes("developer roles")) {
    return Position.SD;
  }
  if (lowerTitle.includes("full stack") || lowerTitle.includes("full-stack")) {
    return Position.FULL_STACK_DEV;
  }
  if (lowerTitle.includes("frontend") || lowerTitle.includes("front-end") || lowerTitle.includes("ui developer")) {
    return Position.FRONTEND_DEV;
  }
  if (lowerTitle.includes("backend") || lowerTitle.includes("back-end") || lowerTitle.includes("server-side")) {
    return Position.BACKEND_DEV;
  }
  if (lowerTitle.includes("mobile") || lowerTitle.includes("android") || lowerTitle.includes("ios")) {
    return Position.MOBILE_DEV;
  }
  if (lowerTitle.includes("devops") || lowerTitle.includes("infrastructure") || lowerTitle.includes("cloud engineer")) {
    return Position.DEVOPS_ENGINEER;
  }
  if (lowerTitle.includes("data scientist") || lowerTitle.includes("ml engineer") || lowerTitle.includes("ai engineer") || lowerTitle.includes("data analyst")) {
    return Position.DATA_SCIENTIST;
  }
  if (lowerTitle.includes("security") || lowerTitle.includes("cybersecurity") || lowerTitle.includes("infosec")) {
    return Position.SECURITY_ENGINEER;
  }
  if (lowerTitle.includes("qa") || lowerTitle.includes("test engineer") || lowerTitle.includes("quality assurance")) {
    return Position.QA_ENGINEER;
  }
  if (lowerTitle.includes("ui/ux") || lowerTitle.includes("graphic designer") || lowerTitle.includes("ux designer") || lowerTitle.includes("ui designer")) {
    return Position.UI_UX_DESIGNER;
  }
  if (lowerTitle.includes("game developer") || lowerTitle.includes("game designer")) {
    return Position.GAME_DEVELOPER;
  }
  if (lowerTitle.includes("cloud") || lowerTitle.includes("infrastructure")) {
    return Position.CLOUD_ENGINEER;
  }
  if (lowerTitle.includes("project manager") || lowerTitle.includes("product manager") || lowerTitle.includes("business analyst")) {
    return Position.PRODUCT_MANAGER;
  }
  if (lowerTitle.includes("tech lead") || lowerTitle.includes("team lead") || lowerTitle.includes("lead engineer")) {
    return Position.TL;
  }
  if (lowerTitle.includes("engineering manager") || lowerTitle.includes("development manager")) {
    return Position.EM;
  }

  return Position.OTHER; // Default position
}

export { determinePosition };
