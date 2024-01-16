var express = require('express');
var router = express.Router();
const { check, body, validationResult } = require('express-validator');
var userController = require('../controllers/users');
var auth = require('../lib/auth')

/* GET users listing. */
router.post('/list', [auth.authenticateUser],
(req, res)=>{
  userController.getUsers(req, res);
});

// add user
router.post('/add',
[
  check('name', 'Full name is required').notEmpty(),
  check('email', 'Last name is required').notEmpty(),
  check('email', 'Please enter valid email Id').isEmail(),
  check('about', 'About field is required').notEmpty(),
  check('gender', 'Gender is required').notEmpty(),
  check('skills', 'Skills is not valid').notEmpty(),
], [auth.authenticateUser],
(req, res)=>{
  const errors = validationResult(req).errors;
  if(errors.length>0){
    return res.status(403).json({
      error: true,
      title: 'Validation errors',
      errors: errors
    });
  }

  userController.add(req, res);
});

// add user
router.put('/edit',
[
  check('id', 'Id is required').notEmpty(),
  check('name', 'Full name is required').notEmpty(),
  check('email', 'Last name is required').notEmpty(),
  check('email', 'Please enter valid email Id').isEmail(),
  check('about', 'About field is required').notEmpty(),
  check('gender', 'Gender is required').notEmpty(),
  check('skills', 'Skills are required').notEmpty(),
  check('status', 'Status is required').notEmpty(),
], [auth.authenticateUser],
(req, res)=>{
  const errors = validationResult(req).errors;
  if(errors.length>0){
    return res.status(403).json({
      error: true,
      title: 'Validation errors',
      errors: errors
    });
  }
  userController.edit(req, res);
});

router.delete('/delete/:id', [auth.authenticateUser],
(req, res)=>{
  userController.deleteUser(req, res);
});


module.exports = router;
