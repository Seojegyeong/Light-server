import express from 'express';
import cors from 'cors';
import extractRouter from './routes/extract.js';

const app = express();

app.use(cors());
app.use(express.json());

// /api/extract 경로로 들어오는 요청을 extractRouter에서 처리
app.use('/api/extract', extractRouter);

export default app;
