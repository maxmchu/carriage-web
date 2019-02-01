const passport = require('passport');
const GoogleStrategy = require('./googleStrategy');
const LocalStrategy = require('./localStrategy');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

if (!process.env.DEBUG_MODE) {
  console = console || {};
  console.log = function () { };
}

passport.serializeUser((user, done) => {
  // console.log('=== serialize ... called ===')
  // console.log(user)
  // console.log('---------')
  done(null, { email: user.email })
})

passport.deserializeUser((id, done) => {
  // console.log('DEserialize ... called')
  // console.log(id);
  const getParams = {
    TableName: process.env.AWS_DYNAMODB_USER_TABLENAME,
    Key: {
      email: id.email
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

passport.use(GoogleStrategy);
passport.use(LocalStrategy);

module.exports = passport