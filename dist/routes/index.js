"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const health_1 = __importDefault(require("./health"));
const job_1 = __importDefault(require("./job"));
const app = express_1.default.Router();
app.use('/health', health_1.default);
app.use('/job', job_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map