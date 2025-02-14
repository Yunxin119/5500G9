import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { connectDB } from './connectDB.js';
export const app = express();
const PORT = process.env.PORT || 5001;
import userRoutes from './routes/UserRoutes.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MARK: CORS
const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// MARK: middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});