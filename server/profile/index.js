const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

const _ = require('lodash');

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

router.post('/get', (req, res) => {
  const getRequest = req.body;
  try {
    const { userEmail } = getRequest;
    const params = {
      TableName: process.env.AWS_DYNAMODB_USER_TABLENAME,
      Key: { "email": userEmail },
      AttributesToGet: ['firstName', 'lastName', 'phone']
    };
    documentClient.get(params, function (err, data) {
      if (err) {
        console.error(err, err.stack);
        return res.json({ err });
      } else {
        res.json(data.Item);
      }
    });
  } catch (err) {
    res.json({ err });
  }
});

router.post('/batchGet', (req, res) => {
  const getRequest = req.body;
  try {
    const { userEmails } = getRequest;
    const userKeys = userEmails.map((email) => { return { email } });
    const batches = _.chunk(userKeys, 100);
    const promises = batches.map((batch) => {
      const params = {
        RequestItems: {
          [process.env.AWS_DYNAMODB_USER_TABLENAME]: {
            Keys: batch,
            AttributesToGet: ['firstName', 'lastName', 'phone']
          }
        }
      };
      return new Promise(function (resolve, reject) {
        documentClient.batchGet(params, function (err, data) {
          if (err) {
            console.error(err, err.stack);
            reject(err);
          } else {
            resolve(data.Responses[process.env.AWS_DYNAMODB_USER_TABLENAME]);
          }
        });
      });
    });

    Promise.all(promises).then((data) => {
      res.json({ profiles: _.flattenDeep(data) });
    }).catch((err) => {
      res.json({ err });
    })

  } catch (err) {
    res.json({ err });
  }
});

router.post('/getAllDrivers', (req, res) => {
  const { placeholder } = req.body;
  try {
    const params = {
      TableName: process.env.AWS_DYNAMODB_USER_TABLENAME,
      FilterExpression: 'accountType = :at',
      ExpressionAttributeValues: { ':at': 'driver' }
    };
    documentClient.scan(params, function (err, data) {
      if (err) {
        console.error(err, err.stack);
        res.json({ err })
      } else {
        const drivers = data.Items.map((driver => {
          delete driver.password;
          delete driver.accountType;
          return driver;
        }))
        res.json({ drivers })
      }
    });
  } catch (err) {
    res.json({ err });
  }
});

module.exports = router;