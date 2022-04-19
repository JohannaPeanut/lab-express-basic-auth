const express = require('express');
const router = new express.Router();
const User = require('./../models/user');
const MongoStore = require('connect-mongo');
const bcryptjs = require('bcryptjs');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/private', (req, res) => {
  res.render('private');
});

router.post('/signup', (req, res, next) => {
  const { name, password } = req.body;
  bcryptjs
    .hash(password, 10)
    .then((passwordHashAndSalt) => {
      return User.create({
        name,
        passwordHashAndSalt
      });
    })
    .then((user) => {
      req.session.userId = user._id;
      res.redirect('/private');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
