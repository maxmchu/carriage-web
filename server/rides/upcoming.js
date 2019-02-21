if (process.env.NODE_ENV !== 'production') {
  console.log('loading dev environments');
  require('dotenv').config()
}

const AWS = require('aws-sdk');
const moment = require('moment');

const documentClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION, apiVersion: '2012-08-10' });

module.exports = {
  accountGetQueryParams(accountType, userEmail) {

    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

    if (!accountType in ['rider', 'driver']) {
      return { err: "Invalid rider type" };
    }
    const baseQuery = {
      TableName: process.env.AWS_DYNAMODB_RIDES_TABLENAME,
      ExpressionAttributeValues: {
        ':re': userEmail,
        ':dt': currentTime
      }
    }
    switch (accountType) {
      case 'rider':
        return {
          ...baseQuery,
          IndexName: 'riderEmail-dropoffTime-index',
          KeyConditionExpression: 'riderEmail = :re and dropoffTime >= :dt',
        };
      case 'driver':
        return {
          ...baseQuery,
          IndexName: 'driverEmail-dropoffTime-index',
          KeyConditionExpression: 'driverEmail = :re and dropoffTime >= :dt'
        }
    }
  },
  getRideUserDataPromises(rides, accountType) {

    if (!accountType in ['rider', 'driver']) {
      return new Promise((resolve, reject) => {
        reject({ err: "Invalid rider type" });
      });
    }

    if (accountType == 'rider') {
      let drivers = {};
      const promises = rides.map((ride) => {
        return new Promise((resolve, reject) => {
          if (ride.driverEmail) {
            if (!(ride.driverEmail in drivers)) {
              documentClient.get({
                TableName: process.env.AWS_DYNAMODB_USER_TABLENAME,
                Key: { email: ride.driverEmail },
                AttributesToGet: ["firstName", "lastName", "phone"]
              }, (err, data) => {
                if (err) {
                  console.error(err, err.stack);
                  reject(err);
                } else {
                  const driverInfo = data.Item;
                  ride.driver = {
                    name: driverInfo.firstName + " " + driverInfo.lastName,
                    phone: driverInfo.phone
                  }
                  delete ride.driverEmail;
                  resolve(ride);
                }
              });
            } else {
              ride.driver = drivers[ride.driverEmail];
              resolve(ride);
            }
          }
        });
      });
      return promises;
    }

    if (accountType == 'driver') {
      let riders = {};
      const promises = rides.map((ride) => {
        return new Promise((resolve, reject) => {
          if (!(ride.riderEmail in riders)) {
            documentClient.get({
              TableName: process.env.AWS_DYNAMODB_USER_TABLENAME,
              Key: { email: ride.riderEmail },
              AttributesToGet: ["firstName", "lastName", "phone"]
            }, (err, data) => {
              if (err) {
                console.error(err, err.stack);
                reject(err);
              } else {
                const riderInfo = data.Item;
                ride.rider = {
                  name: riderInfo.firstName + " " + rider.lastName,
                  phone: riderInfo.phone
                };
                delete ride.riderEmail;
                resolve(ride);
              }
            });
          } else {
            ride.rider = riders[ride.riderEmail];
            resolve(ride);
          }
        });
      })
      return promises;
    }
  }
}

