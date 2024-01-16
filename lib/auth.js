var jwt = require('jsonwebtoken');
let adminModel = require('../models/admin');

const authenticateUser = async (req, res, next) => {
  const token = req.headers.token ? req.headers.token : req.query.token; 
  const decoded = jwt.decode(token, process.env.JWT_KET);
  console.log('decoded', decoded)
  try {
    let userData = await adminModel.findOne({email: decoded.email}).exec();
    if (!userData || userData == undefined) {
      return res.status(401).json({
        title: 'User not found',
        error: true,
      });
    }
    req.user = userData;
    return next(null, userData);
  }
  catch (error) {
    return res.status(401).json({
      title: 'Authorization required.',
      error: true,
      detail: error
    });
  }
}



module.exports = {
  authenticateUser
}