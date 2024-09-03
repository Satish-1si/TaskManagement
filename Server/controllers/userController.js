const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(getId){
    return jwt.sign({getId},process.env.JWT_SECERET,{
        expiresIn:3*24*60*60,
    })
}

const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    // console.log(req.body)
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        // Save the user to the database
        const savedUser = await newUser.save();

        if (savedUser) {
            const token = generateToken(savedUser._id);
            res.cookie('token', token, {
                withCreadentials: true,
                httpOnly: true,
                secure: true, // Required for SameSite=None
             sameSite: 'None'
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email,
                },
                token
            })
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "server Message from /register"
        })
    }
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        // console.log(user)
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid password!' });
        }

        // Generate a token
        const token = generateToken(user._id);
            res.cookie('token', token, {
                withCreadentials: true,
                httpOnly: true,
                secure: true, // Required for SameSite=None
                sameSite: 'None'
            });

        // Respond with the user data
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token
        });
    } catch (error) {
        console.log('Login Error:', error);
        return res.status(500).json({
            success: false,
            message: "Server error from /login",
        });
    }
};

const logoutUser = (req,res)=>{
    // console.log(req.cookie)
    res.cookie("token",'',{
        expires:new Date(0),
        httpOnly:true,
        secure: true, // Required for SameSite=None
    sameSite: 'None',
        withCredentials:true
    })
    return res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
}





module.exports = {registerUser,loginUser,logoutUser}