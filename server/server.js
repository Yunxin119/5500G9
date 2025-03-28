import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { connectDB } from './connectDB.js';
export const app = express();
const PORT = 10210;
import userRoutes from './routes/UserRoutes.js';
import companyRoutes from './routes/CompanyRoutes.js';
// MARK: middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MARK: CORS
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:3001',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});