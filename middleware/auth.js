const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies?.auth_token;
  if (!token) return res.sendStatus(401).json({ message: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
