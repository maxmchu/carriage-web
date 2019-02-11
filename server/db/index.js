if (process.env.NODE_ENV !== 'production') {
  console.log('loading dev environments')
  require('dotenv').config()
}

const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB({ region: process.env.AWS_REGION, apiVersion: '2012-08-10' })
const documentClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION, apiVersion: '2012-08-10' });

router.get('/locations', (req, res) => {
  documentClient.scan({ TableName: process.env.AWS_DYNAMODB_LOCATIONS_TABLENAME }, (err, data) => {
    if (err) {
      console.error(err, err.stack);
      return res.json({ err: 'Error fetching locations.' })
    } else {
      return res.json(data.Items);
    }
  })
})

module.exports = router;