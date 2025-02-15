import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectMiddleware = async (req, res, next) => {
    console.log('=== Request Details ===');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Cookies:', JSON.stringify(req.cookies, null, 2));
    console.log('Origin:', req.headers.origin);
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    
    const token = req.cookies.jwt;
    console.log('Token from cookies:', token);

    if (!token) {
        console.log('No token found in request');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        const user = await User.findById(decoded.id).select('-password');
        console.log('Found user:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('No user found with token ID');
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export default protectMiddleware;