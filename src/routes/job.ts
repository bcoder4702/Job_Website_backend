import express from "express";
import { uploadJobData, upload, getAllJobs, getJobs } from "../controllers/job";
import { get } from "http";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadJobData);
router.get("/alljobs", getJobs); 

export default router;
