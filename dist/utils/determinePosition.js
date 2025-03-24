"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determinePosition = determinePosition;
const jobPosting_1 = require("../models/jobPosting");
function determinePosition(jobTitle) {
    const lowerTitle = jobTitle.toLowerCase();
    if (lowerTitle.includes("intern") || lowerTitle.includes("trainee") || lowerTitle.includes("apprentice")) {
        return jobPosting_1.Position.INTERN;
    }
    if (lowerTitle.includes("junior") || lowerTitle.includes("associate") || lowerTitle.includes("fresher")) {
        return jobPosting_1.Position.ASE;
    }
    if (lowerTitle.includes("software developer") || lowerTitle.includes("software engineer") || lowerTitle.includes("developer roles")) {
        return jobPosting_1.Position.SD;
    }
    if (lowerTitle.includes("full stack") || lowerTitle.includes("full-stack")) {
        return jobPosting_1.Position.FULL_STACK_DEV;
    }
    if (lowerTitle.includes("frontend") || lowerTitle.includes("front-end") || lowerTitle.includes("ui developer")) {
        return jobPosting_1.Position.FRONTEND_DEV;
    }
    if (lowerTitle.includes("backend") || lowerTitle.includes("back-end") || lowerTitle.includes("server-side")) {
        return jobPosting_1.Position.BACKEND_DEV;
    }
    if (lowerTitle.includes("mobile") || lowerTitle.includes("android") || lowerTitle.includes("ios")) {
        return jobPosting_1.Position.MOBILE_DEV;
    }
    if (lowerTitle.includes("devops") || lowerTitle.includes("infrastructure") || lowerTitle.includes("cloud engineer")) {
        return jobPosting_1.Position.DEVOPS_ENGINEER;
    }
    if (lowerTitle.includes("data scientist") || lowerTitle.includes("ml engineer") || lowerTitle.includes("ai engineer") || lowerTitle.includes("data analyst")) {
        return jobPosting_1.Position.DATA_SCIENTIST;
    }
    if (lowerTitle.includes("security") || lowerTitle.includes("cybersecurity") || lowerTitle.includes("infosec")) {
        return jobPosting_1.Position.SECURITY_ENGINEER;
    }
    if (lowerTitle.includes("qa") || lowerTitle.includes("test engineer") || lowerTitle.includes("quality assurance")) {
        return jobPosting_1.Position.QA_ENGINEER;
    }
    if (lowerTitle.includes("ui/ux") || lowerTitle.includes("graphic designer") || lowerTitle.includes("ux designer") || lowerTitle.includes("ui designer")) {
        return jobPosting_1.Position.UI_UX_DESIGNER;
    }
    if (lowerTitle.includes("game developer") || lowerTitle.includes("game designer")) {
        return jobPosting_1.Position.GAME_DEVELOPER;
    }
    if (lowerTitle.includes("cloud") || lowerTitle.includes("infrastructure")) {
        return jobPosting_1.Position.CLOUD_ENGINEER;
    }
    if (lowerTitle.includes("project manager") || lowerTitle.includes("product manager") || lowerTitle.includes("business analyst")) {
        return jobPosting_1.Position.PRODUCT_MANAGER;
    }
    if (lowerTitle.includes("tech lead") || lowerTitle.includes("team lead") || lowerTitle.includes("lead engineer")) {
        return jobPosting_1.Position.TL;
    }
    if (lowerTitle.includes("engineering manager") || lowerTitle.includes("development manager")) {
        return jobPosting_1.Position.EM;
    }
    return jobPosting_1.Position.OTHER; // Default position
}
//# sourceMappingURL=determinePosition.js.map