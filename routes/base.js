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


router.get('/signin', (req, res) => {
  res.render('signin');
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

router.post('/signin', (req, res, next) => {
  const { name, password } = req.body;
  let user;
  User.findOne({ name })
  .then((doc) => {
    user = doc;
    
    if (user === null) {
      throw new Error('There is no user with that name.');
    } else {
      return bcryptjs.compare(password, user.passwordHashAndSalt);
    }
  })
  .then((comparisonResult) => {
    if (comparisonResult) {
      req.session.userId = user._id;
      res.redirect('/private');
    } else {
      throw new Error('Wrong password');
    }
  })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
