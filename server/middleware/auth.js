const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decoded)
    if (!decoded?.UserInfo?.id) {
      return res.status(401).json({ error: 'Invalid token structure' });
    }
    req.userId = decoded.UserInfo.id;
    req.user = decoded.UserInfo;
    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(401).json({ 
      error: 'Session expired - Please login again',
      code: 'TOKEN_EXPIRED'
    });  }
};

module.exports = authMiddleware;