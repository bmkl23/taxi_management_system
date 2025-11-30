const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {
  try {

    const authHeader = req.headers && req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ msg: "No authorization header" });
    }


    const token = authHeader.replace("Bearer ", "").trim();

    if (!token || token === "Bearer") {
      return res.status(401).json({ msg: "No token provided" });
    }


    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
 
      req.user = {
        id: decoded.id,
        role: decoded.role
      };

      console.log(" Auth successful for user:", decoded.id);
      next();
    } catch (jwtErr) {
      console.error(" JWT verification failed:", jwtErr.message);
      
      if (jwtErr.name === "TokenExpiredError") {
        return res.status(401).json({ msg: "Token expired" });
      }
      
      return res.status(401).json({ msg: "Invalid token" });
    }

  } catch (err) {
    console.error(" Auth middleware error:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = authMiddleware;