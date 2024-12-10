require('dotenv-flow').config();
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");

const authenticateJWT = (req, res, next) => {
  console.log(req.headers);
    const token = req.cookies.token; // Get token from cookie
  
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Add user info to the request object
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };

module.exports = { authenticateJWT };