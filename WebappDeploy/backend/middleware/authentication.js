const jwt = require('jsonwebtoken');
const userLogins = require('../models/User');

// Makes sure the user is a allowed member
const authoriseUser = ({ allowUser = false, allowZeus = false, allowOwner = false }) => {
    return async (req, res, next) => {
        try {

            // Get the token
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Access token is missing or invalid' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
            req.user = decoded;

            const user = await userLogins.findById(req.user.id); // Find the user member
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (
                (allowOwner && user.isOwner) || // Owner has the highest access level
                (allowZeus && user.isZeus) || // Zeus's have a lower access level
                (allowUser && !user.isOwner && !user.isZeus) // Users have lowest of levels
            ) {
                return next(); // User is authorised
            }

            return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};

module.exports = authoriseUser;
