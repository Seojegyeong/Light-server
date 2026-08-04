import express from 'express';
import extractRouter from './routes/extract.js';

const app = express();

app.use(express.json());

app.use('/api/extract', extractRouter);

export default app;
