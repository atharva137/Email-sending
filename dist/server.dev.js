"use strict";

var express = require('express');

var path = require('path');

var app = express();

var mongoose = require('mongoose');

var bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

var User = require('./model/user');

var JWT_SECRET = "isdhpojhposdfjpowefjpojpojh2094u093shis8yh98 4u093 4u 094u309u3049u0-3u0-233-=i0-3u093 u023r";
mongoose.connect('mongodb://localhost:27017/login-app-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
console.log(mongoose.connection.readyState);
var viewsPath = path.join(__dirname, '/views');
console.log(viewsPath);
app.use('/', express["static"](viewsPath));
app.use(express.json());
app.post('/api/change-password', function _callee(req, res) {
  var token, newpassword, user, _id, password;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(req.body);
          token = req.body.token;
          newpassword = req.body.newpassword;

          if (!(!newpassword || typeof newpassword !== 'string')) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.json({
            status: 'error',
            error: 'Invalid password'
          }));

        case 5:
          if (!(newpassword.length < 5)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.json({
            status: 'error',
            error: 'Password too small. Should be atleast 6 characters'
          }));

        case 7:
          _context.prev = 7;
          user = jwt.verify(token, JWT_SECRET);
          _id = user.id;
          _context.next = 12;
          return regeneratorRuntime.awrap(bcrypt.hash(newpassword, 8));

        case 12:
          password = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(User.updateOne({
            _id: _id
          }, {
            $set: {
              password: password
            }
          }));

        case 15:
          res.json({
            status: 'ok'
          });
          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](7);
          console.log(_context.t0);
          res.json({
            status: 'error',
            error: 'invalid access'
          });

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[7, 18]]);
});
app.post('/api/login', function _callee2(req, res) {
  var user, token;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(req.body);
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            username: req.body.username
          }).lean());

        case 3:
          user = _context2.sent;

          if (user) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.json({
            status: 'error',
            error: 'Invalid username/password'
          }));

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, user.password));

        case 8:
          if (!_context2.sent) {
            _context2.next = 11;
            break;
          }

          token = jwt.sign({
            id: user._id,
            username: user.username
          }, JWT_SECRET);
          return _context2.abrupt("return", res.json({
            status: 'ok',
            data: token
          }));

        case 11:
          res.json({
            status: 'error',
            error: 'Invalid username/password'
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.post('/api/signup', function _callee3(req, res) {
  var passowrd, response;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 8));

        case 2:
          passowrd = _context3.sent;

          if (!(!req.body.username || typeof req.body.username !== 'string')) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.json({
            status: 'error',
            error: 'Invalid username'
          }));

        case 5:
          if (!(!req.body.password || typeof req.body.password !== 'string')) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.json({
            status: 'error',
            error: 'Invalid password'
          }));

        case 7:
          if (!(req.body.password.length < 5)) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.json({
            status: 'error',
            error: 'Password too small. Should be atleast 6 characters'
          }));

        case 9:
          _context3.prev = 9;
          _context3.next = 12;
          return regeneratorRuntime.awrap(User.create({
            username: req.body.username,
            emailId: req.body.emailId,
            password: passowrd
          }));

        case 12:
          response = _context3.sent;
          console.log('User created successfully', response);
          _context3.next = 19;
          break;

        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](9);
          return _context3.abrupt("return", res.json({
            status: 'error',
            error: 'username/email id already exists'
          }));

        case 19:
          res.json({
            status: 'ok'
          });

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[9, 16]]);
});
app.listen(3000, function () {
  console.log('sever is started');
});