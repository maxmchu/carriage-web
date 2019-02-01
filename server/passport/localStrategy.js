const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });
const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const checkPassword = function (inputPassword, userPassword) {
  return bcrypt.compareSync(inputPassword, userPassword);
}

const strategy = new LocalStrategy(
  function (username, password, done) {
    const getParams = {
      TableName: process.env.AWS_DYNAMODB_USER_TABLENAME,
      Key: {
        email: username
      }
    }
    documentClient.get(getParams, function (err, data) {
      if (err) {
        console.error(err, err.stack);
        return done(err);
      } else {
        if (Object.keys(data).length == 0) {
          return done(null, false, { err: 'Username or password was incorrect found.' });
        } else {
          const user = data.Item;
          if (!checkPassword(password, user.password)) {
            return done(null, false, { err: 'Username or password was incorrect.' });
          }
          return done(null, user);
        }
      }
    })
  }
)

strategy.hashPassword = function (plaintextPassword) {
  return bcrypt.hashSync(plainTextPassword, 10);
}

module.exports = strategy