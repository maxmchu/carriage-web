if (process.env.NODE_ENV !== 'production') {
  console.log('loading dev environments');
  require('dotenv').config()
}

const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');

const documentClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION, apiVersion: '2012-08-10' });

router.post('/request', (req, res) => {
  console.log(req.body);
  const rideRequest = req.body;
  rideRequest.id = uuidv1();
  rideRequest.status = 'pending';
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
})

module.exports = router;
