// Here is the code for authentication middleware
// This middleware will check if the user is authenticated or not
// If the user is authenticated, it will add the user object to the request object
// If the user is not authenticated, it will return a 401 error with a message
// If the user is an admin, it will allow the request to go through
// If the user is not an admin, it will return a 403 error with a message

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header || !header.startsWith('Bearer '))
      return res.status(401).json({ message: 'Not authorized, no token' });

    //extract ONLY the token (was verifying the whole "Bearer xxx" string)
    const token = header.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Not authorized, user not found' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Token Failed or expired' });
  }
};

export const admin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized as an admin' });
  next();
};
