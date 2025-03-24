"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisClient = new ioredis_1.default({
    host: process.env.REDIS_HOST, // If running Redis in Docker locally
    port: 15112, // Default Redis port
    username: process.env.REDIS_USERNAME, // Redis Cloud uses "default" as the username
    password: process.env.REDIS_PASSWORD, // Replace with your actual password
    retryStrategy: (times) => Math.min(times * 50, 2000), // Reconnect strategy
});
/*const redisClient = new Redis({
 host: "localhost", // If running Redis in Docker locally
 port: 6379, // Default Redis port
 retryStrategy: (times) => Math.min(times * 50, 2000), // Reconnect strategy
});*/ //hey
async function createIndex() {
    try {
        const existingIndexes = await redisClient.call("FT._LIST");
        if (existingIndexes.includes("idx:latest_jobs")) {
            console.log("✅ Index 'idx:latest_jobs' already exists. Skipping creation.");
            return;
        }
        await redisClient.call('FT.CREATE', 'idx:latest_jobs', // Index name
        'ON', 'JSON', // Specify that the data is stored as JSON
        'PREFIX', '1', 'latest_jobs:', // Prefix for the keys to be indexed
        'SCHEMA', // Define the schema for the index
        '$.jobId', 'AS', 'jobId', 'TAG', '$.company.name', 'AS', 'companyName', 'TEXT', '$.company.postedAt.seconds', 'AS', 'postedAtSeconds', 'NUMERIC', '$.company.postedAt.nanoseconds', 'AS', 'postedAtNanoseconds', 'NUMERIC', '$.company.applyLink', 'AS', 'applyLink', 'TEXT', '$.company.rating', 'AS', 'rating', 'NUMERIC', '$.company.description', 'AS', 'companyDescription', 'TEXT', '$.company.reviewsCount', 'AS', 'reviewsCount', 'NUMERIC', '$.company.logoPath', 'AS', 'logoPath', 'TEXT', '$.category', 'AS', 'category', 'TAG', '$.position', 'AS', 'position', 'TEXT', '$.jobType', 'AS', 'jobType', 'TEXT', '$.experienceMin', 'AS', 'experienceMin', 'NUMERIC', '$.experienceMax', 'AS', 'experienceMax', 'NUMERIC', '$.salaryRangeStart', 'AS', 'salaryRangeStart', 'NUMERIC', '$.salaryRangeEnd', 'AS', 'salaryRangeEnd', 'NUMERIC', '$.jobDescription', 'AS', 'jobDescription', 'TEXT', '$.createdAt.seconds', 'AS', 'createdAtSeconds', 'NUMERIC', '$.createdAt.nanoseconds', 'AS', 'createdAtNanoseconds', 'NUMERIC', '$.source', 'AS', 'source', 'TAG', '$.locations', 'AS', 'locations', 'TAG', // ✅ Fix: Array indexing
        '$.modesOfWork', 'AS', 'modesOfWork', 'TAG', '$.tags', 'AS', 'tags', 'TAG' // ✅ Fix: Array indexing
        );
        console.log('✅ Index created successfully');
    }
    catch (error) {
        console.error('❌ Error creating index:', error);
    }
}
createIndex();
redisClient.on("connect", () => console.log("✅ Connected to Redis"));
redisClient.on("error", (err) => console.error("❌ Redis Error:", err));
exports.default = redisClient;
//# sourceMappingURL=redis-client.js.map