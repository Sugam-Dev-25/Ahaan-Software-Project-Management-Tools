// middleware/auth.js
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const cookieId = req.cookies.cookieId;  // Retrieve cookieId from the browser

  if (!cookieId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const user = await User.findOne({ cookieId });
    if (!user || !user.jwtToken) {
      return res.status(401).json({ message: 'Invalid session or JWT token expired' });
    }

    // Verify the JWT
    jwt.verify(user.jwtToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token is expired or invalid' });
      }
      req.user = decoded;  // Attach user data to the request
      next();  // Proceed to the next middleware/route handler
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = authenticate;
