"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobsValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const celebrate_1 = require("celebrate");
exports.getJobsValidator = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.QUERY]: joi_1.default.object({
        companyName: joi_1.default.string().trim().optional(),
        timeRange: joi_1.default.string().optional(), // Adjust based on valid time ranges
        category: joi_1.default.string().trim().optional(),
        position: joi_1.default.string().trim().optional(),
        experience: joi_1.default.number().integer().min(0).optional(),
        salary: joi_1.default.number().integer().min(0).optional(),
        location: joi_1.default.string().trim().optional(),
        jobType: joi_1.default.string().optional(), // Adjust based on valid types
        page: joi_1.default.number().integer().min(1).default(1),
    }),
});
//# sourceMappingURL=job.js.map