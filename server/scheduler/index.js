if (process.env.NODE_ENV !== 'production') {
  console.log('loading dev environments');
  require('dotenv').config()
}

const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/scheduleRides', (req, res) => {
  try {
    axios.post('http://127.0.0.1:5001/scheduler', req).then(
      response => {
        console.log(response.data);
        res.send(response.data)
      },
      err => {
        console.log(err);
        res.send(err)
      }
    );
  } catch (err) {
    return res.json({ err });
  }
});

module.exports = router;