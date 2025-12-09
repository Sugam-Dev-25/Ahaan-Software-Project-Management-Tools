const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Required only for role enforcement if necessary

module.exports = async (req, res, next) => {
    // 1. Get the Token from Cookies
    const authToken = req.cookies.authToken; // Assuming the cookie name is 'authToken'
    
    if (!authToken) {
        // This causes the 401 Unauthorized if the cookie is missing.
        return res.status(401).send('Authentication required: Token missing.'); 
    }

    try {
        // 2. Verify the Token (Stateless Check)
        // This verifies the signature and checks for expiration in one step.
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

        // The token is valid and contains { id, role }
        
        // 3. Authorization Check (Role Enforcement)
        if (!['tutor', 'institute'].includes(decoded.role)) {
            // This causes the 403 Forbidden if the role is wrong.
            return res.status(403).send('Unauthorized role: Access restricted to tutors/institutes.');
        }

        // 4. Attach user data to request
        // We can trust the data in the token payload (id and role) as it's signed.
        req.user = { id: decoded.id, role: decoded.role, name: decoded.name || 'Teacher' }; // Optionally include name if you add it to the token payload later.
        
        // Optional: If you need other user details like email/phone often, 
        // you might query the DB here: const user = await User.findById(decoded.id).select('name email');
        
        next();
    } catch (err) {
        console.error('JWT Authentication failed:', err.message);
        // Returns 401 for 'JsonWebTokenError' (invalid signature) or 'TokenExpiredError'
        return res.status(401).send('Authentication failed: Invalid or expired token.');
    }
};