const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    
    if (!auth) {
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token is required' });
    }
    
    try {
        // Extract token from "Bearer <token>" format (FIX: now handles Bearer prefix)
        const token = auth.startsWith('Bearer ') 
            ? auth.slice(7) 
            : auth;
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
        
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token wrong or expired' });
    }
};

module.exports = ensureAuthenticated;