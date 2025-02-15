import jwt from 'jsonwebtoken';

const generateTokenAndCookie = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Only use HTTPS in production
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/',
        domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.COOKIE_DOMAIN
    });

    return token;
};

export default generateTokenAndCookie;