"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const job_1 = require("../controllers/job");
const job_2 = require("../middlewares/validators/job");
const router = express_1.default.Router();
router.post("/upload", job_1.upload.single("file"), job_1.uploadJobData);
router.get("/alljobs", job_1.getJobs);
router.get("/aljobs", job_2.getJobsValidator, job_1.getAllJobs);
exports.default = router;
//# sourceMappingURL=job.js.map