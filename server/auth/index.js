const express = require('express')
const router = express.Router()
const passport = require('../passport')

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)

// this route is just used to get the user basic info
router.get('/user', (req, res, next) => {
  if (req.user) {
    return res.json({ user: req.user.Item })
  } else {
    return res.json({ user: null })
  }
})

router.post('/logout', (req, res) => {
  if (req.user) {
    req.session.destroy()
    res.clearCookie('connect.sid') // clean up!
    return res.json({ msg: 'logging you out' })
  } else {
    return res.json({ msg: 'no user to log out!' })
  }
})

module.exports = router