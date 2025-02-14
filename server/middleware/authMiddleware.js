import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectMiddleware = async (req, res, next) => {
    const token = req.cookies.jwt;
    console.log('Token:', token);

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, check login status' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password'); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authorization Error:', error.message);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};