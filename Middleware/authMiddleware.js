const jwt = require('jsonwebtoken');

// Middleware để xác thực JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header('token')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRER_KEY);
    req.user = decoded; // decoded sẽ chứa thông tin user ID
    next(); // Tiếp tục xử lý request
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware 