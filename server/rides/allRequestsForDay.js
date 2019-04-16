if (process.env.NODE_ENV !== 'production') {
  console.log('loading dev environments');
  require('dotenv').config()
}

const moment = require('moment');

module.exports = {
  getQueryParams(requestedDate) {
    try {
      const time = moment(requestedDate);
      const dayStart = time.startOf('day').format('YYYY-MM-DD HH:mm:ss');
      const dayEnd = time.endOf('day').format('YYYY-MM-DD HH:mm:ss');

      return {
        TableName: process.env.AWS_DYNAMODB_RIDES_TABLENAME,
        ExpressionAttributeValues: {
          ':ds': dayStart,
          ':de': dayEnd,
          ':rs': "pending"
        },
        FilterExpression: 'rideStatus = :rs and pickupTime between :ds and :de',
        ScanIndexForward: true
      }
    } catch (err) {
      return { err }
    }
  }
}