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
        ':pt': currentTime
      }
    }
    switch (accountType) {
      case 'rider':
        return {
          ...baseQuery,
          IndexName: 'riderEmail-pickupTime-index',
          KeyConditionExpression: 'riderEmail = :re and pickupTime >= :pt',
        };
      case 'driver':
        return {
          ...baseQuery,
          IndexName: 'driverEmail-pickupTime-index',
          KeyConditionExpression: 'driverEmail = :re and pickupTime >= :pt'
        }
    }
  },
  getUserDataForRides(rides, accountType) {

    if (!accountType in ['rider', 'driver']) {
      return { err: "Invalid rider type" };
    }

    if (accountType == 'rider') {
      let drivers = {};

      // Add driver info to upcoming rides
      return rides.map((ride) => {
        if (ride.driverEmail) {
          let driverInfo;
          if (!(ride.driverEmail in drivers)) {
            // Fetch driver info
            driverInfo = documentClient.get(
              {
                TableName: process.env.AWS_DYNAMODB_USERS_TABLENAME,
                Key: ride.driverEmail,
                AttributesToGet: ["firstName", "lastName", "phone"]
              }, function (err, data) {
                if (err) {
                  console.error(err, err.stack);
                  return { err: err };
                } else {
                  return data.Item;
                }
              }
            );
            if (driverInfo.err) return res.json({ err: driverInfo.err });
            drivers[ride.driverEmail] = driverInfo;
          } else {
            driverInfo = drivers[ride.driverEmail];
          }
          ride.driver.name = `${driverInfo.firstName} ${driverInfo.lastName}`;
          ride.driver.phone = driverInfo.phone
          delete ride.driverEmail;
        }
        return ride;
      });
    }
    if (accountType == 'driver') {
      let riders = {};
      return rides.map((ride) => {
        let riderInfo;
        if (!(ride.useremail in riders)) {
          riderInfo = documentClient.get(
            {
              TableName: process.env.AWS_DYNAMODB_USERS_TABLENAME,
              Key: ride.riderEmail,
              AttributesToGet: ["firstName", "lastName", "phone"]
            }, function (err, data) {
              if (err) {
                console.error(err, err.stack);
                return { err: err };
              } else {
                return data.Item;
              };
            }
          );
          if (riderInfo.err) return res.json({ err: riderInfo.err });
          riders[ride.riderEmail] = riderInfo;
        } else {
          riderInfo = riders[ride.riderEmail];
        }
        ride.rider.name = `${riderInfo.firstName} ${riderInfo.lastName}`;
        ride.rider.phone = riderInfo.phone;
        delete ride.riderEmail;
        return ride;
      });
    }
  }
}

