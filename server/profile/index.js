const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

if (!process.env.DEBUG_MODE) {
  console = console || {};
  console.log = function () { };
}

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

router.post('/update', (req, res) => {
  const updateRequest = req.body;
  try {
    const { userEmail, firstName, lastName, phone } = updateRequest;
    const updateQuery = {
      TableName: process.env.AWS_DYNAMODB_USER_TABLENAME,
      Key: { "email": userEmail },
      UpdateExpression: 'set #fn = :fn, #ln = :ln, #pn = :pn',
      ExpressionAttributeNames: {
        '#fn': 'firstName',
        '#ln': 'lastName',
        '#pn': 'phone'
      },
      ExpressionAttributeValues: {
        ':fn': firstName,
        ':ln': lastName,
        ':pn': phone
      }
    }
    documentClient.update(updateQuery, function (err, data) {
      if (err) {
        console.error(err, err.stack);
        return res.json({ err: err });
      } else {
        res.json(data);
      }
    })
  } catch (err) {
    return res.json({ err });
  }
});

module.exports = router;