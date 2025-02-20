import { Position } from "../models/jobPosting";

function determinePosition(jobTitle: string): Position {
  const lowerTitle = jobTitle.toLowerCase();

  if (lowerTitle.includes("intern") || lowerTitle.includes("trainee")) {
    return Position.INTERN;
  }
  if (lowerTitle.includes("junior") || lowerTitle.includes("associate")) {
    return Position.ASE;
  }
  if (lowerTitle.includes("software developer") || lowerTitle.includes("sde") || lowerTitle.includes("software engineer")) {
    return Position.SD;
  }
  if (lowerTitle.includes("full stack")) {
    return Position.FULL_STACK_DEV;
  }
  if (lowerTitle.includes("frontend")) {
    return Position.FRONTEND_DEV;
  }
  if (lowerTitle.includes("backend")) {
    return Position.BACKEND_DEV;
  }
  if (lowerTitle.includes("mobile")) {
    return Position.MOBILE_DEV;
  }
  if (lowerTitle.includes("devops")) {
    return Position.DEVOPS_ENGINEER;
  }
  if (lowerTitle.includes("data scientist") || lowerTitle.includes("ml engineer") || lowerTitle.includes("ai engineer")) {
    return Position.DATA_SCIENTIST;
  }
  if (lowerTitle.includes("security") || lowerTitle.includes("cybersecurity")) {
    return Position.SECURITY_ENGINEER;
  }
  if (lowerTitle.includes("qa") || lowerTitle.includes("test engineer")) {
    return Position.QA_ENGINEER;
  }
  if (lowerTitle.includes("ui/ux") || lowerTitle.includes("graphic designer")) {
    return Position.UI_UX_DESIGNER;
  }
  if (lowerTitle.includes("game developer")) {
    return Position.GAME_DEVELOPER;
  }
  if (lowerTitle.includes("cloud") || lowerTitle.includes("infra")) {
    return Position.CLOUD_ENGINEER;
  }
  if (lowerTitle.includes("project manager") || lowerTitle.includes("product manager")) {
    return Position.PRODUCT_MANAGER;
  }
  if (lowerTitle.includes("tech lead") || lowerTitle.includes("team lead")) {
    return Position.TL;
  }
  if (lowerTitle.includes("engineering manager")) {
    return Position.EM;
  }

  return Position.SE; // Default position
}


export { determinePosition };