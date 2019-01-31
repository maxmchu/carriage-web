const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const strategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  function (token, tokenSecret, profile, done) {
    // testing
    // console.log('===== GOOGLE PROFILE =======')
    // console.log(profile)
    // console.log('======== END ===========')
    // code
    const { id, name, emails } = profile;

    const getParams = {
      TableName: process.env.AWS_DYNAMODB_USER_TABLENAME,
      Key: {
        google_id: parseInt(id)
      }
    }

    const putParams = {
      TableName: process.env.AWS_DYNAMODB_USER_TABLENAME,
      Item: {
        google_id: parseInt(id),
        first_name: name.givenName,
        last_name: name.familyName,
        email: emails[0].value
      }
    }

    documentClient.get(getParams, function (err, data) {
      if (err) {
        console.error(err, err.stack);
        return done(null, false);
      } else {
        if (Object.keys(data).length == 0) {
          documentClient.put(putParams, function (err, data) {
            if (err) {
              console.error(err, err.stack);
              return done(null, false);
            } else {
              console.log("initialize: ")
              console.log(data);
              return done(null, {
                google_id: profile.id,
                first_name: name.givenName,
                last_name: name.familyName,
                email: emails[0].value
              })
            }
          })
        } else {
          console.log("GET RESULT:");
          return done(null, data.Item);
        }
      }
    });

  }
)

module.exports = strategy