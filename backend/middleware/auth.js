const jwt = require('jsonwebtoken');

//here i am expecting a json web token in the authorization header as 'Bearer token_string'
const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //here is some issue
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
