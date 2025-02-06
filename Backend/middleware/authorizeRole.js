const jwt = require("jsonwebtoken");


const authorizeRole = (roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      }

      req.user = decoded; // Adding user info to request object
      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports =  {authorizeRole} ; 