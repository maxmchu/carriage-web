const express = require('express')
const router = express.Router()
const passport = require('../passport')
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

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
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
  if (req.user) {
    return res.json({ user: req.user.Item })
  } else {
    return res.json({ user: null })
  }
})

router.post('/login',
  function (req, res, next) {
    console.log(req.body)
    console.log('================')
    next()
  },
  passport.authenticate('local'),
  (req, res) => {
    console.log('POST to /login');
    const user = JSON.parse(JSON.stringify(req.user)); // hack
    const cleanUser = Object.assign({}, user);
    if (cleanUser.password) {
      console.log(`Deleting ${cleanUser.password}`);
      delete cleanUser.password;
    }
    res.json({ user: cleanUser })
  }
)

router.post('/logout', (req, res) => {
  if (req.user) {
    req.session.destroy()
    res.clearCookie('connect.sid') // clean up!
    return res.json({ msg: 'logging you out' })
  } else {
    return res.json({ msg: 'no user to log out!' })
  }
})

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const getParams = {
    TableName: process.env.AWS_DYNAMODB_USER_TABLENAME,
    Key: {
      email: username
    }
  }
  const putParams = {
    TableName: process.env.AWS_DYNAMODB_USER_TABLENAME,
    Item: {
      email: username,
      password: hashedPassword
    }
  }

  documentClient.get(getParams, function (err, data) {
    if (err) {
      console.error(err, stack);
      return res.json({ msg: 'error checking Dynamo for existing user' });
    } else {
      if (Object.keys(data.length) == 0) {
        document.put(putParams, function (err, data) {
          if (err) {
            console.error(err, err.stack);
            return res.json({ msg: 'error saving user' });
          } else {
            console.log("registering: ")
            const newUser = {
              email: username,
              password: hashedPassword
            }
            console.log(newUser);
            return res.json(newUser);
          }
        })
      }
    }
  });

})

module.exports = router