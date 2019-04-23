if (process.env.NODE_ENV !== 'production') {
  console.log('loading dev environments');
  require('dotenv').config()
}

const express = require('express');
const router = express.Router();

const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION, apiVersion: '2012-08-10' });

router.post('/makeRequests', (req, res) => {
  const unscheduledRequests = [
    {
      "pickupLocationString": "Gates Hall",
      "rideStatus": "pending",
      "dropoffLocationId": 7,
      "pickupLocationId": 6,
      "needsExtraSpace": false,
      "dropoffLocationString": "Day Hall",
      "requestTime": "2019-04-22 11:10:45",
      "pickupTime": "2019-04-25 10:00",
      "id": "ride-request-0",
      "needsWheelchair": false,
      "riderEmail": "rider0",
      "dropoffTime": "2019-04-25 11:30",
      "pickupLocationDesc": "Campus Rd. pull-off",
      "dropoffLocationDesc": "Loading dock"
    },
    {
      "pickupLocationString": "Baker Lab",
      "rideStatus": "pending",
      "dropoffLocationId": 2,
      "pickupLocationId": 13,
      "needsExtraSpace": false,
      "dropoffLocationString": "Teagle Hall",
      "requestTime": "2019-04-22 11:10:45",
      "pickupTime": "2019-04-25 13:00",
      "id": "ride-request-1",
      "needsWheelchair": true,
      "riderEmail": "rider1",
      "dropoffTime": "2019-04-25 13:20",
      "pickupLocationDesc": "Back ramp By loading dock",
      "dropoffLocationDesc": "Parking lot between Teagle and Lynah or at Campus Rd pulloff (specify) "
    },
    {
      "id": "ride-request-2",
      "riderEmail": "rider2",
      "pickupTime": "2019-04-25 08:40",
      "pickupLocationId": 8,
      "pickupLocationString": "High Rise 5",
      "pickupLocationDesc": "Circle off Jessup Rd next to RPCC",
      "dropoffTime": "2019-04-25 09:05",
      "dropoffLocationId": 9,
      "dropoffLocationString": "Kennedy Hall",
      "dropoffLocationDesc": "By side ramp on Garden Ave",
      "requestTime": "2019-04-22 09:23:25",
      "needsExtraSpace": false,
      "needsWheelchair": false,
      "rideStatus": "pending"
    },
    {
      "id": "ride-request-3",
      "riderEmail": "rider3",
      "pickupTime": "2019-04-25 10:00",
      "pickupLocationId": 3,
      "pickupLocationString": "Becker House-North",
      "pickupLocationDesc": "Sidewalk on Gothics Way",
      "dropoffTime": "2019-04-25 10:30",
      "dropoffLocationId": 15,
      "dropoffLocationString": "Willard Straight Hall",
      "dropoffLocationDesc": "Cinema entrance / parking lot",
      "requestTime": "2019-04-22 15:31:23",
      "needsExtraSpace": false,
      "needsWheelchair": false,
      "rideStatus": "pending"
    },
    {
      "id": "ride-request-4",
      "riderEmail": "rider0",
      "pickupTime": "2019-04-25 15:30",
      "pickupLocationId": 12,
      "pickupLocationString": "Schwartz Center",
      "pickupLocationDesc": "College Ave. bus stop",
      "dropoffTime": "2019-04-25 16:00",
      "dropoffLocationId": 14,
      "dropoffLocationString": "Vet School/Tower Road Side",
      "dropoffLocationDesc": "10 minute loading zone by Vet Tower ",
      "requestTime": "2019-04-22 15:31:23",
      "needsExtraSpace": false,
      "needsWheelchair": false,
      "rideStatus": "pending"
    },
    {
      "id": "ride-request-5",
      "riderEmail": "rider1",
      "pickupTime": "2019-04-25 16:00",
      "pickupLocationId": 1,
      "pickupLocationString": "Anabel Taylor Hall",
      "pickupLocationDesc": "College Ave bus stop in front of building",
      "dropoffTime": "2019-04-25 16:15",
      "dropoffLocationId": 11,
      "dropoffLocationString": "Riley-Robb Hall",
      "dropoffLocationDesc": "Campus Rd side or Wing Dr side (please specify)",
      "requestTime": "2019-04-22 15:31:23",
      "needsExtraSpace": false,
      "needsWheelchair": true,
      "rideStatus": "pending"
    },
    {
      "id": "ride-request-6",
      "riderEmail": "rider2",
      "pickupTime": "2019-04-25 17:00",
      "pickupLocationId": 4,
      "pickupLocationString": "Carpenter Hall",
      "pickupLocationDesc": "Loading zone by info booth",
      "dropoffTime": "2019-04-25 17:30",
      "dropoffLocationId": 10,
      "dropoffLocationString": "Physical Therapy",
      "dropoffLocationDesc": "Schoellkopf Hall, in back (facing football field)",
      "requestTime": "2019-04-22 15:31:23",
      "needsExtraSpace": false,
      "needsWheelchair": false,
      "rideStatus": "pending"
    },
    {
      "id": "ride-request-7",
      "riderEmail": "rider3",
      "pickupTime": "2019-04-25 17:30",
      "pickupLocationId": 12,
      "pickupLocationString": "Schwartz Center",
      "pickupLocationDesc": "College Ave. bus stop",
      "dropoffTime": "2019-04-25 18:00",
      "dropoffLocationId": 3,
      "dropoffLocationString": "Becker House-North",
      "dropoffLocationDesc": "Sidewalk on Gothics Way",
      "requestTime": "2019-04-22 15:31:23",
      "needsExtraSpace": false,
      "needsWheelchair": false,
      "rideStatus": "pending"
    }
  ]
  const items = unscheduledRequests.map((item) => {
    return {
      PutRequest: {
        Item: item
      }
    }
  });
  const params = {
    RequestItems: {
      [process.env.AWS_DYNAMODB_RIDES_TABLENAME]: items
    }
  };
  documentClient.batchWrite(params, function (err, data) {
    if (err) {
      console.error(err, err.stack);
      res.json({ err })
    } else {
      res.json({ data })
    }
  });
});

