// This file contains the functions for user registration, login, and user profile.
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate token
const generateToken = (user) => jwt.sign({id: user._id,role: user.role}, process.env.JWT_SECRET, {expiresIn: '8d'});


// Register a new user
export const registerUser = async (req, res) => {
    try{
    const {name, email, password, role, age, gender,interests,location} = req.body;
    if(!name || !email || !password || !role)
        return res.status(400).json({message: 'Please provide all required fields'});

        // existing user check
        const existingUser = await User.findOne({email});
        if(existingUser)
            return res.status(400).json({message: 'User already exists'});
        
        const user = await User.create({name, email, password , role, age, gender,interests,location});
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user)
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    }
};

// Login user
export const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user||!(await user.comparePassword(password))) 
            return res.status(401).json({message: 'Invalid email or password'});

        res.json({_id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user)});
    } catch (err) {
        res.status(500).json({message: 'Internal server error'});
    }   
    };
    // Get user profile

    export const getUserProfile = async (req, res) => {
        res.json(req.user);
    };
    



    