// Loading evnironmental variables here
if (process.env.NODE_ENV !== 'production') {
  console.log('loading dev environments')
  require('dotenv').config()
}

if (!process.env.DEBUG_MODE) {
  console = console || {};
  console.log = function () { };
}

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const passport = require('./passport')
const app = express()
const PORT = process.env.PORT || 5000

const whitelist = ['*'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(origin);
      callback(null, true);
      // callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
}
app.use(cors(corsOptions));

const dynamoSessionOptions = {
  table: 'adalift-sessions-dev',
  AWSConfigJSON: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  }
}

const DynamoDBStore = require('connect-dynamodb')({ session: session });

// ===== Middleware ====
app.use(morgan('dev'))
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(bodyParser.json())
app.use(
  session({
    secret: process.env.APP_SECRET || 'this is the default passphrase',
    store: new DynamoDBStore(dynamoSessionOptions),
    resave: false,
    saveUninitialized: false
  })
)

// ===== Passport ====
app.use(passport.initialize())
app.use(passport.session()) // will call the deserializeUser

// ==== if its production environment!
if (process.env.NODE_ENV === 'production') {
  const path = require('path')
  console.log('YOU ARE IN THE PRODUCTION ENV')
  app.use('/static', express.static(path.join(__dirname, '../build/static')))
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/'))
  })
}

/* Express app ROUTING */
app.use('/auth', require('./auth'))

// ====== Error handler ====
app.use(function (err, req, res, next) {
  console.log('====== ERROR =======')
  console.error(err.stack)
  res.status(500)
})

// ==== Starting Server =====
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`)
})