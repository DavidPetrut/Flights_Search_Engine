const express = require("express");
const router = express.Router();
const FlightTicket = require("../models/FlightTickets");
const fs = require("fs");
const path = require("path");


//load the data from our database JSON file
const sampleDataPath = path.join(__dirname, "..", "summer_tickets.json");
let flightTicketsData = [];
try {
  const data = fs.readFileSync(sampleDataPath, "utf8");
  flightTicketsData = JSON.parse(data);
} catch (err) {
  console.error("Error reading the sample data file:", err);
}

// Getting all flight tickets
router.get("/", (req, res) => {
  try {
    res.json(flightTicketsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one flight ticket
router.get("/:id", getFlightTicket, (req, res) => {
  res.json(res.flightTicket);
});

// This post is creating the flight ticket
router.post('/', async (req, res) => {
  const flightTicket = new FlightTicket({
    companyName: req.body.companyName,
    logoURL: req.body.logoURL,
    flightClass: req.body.flightClass,
    co2Level: req.body.co2Level,
    oldTicketPrice: req.body.oldTicketPrice,
    newTicketPrice: req.body.newTicketPrice,
    flightTime: req.body.flightTime,
    departureTime: req.body.departureTime,
    flightDuration: req.body.flightDuration,
    arrivalTime: req.body.arrivalTime,
    departureAirport: req.body.departureAirport,
    arrivalAirport: req.body.arrivalAirport
  });
  try {
    const newFlightTicket = await flightTicket.save();
    res.status(201).json(newFlightTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating one flight ticket
router.patch('/:id', getFlightTicket, async (req, res) => {
  // Update fields according to your FlightTicket schema
  if (req.body.companyName != null) {
    res.flightTicket.companyName = req.body.companyName;
  }
  // ... other relevant fields
  try {
    const updatedFlightTicket = await res.flightTicket.save();
    res.json(updatedFlightTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Deleting one flight ticket
router.delete("/:id", getFlightTicket, async (req, res) => {
  try {
    await res.flightTicket.remove();
    res.json({ message: "Deleted Flight Ticket" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getFlightTicket(req, res, next) {
  let flightTicket;
  try {
    flightTicket = await FlightTicket.findById(req.params.id);
    if (flightTicket == null) {
      return res.status(404).json({ message: "Cannot find flight ticket" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.flightTicket = flightTicket;
  next();
}

module.exports = router;
