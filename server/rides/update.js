if (process.env.NODE_ENV !== 'production') {
  console.log('loading dev environments');
  require('dotenv').config();
}

const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION, apiVersion: '2012-08-10' });

module.exports = {
  getBatchWriteParams(inputItems) {
    try {
      const items = inputItems.map((item) => {
        delete item.rider;
        delete item.driver;
        delete item.pickupLocationDesc;
        delete item.dropoffLocationDesc;
        return {
          PutRequest: {
            Item: item
          }
        };
      });
      return {
        RequestItems: {
          [process.env.AWS_DYNAMODB_RIDES_TABLENAME]: items
        }
      }
    } catch (err) {
      return { err };
    }
  },
  getBatchPromise(batch) {
    const self = this;
    return new Promise(function (resolve, reject) {
      const params = self.getBatchWriteParams(batch);
      documentClient.batchWrite(params, function (err, data) {
        if (err) {
          console.error(err, err.stack);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}