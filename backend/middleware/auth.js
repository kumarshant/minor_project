const jwt = require('jsonwebtoken');

//here i am expecting a json web token in the authorization header as 'Bearer token_string'
const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  //getting token_string here 
  const token = authHeader.split(' ')[1];

  try {
    //verifying token string 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user payload to request (so controllers can use req.user.id)
    req.user = {
      id: decoded.id
    };

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = auth;
