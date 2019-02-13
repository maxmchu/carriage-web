const express = require('express');
const router = express.Router();
const passport = require('../passport');
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

if (!process.env.DEBUG_MODE) {
  console = console || {};
  console.log = function () { };
}

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/login'
  })
)

router.get('/google/success', (req, res) => {
  res.redirect("http://localhost:3000/dashboard")
}
)

// this route is just used to get the user basic info
router.get('/user', (req, res, next) => {
  if (req.user) {
    delete req.user.Item.password;
    return res.json({ user: req.user.Item })
  } else {
    return res.json({ user: null })
  }
})

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    console.log(user);
    if (err) { return next(err); }
    if (!user) {
      return res.send(info);
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      const cleanUser = Object.assign({}, user);
      if (cleanUser.password) {
        console.log(`Deleting ${cleanUser.password}`);
        delete cleanUser.password;
      }
      return res.send(cleanUser);
    });
  })(req, res, next);
});

router.post('/logout', (req, res) => {
  if (req.user) {
    req.session.destroy()
    res.clearCookie('connect.sid')
    return res.json({ msg: 'logging you out' })
  } else {
    return res.json({ msg: 'no user to log out!' })
  }
})

router.post('/signup', (req, res) => {
  console.log(req.body);
  const { username, password, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const getParams = {
    TableName: process.env.AWS_DYNAMODB_USER_TABLENAME,
    Key: {
      email: username.toLowerCase()
    }
  }

  const newUser = {
    email: username.toLowerCase(),
    password: hashedPassword,
    firstName: firstName,
    lastName: lastName,
    accountType: 'rider'
  }

  const putParams = {
    TableName: process.env.AWS_DYNAMODB_USER_TABLENAME,
    Item: newUser
  }

  documentClient.get(getParams, function (err, data) {
    if (err) {
      console.error(err, stack);
      return res.json({ err: 'Error checking database for existing user.' });
    } else {
      if (Object.keys(data).length == 0) {
        documentClient.put(putParams, function (err, data) {
          if (err) {
            console.error(err, err.stack);
            return res.json({ err: 'error saving user' });
          } else {
            console.log("registering: ");
            console.log(newUser);
            return res.json(newUser);
          }
        })
      } else {
        return res.json({ err: 'That user already exists!' });
      }
    }
  });

})

module.exports = router