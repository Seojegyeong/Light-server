import express from 'express';
import extractRouter from './routes/extract.js';

const app = express(); // Express 앱 인스턴스 생성

app.use(express.json()); // 요청 body를 JSON으로 파싱

// /api/extract 경로로 들어오는 요청을 extractRouter에서 처리
app.use('/api/extract', extractRouter);

export default app;
