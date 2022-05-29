const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authentication failed' });
  }
  try {
    jwt.verify(token, config.get('jwtSecret'), (error, val) => {
      if (error) {
        return res.status(401).json({ msg: 'Token invalid' });
      }
      req.user = val.user;
      next();
    });
    // next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ msg: 'Invalid Token' });
  }
};
