const User = require('../models/User');
const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
  // Admin must use SAME TOKEN SYSTEM as userAuth
  const token = req.cookies.authToken;

  // Detect if request is from frontend API
  const isApiRequest =
    req.originalUrl.startsWith('/admin/') ||  
    req.originalUrl.includes('vidyaru-dashboard') ||
    req.originalUrl.includes('pending-profiles');

  // No token?
  if (!token) {
    if (isApiRequest)
      return res.status(401).json({ message: 'Not authenticated' });

    return res.redirect('/admin/login');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Must be admin
    if (decoded.role !== 'admin') {
      if (isApiRequest)
        return res.status(403).json({ message: 'Access denied. Admins only.' });

      return res.status(403).send('Access denied. Admins only.');
    }

    // Attach admin user to request
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      if (isApiRequest)
        return res.status(401).json({ message: 'Admin not found' });

      return res.redirect('/admin/login');
    }

    next();
  } catch (err) {
    console.error('Admin token error:', err);

    if (isApiRequest)
      return res.status(401).json({ message: 'Invalid or expired token' });

    return res.redirect('/admin/login');
  }
};

module.exports = adminAuth;
