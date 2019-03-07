if (process.env.NODE_ENV !== 'production') {
  console.log('loading dev environments');
  require('dotenv').config()
}

const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const moment = require('moment');
const upcoming = require('./upcoming');
const past = require('./past');

const documentClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION, apiVersion: '2012-08-10' });

router.post('/request', (req, res) => {
  const rideRequest = req.body;
  rideRequest.id = uuidv1();
  rideRequest.status = 'pending';
  rideRequest.requestTime = moment().format("YYYY-MM-DD HH:mm:ss");
  rideRequest.pickupTime = rideRequest.date + " " + rideRequest.pickupTime;
  rideRequest.dropoffTime = rideRequest.date + " " + rideRequest.dropoffTime;
  delete rideRequest.date;
  const putParams = {
    TableName: process.env.AWS_DYNAMODB_RIDES_TABLENAME,
    Item: rideRequest
  }
  documentClient.put(putParams, function (err, data) {
    if (err) {
      console.error(err, err.stack);
      return res.json({ err: err });
    } else {
      return res.json(data);
    }
  });
});

router.post('/upcoming', (req, res) => {
  const upcomingRidesRequest = req.body;
  try {
    const { accountType, userEmail } = upcomingRidesRequest;
    const queryParams = upcoming.accountGetQueryParams(accountType, userEmail);
    if (queryParams.err) {
      res.json(queryParams);
    }

    documentClient.query(queryParams, function (err, data) {
      if (err) {
        console.error(err, err.stack);
        return res.json({ err: err });
      } else {
        const rides = data.Items;
        Promise.all(upcoming.getRideUserDataPromises(rides, upcomingRidesRequest.accountType)).then((data) => {
          return Promise.all(upcoming.getLocationDescPromises(data))
        }).then((data) => {
          res.json(data);
        });
      }
    });
  } catch (err) {
    return res.json({ err });
  }
});

router.post('/past', (req, res) => {
  const pastRidesRequest = req.body;

  const { userEmail, accountType, rideIndex } = pastRidesRequest;
  const queryParams = past.accountGetQueryParams(accountType, userEmail, rideIndex);

  documentClient.query(queryParams, function (err, data) {
    if (err) {
      console.error(err, err.stack);
      return res.json({ err: err });
    } else {
      res.json(data.Items);
    }
  });

});

module.exports = router;
