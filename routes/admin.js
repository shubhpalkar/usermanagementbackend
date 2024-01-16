var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var adminController = require('../controllers/admin');
var auth = require('../lib/auth')

// register user
router.post('/register',
[
  check('name', 'Name is required').notEmpty(),
  check('email', 'Email is required').notEmpty(),
  check('email', 'Please enter valid email Id').isEmail(),
  check('password', 'Password is required').notEmpty()
],
(req, res)=>{
  const errors = validationResult(req).errors;
  if(errors.length>0){
    return res.status(403).json({
      error: true,
      title: 'Validation errors',
      errors: errors
    });
  }
  adminController.register(req, res);
});

//login api
router.post('/login', [
  check('email', 'Email Id is required').notEmpty(),
  check('password', 'password is required').notEmpty()
],
(req, res)=>{
  const errors = validationResult(req).errors;
  if(errors.length> 0){
    return res.status(403).json({
      error: true,
      title: 'Validation errors',
      errors: errors
    });
  }

  adminController.login(req, res);
});

router.post('/socialLogin', [
  check('token', 'Token Id is required').notEmpty()
],
(req, res)=>{
  const errors = validationResult(req).errors;
  if(errors.length> 0){
    return res.status(403).json({
      error: true,
      title: 'Validation errors',
      errors: errors
    });
  }

  adminController.socialLogin(req, res);
});

module.exports = router;
