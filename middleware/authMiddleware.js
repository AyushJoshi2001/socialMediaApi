const { JWT_SECRET_KEY } = require("../secretKey");
const jwt = require("jsonwebtoken");

// this method will authorize the user based on token get in request header.
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      req.headers = { ...req.headers, id: payload.id };
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
}

module.exports = authenticateToken;
