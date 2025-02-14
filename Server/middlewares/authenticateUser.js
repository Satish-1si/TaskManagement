const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        // console.log(decoded,"========decoded")// Use your secret key
        req.userId = decoded.id; // Attach user ID to request object
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized, token is invalid' });
    }
};

module.exports = authenticateUser;
