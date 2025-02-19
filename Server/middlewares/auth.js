const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isAuth = async (req, res) => {
    const token = req.cookies.token;
    console.log('Token from auth middleware:', token);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized User!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(500).json({ message: "User not Authenticated!" });
    }
};

module.exports = { isAuth };
