// Middleware to check if user is authenticated or not
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try{
        const token = req.headers.authorization;
        if(!token || !token.startsWith('Bearer '))

            return res.status(401).json({message: 'Not authorized, no token'});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if(!req.user)
            return res.status(401).json({message: 'Not authorized, user not found'});
            next();
        }

        catch (err) {
            return res.status(401).json({message: 'Token Failed or expired'});
        }
    };

    export const admin = (req, res, next) => {
        if(req.user?.role !== 'admin')
            return res.status(403).json({message: 'Not authorized as an admin'});
        
        next();
    };


    