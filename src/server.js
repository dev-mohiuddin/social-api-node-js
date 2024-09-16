import express, { urlencoded } from 'express';
import multer from 'multer';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import v1Routes from './router/index.js';
import { globarError, notFound } from './middleware/globalErrorHandel.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;


// middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: "*",
    // credentials: true,
}
app.use(cors(corsOptions));

app.get('/', (_req, res) => {
    res.send('Hello World!');
});
app.use('/api', v1Routes);

// 404 error handler
app.use(notFound);

// globar error handler
app.use(globarError);

// server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});