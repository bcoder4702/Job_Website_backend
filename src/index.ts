import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routes/index';
import helmet from 'helmet';
import limiter from './middlewares/rate-limitter';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});