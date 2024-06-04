/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = "flights";
const collection = "flights-tickets";

// Create a new database.
use(database);

// Create a new collection.
db.createCollection(collection);

db.orders.insertMany([
  {
    companyName: "Airways One",
    logoURL: "http://example.com/logo1.png",
    flightClass: "Economy",
    co2Level: 150,
    oldTicketPrice: 200,
    newTicketPrice: 180,
    flightTime: "3 hours",
    departureTime: "2024-02-01T10:00:00Z",
    flightDuration: "3 hours",
    arrivalTime: "2024-02-01T13:00:00Z",
    departureAirport: "JFK",
    arrivalAirport: "LAX",
  },
  {
    companyName: "Airways Two",
    logoURL: "http://example.com/logo2.png",
    flightClass: "Business",
    co2Level: 120,
    oldTicketPrice: 500,
    newTicketPrice: 450,
    flightTime: "5 hours",
    departureTime: "2024-02-02T15:00:00Z",
    flightDuration: "5 hours",
    arrivalTime: "2024-02-02T20:00:00Z",
    departureAirport: "LHR",
    arrivalAirport: "DXB",
  },
]);

// The prototype form to create a collection:
/* db.createCollection( <name>,
  {
    capped: <boolean>,
    autoIndexId: <boolean>,
    size: <number>,
    max: <number>,
    storageEngine: <document>,
    validator: <document>,
    validationLevel: <string>,
    validationAction: <string>,
    indexOptionDefaults: <document>,
    viewOn: <string>,
    pipeline: <pipeline>,
    collation: <document>,
    writeConcern: <document>,
    timeseries: { // Added in MongoDB 5.0
      timeField: <string>, // required for time series collections
      metaField: <string>,
      granularity: <string>,
      bucketMaxSpanSeconds: <number>, // Added in MongoDB 6.3
      bucketRoundingSeconds: <number>, // Added in MongoDB 6.3
    },
    expireAfterSeconds: <number>,
    clusteredIndex: <document>, // Added in MongoDB 5.3
  }
)*/

// More information on the `createCollection` command can be found at:
// https://www.mongodb.com/docs/manual/reference/method/db.createCollection/
