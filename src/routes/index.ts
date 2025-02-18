import express from 'express';
import healthRouter from './health';
import jobRouter from './job';

const app = express.Router();

app.use('/health', healthRouter);
app.use('/job', jobRouter);

export default app;
