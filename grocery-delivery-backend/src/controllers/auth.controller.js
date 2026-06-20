const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// 💡 JWT Secret එක ආරක්ෂිතව ලබාගැනීම සහ Fallback එකක් තැබීම
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback_key_for_development_123';

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

        // යූසර්ව සේව් කිරීම
        const newUser = new User({ name, email, phone, password });
        await newUser.save();

        // 💡 BEST PRACTICE: Register වුණු ගමන්ම ටෝකන් එකක් හදලා යවනවා (UX එක පට්ට වෙනවා)
        const token = jwt.sign(
            { id: newUser._id },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        return res.status(201).json({ 
            message: 'User registered successfully!',
            token: token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });

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

        // 💡 ඊමේල් එකෙන් යූසර්ව හොයාගන්නවා
        const user = await User.findOne({ email });
        
        // 💡 සෙකියුරිටි ටිප්: යූසර් නැතත්, පාස්වර්ඩ් වැරදුණත් දෙන්නෙ එකම පොදු මැසේජ් එක (Invalid email or password)
        // එතකොට හැකර්ස්ලට ලෙහෙසියෙන් ඊමේල් තියෙනවද නැද්ද කියලා බලාගන්න බෑ.
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        // 🚀 සිරාම JWT Token එක සාදනවා (Crash නොවෙන්න JWT_SECRET එක උඩින් වැලිඩේට් කරලා තියෙන්නේ)
        const token = jwt.sign(
            { id: user._id }, 
            JWT_SECRET, 
            { expiresIn: '30d' } 
        );

        // රෙස්පොන්ස් එක ෆ්‍රන්ට්එන්ඩ් එකට යැවීම
        return res.status(200).json({
            token: token,
            user: { id: user._id, name: user.name, email: user.email }
        });
        
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};