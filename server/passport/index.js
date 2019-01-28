const passport = require('passport');
const GoogleStrategy = require('./googleStrategy');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

passport.serializeUser((user, done) => {
  // console.log('=== serialize ... called ===')
  // console.log(user)
  // console.log('---------')
  done(null, { google_id: user.google_id })
})

passport.deserializeUser((id, done) => {
  // console.log('DEserialize ... called')
  const getParams = {
    TableName: process.env.AWS_DYNAMODB_USER_TABLENAME,
    Key: {
      google_id: parseInt(id.google_id)
    }
  }
  documentClient.get(getParams, function (err, data) {
    if (err) {
      console.error(err, err.stack);
      return done(null, false);
    } else {
      // console.log('======= DESERILAIZE USER CALLED ======')
      // console.log(data)
      // console.log('--------------')
      return done(null, data);
    }
  })
})

passport.use(GoogleStrategy)

module.exports = passport