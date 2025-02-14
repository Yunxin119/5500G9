import jwt from 'jsonwebtoken';

const generateTokenAndCookie = (id, res) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});
    //Set JWT as HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
    //   sameSite: 'strict',
      maxAge: 30*24*60*60*1000 // 30 days
    })
    return token;
}

export default generateTokenAndCookie;