if (process.env.NODE_ENV !== 'production') {
  console.log('loading dev environments');
  require('dotenv').config()
}

const moment = require('moment');

module.exports = {
  getQueryParams() {
    const time = moment();
    const currentTime = time.format("YYYY-MM-DD HH:mm:ss");
    const dayEnd = time.endOf('day').format("YYYY-MM-DD HH:mm:ss");

    return {
      TableName: process.env.AWS_DYNAMODB_RIDES_TABLENAME,
      ExpressionAttributeValues: {
        ':ct': currentTime,
        ':de': dayEnd
      },
      FilterExpression: 'dropoffTime between :ct and :de'
    }
  }
}