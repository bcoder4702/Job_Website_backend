import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redis-client";

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (command: string, ...args: (string | number | Buffer)[]) => redisClient.call(command, ...args) as Promise<any>, // Uses ioredis
  }),
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // Allow max 100 requests per IP per minute
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;

