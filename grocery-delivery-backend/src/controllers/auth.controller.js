const User = require('../models/User.model');

// 🚀 REGISTER CONTROLLER
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: 'Please fill all fields!' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already registered!' });
        }

        const newUser = new User({ name, email, phone, password });
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// 🔑 LOGIN CONTROLLER
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter email and password!' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        return res.status(200).json({
            token: 'mock_jwt_token_from_backend',
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};