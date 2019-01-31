const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });
const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const strategy = new LocalStrategy(
  {
    usernameField: 'email' // not necessary, DEFAULT
  },
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
          return done(null, false, { message: 'Incorrect username' });
        } else {
          const user = data.Item;
          if (!this.checkPassword(password, user.password)) {
            return done(null, false, { message: 'Incorrect password' });
          }
          return done(null, user);
        }
      }
    })
  }
)

strategy.checkPassword = function (inputPassword, userPassword) {
  return bcrypt.compareSync(inputPassword, userPassword);
}

strategy.hashPassword = function (plaintextPassword) {
  return bcrypt.hashSync(plainTextPassword, 10);
}

module.exports = strategy