import express from "express";
import { uploadJobData, upload, getAllJobs, getJobs } from "../controllers/job";
import { get } from "http";
import {getJobsValidator} from "../middlewares/validators/job";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadJobData);
router.get("/alljobs", getJobs); 
router.get("/aljobs", getJobsValidator, getAllJobs);

export default router;
