const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/User");

const signup = async (req, res) => {
    try {
        const { name, email, password, branch } = req.body;
        
        // Check if user already exists
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }
        
        // Hash password with await (FIX: was missing await before)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const userModel = new UserModel({ 
            name, 
            email, 
            password: hashedPassword, 
            branch 
        });
        
        await userModel.save();
        
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            });
            
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        
        // Compare passwords
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        
        // Generate JWT token
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: user.name
            });
            
    } catch (err) {
        console.error('Login error:', err);
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            });
    }
};

module.exports = {
    signup,
    login
};