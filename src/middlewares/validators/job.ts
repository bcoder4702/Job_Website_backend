import Joi from "joi";
import { celebrate, Segments } from "celebrate";

export const getJobsValidator = celebrate({
  [Segments.QUERY]: Joi.object({
    companyName: Joi.string().trim().optional(),
    timeRange: Joi.string().optional(), // Adjust based on valid time ranges
    category: Joi.string().trim().optional(),
    position: Joi.string().trim().optional(),
    experience: Joi.number().integer().min(0).optional(),
    salary: Joi.number().integer().min(0).optional(),
    location: Joi.string().trim().optional(),
    jobType: Joi.string().optional(), // Adjust based on valid types
    page: Joi.number().integer().min(1).default(1),
  }),
});
