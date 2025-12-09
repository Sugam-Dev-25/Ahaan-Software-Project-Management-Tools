const User = require('../models/User');
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
 const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id).select('-password').populate('profile');
    if (!req.user) return res.status(401).json({ message: 'User not found' });

    next();
  } catch (err) {
    console.error('Auth token error:', err);
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

module.exports = userAuth;
