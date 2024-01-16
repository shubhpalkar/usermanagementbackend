var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//newly added packages
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config();

var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');


var app = express();

//cors enabled here
app.use(cors());


mongoose.connect(process.env.DB).then(()=>{
  console.log('db connected!');
})


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log('Error Details: ', err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
