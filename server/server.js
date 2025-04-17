import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { connectDB } from './connectDB.js';
export const app = express();
const PORT = process.env.PORT || 10210;
import userRoutes from './routes/UserRoutes.js';
import companyRoutes from './routes/CompanyRoutes.js';
// MARK: middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MARK: CORS
const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);

// MARK: Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '/client/build')));
    
    // Any route that's not an API route will be redirected to index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});