// import Redis from "ioredis";
// import dotenv from "dotenv";

// dotenv.config();

// const redisClient = new Redis({
//   host: "localhost", // If running Redis in Docker locally
//   port: 6379, // Default Redis port
//   retryStrategy: (times) => Math.min(times * 50, 2000), // Reconnect strategy
// });

// redisClient.on("connect", () => console.log("✅ Connected to Redis"));
// redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

// export default redisClient;
