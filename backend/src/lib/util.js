//Generate JWT token for authentication

import jwt from 'jsonwebtoken';

const generateToken = (id, res)=>{
    const token = jwt.sign({id},process.env.JWT_SECRET, { expiresIn:"7d" })

    res.cookie('jwttoken',token,{
        maxAge: 7 * 24 * 60* 60 * 1000, //in Milliseconds as per syntax, 
        httpOnly: true, //to prevent XSS attack?
        sameSite: 'strict', //again to prevent some attacks.. 
        secure: process.env.NODE_ENV !== 'development', //if node_env = production, this will become true.
    });
    return token;
};

export default generateToken;