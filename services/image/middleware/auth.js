const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const decodeToken = (token) => {
  return jwt.verify(token, secretKey);
}

const validateToken = (authHeader, res) =>{
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    return decodeToken(token);
}

const authenticateToken = async (req, res, next) => {
  try {
    const decodedToken = validateToken(req.headers.authorization, res);
    req.user = decodedToken.user;
    req.role = decodedToken.role;
    
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: 'Invalid token' });
  }
};

const authenticateTokenRole = (roleName) => async (req, res, next) => {
  try {
    const decodedToken = validateToken(req.headers.authorization, res);
    req.user = decodedToken.user;
    req.role = decodedToken.role;

    if (decodedToken.role !== roleName) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateToken, authenticateTokenRole };
