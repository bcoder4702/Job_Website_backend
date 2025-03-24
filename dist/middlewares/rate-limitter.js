"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const redis_client_1 = __importDefault(require("../config/redis-client"));
const limiter = (0, express_rate_limit_1.default)({
    store: new rate_limit_redis_1.default({
        sendCommand: (command, ...args) => redis_client_1.default.call(command, ...args), // Uses ioredis
    }),
    windowMs: 60 * 1000, // 1 minute window
    max: 10, // Allow max 100 requests per IP per minute
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});
exports.default = limiter;
//# sourceMappingURL=rate-limitter.js.map