router.post('/scheduleRequests', (req, res) => {
  const scheduledRequests = [
    {
      "pickupLocationString": "Gates Hall",
      "rideStatus": "confirmed",
      "dropoffLocationId": 7,
      "pickupLocationId": 6,
      "needsExtraSpace": false,
      "dropoffLocationString": "Day Hall",
      "requestTime": "2019-04-22 11:10:45",
      "pickupTime": "2019-04-25 10:00",
      "id": "ride-request-0",
      "needsWheelchair": false,
      "riderEmail": "rider0",
      "driverEmail": "driver0",
      "dropoffTime": "2019-04-25 11:30",
      "pickupLocationDesc": "Campus Rd. pull-off",
      "dropoffLocationDesc": "Loading dock"
    },
    {
      "pickupLocationString": "Baker Lab",
      "rideStatus": "confirmed",
      "dropoffLocationId": 2,
      "pickupLocationId": 13,
      "needsExtraSpace": false,
      "dropoffLocationString": "Teagle Hall",
      "requestTime": "2019-04-22 11:10:45",
      "pickupTime": "2019-04-25 13:00",
      "id": "ride-request-1",
      "needsWheelchair": true,
      "driverEmail": "driver0",
      "riderEmail": "rider1",
      "dropoffTime": "2019-04-25 13:20",
      "pickupLocationDesc": "Back ramp By loading dock",
      "dropoffLocationDesc": "Parking lot between Teagle and Lynah or at Campus Rd pulloff (specify) "
    },
    {
      "id": "ride-request-2",
      "riderEmail": "rider2",
      "driverEmail": "driver1",
      "pickupTime": "2019-04-25 08:40",
      "pickupLocationId": 8,
      "pickupLocationString": "High Rise 5",
      "pickupLocationDesc": "Circle off Jessup Rd next to RPCC",
      "dropoffTime": "2019-04-25 09:05",
      "dropoffLocationId": 9,
      "dropoffLocationString": "Kennedy Hall",
      "dropoffLocationDesc": "By side ramp on Garden Ave",
      "requestTime": "2019-04-22 09:23:25",
      "needsExtraSpace": false,
      "needsWheelchair": false,
      "rideStatus": "confirmed"
    },
    {
      "id": "ride-request-3",
      "riderEmail": "rider3",
      "driverEmail": "driver1",
      "pickupTime": "2019-04-25 10:00",
      "pickupLocationId": 3,
      "pickupLocationString": "Becker House-North",
      "pickupLocationDesc": "Sidewalk on Gothics Way",
      "dropoffTime": "2019-04-25 10:30",
      "dropoffLocationId": 15,
      "dropoffLocationString": "Willard Straight Hall",
      "dropoffLocationDesc": "Cinema entrance / parking lot",
      "requestTime": "2019-04-22 15:31:23",
      "needsExtraSpace": false,
      "needsWheelchair": false,
      "rideStatus": "confirmed"
    },
    {
      "id": "ride-request-4",
      "riderEmail": "rider0",
      "driverEmail": "driver1",
      "pickupTime": "2019-04-25 15:30",
      "pickupLocationId": 12,
      "pickupLocationString": "Schwartz Center",
      "pickupLocationDesc": "College Ave. bus stop",
      "dropoffTime": "2019-04-25 16:00",
      "dropoffLocationId": 14,
      "dropoffLocationString": "Vet School/Tower Road Side",
      "dropoffLocationDesc": "10 minute loading zone by Vet Tower ",
      "requestTime": "2019-04-22 15:31:23",
      "needsExtraSpace": false,
      "needsWheelchair": false,
      "rideStatus": "confirmed"
    },
    {
      "id": "ride-request-5",
      "riderEmail": "rider1",
      "driverEmail": "driver0",
      "pickupTime": "2019-04-25 16:00",
      "pickupLocationId": 1,
      "pickupLocationString": "Anabel Taylor Hall",
      "pickupLocationDesc": "College Ave bus stop in front of building",
      "dropoffTime": "2019-04-25 16:15",
      "dropoffLocationId": 11,
      "dropoffLocationString": "Riley-Robb Hall",
      "dropoffLocationDesc": "Campus Rd side or Wing Dr side (please specify)",
      "requestTime": "2019-04-22 15:31:23",
      "needsExtraSpace": false,
      "needsWheelchair": true,
      "rideStatus": "confirmed"
    },
    {
      "id": "ride-request-6",
      "riderEmail": "rider2",
      "driverEmail": "driver0",
      "pickupTime": "2019-04-25 17:00",
      "pickupLocationId": 4,
      "pickupLocationString": "Carpenter Hall",
      "pickupLocationDesc": "Loading zone by info booth",
      "dropoffTime": "2019-04-25 17:30",
      "dropoffLocationId": 10,
      "dropoffLocationString": "Physical Therapy",
      "dropoffLocationDesc": "Schoellkopf Hall, in back (facing football field)",
      "requestTime": "2019-04-22 15:31:23",
      "needsExtraSpace": false,
      "needsWheelchair": false,
      "rideStatus": "confirmed"
    },
    {
      "id": "ride-request-7",
      "riderEmail": "rider3",
      "driverEmail": "driver1",
      "pickupTime": "2019-04-25 17:30",
      "pickupLocationId": 12,
      "pickupLocationString": "Schwartz Center",
      "pickupLocationDesc": "College Ave. bus stop",
      "dropoffTime": "2019-04-25 18:00",
      "dropoffLocationId": 3,
      "dropoffLocationString": "Becker House-North",
      "dropoffLocationDesc": "Sidewalk on Gothics Way",
      "requestTime": "2019-04-22 15:31:23",
      "needsExtraSpace": false,
      "needsWheelchair": false,
      "rideStatus": "confirmed"
    }
  ];
  const items = scheduledRequests.map((item) => {
    return {
      PutRequest: {
        Item: item
      }
    }
  });
  const params = {
    RequestItems: {
      [process.env.AWS_DYNAMODB_RIDES_TABLENAME]: items
    }
  };
  documentClient.batchWrite(params, function (err, data) {
    if (err) {
      console.error(err, err.stack);
      res.json({ err })
    } else {
      res.json({ data })
    }
  });
});

module.exports = router