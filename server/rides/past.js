if (process.env.NODE_ENV !== 'production') {
  console.log('loading dev environments');
  require('dotenv').config();
}

const AWS = require('aws-sdk');
const moment = require('moment');

const documentClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION, apiVersion: '2012-08-10' });

module.exports = {
  accountGetQueryParams(accountType, userEmail, rideIndex) {

    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
    if (!accountType in ['rider', 'driver']) {
      return { err: "Invalid rider type" };
    }
    const baseQuery = {
      TableName: process.env.AWS_DYNAMODB_RIDES_TABLENAME,
    }
    if (rideIndex > 0) {
      baseQuery.ExclusiveStartKey = rideIndex;
    }
    switch (accountType) {
      case 'rider':
        return {
          ...baseQuery,
          IndexName: 'riderEmail-dropoffTime-index',
          KeyConditionExpression: 'riderEmail = :re and dropoffTime < :dt',
          ExpressionAttributeValues: {
            ':re': userEmail,
            ':dt': currentTime
          }
        };
      case 'driver':
        return {
          ...baseQuery,
          IndexName: 'driverEmail-dropoffTime-index',
          KeyConditionExpression: 'driverEmail = :re and dropoffTime < :dt',
          ExpressionAttributeValues: {
            ':re': userEmail,
            ':dt': currentTime
          }
        };
      case 'dispatcher':
        return {
          ...baseQuery,
          KeyConditionExpression: 'dropoffTime < :dt',
          ExpressionAttributeValues: {
            ':dt': currentTime
          }
        }
    }

  }

};