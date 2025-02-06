const express = require("express");
const router = express.Router();
const {
  createEvent,
  updateEvent,
  showAllEvents,
  showEvent,
  showEventAttendees,
  rsvpForEvent,
  searchEvents,
  deleteEvent,
} = require("../controllers/event.controller");
const verifyUserToken = require("../middleware/verifyUserToken");

router.get("/filter", searchEvents);
router.post("/create", verifyUserToken, createEvent);
router.put("/:eventId/updateStatus", verifyUserToken, updateEvent);
router.get("/", showAllEvents);
router.get("/:eventId", verifyUserToken, showEvent);
router.get("/:eventId/attendees", verifyUserToken, showEventAttendees);
router.post("/:eventId/rsvp", verifyUserToken, rsvpForEvent);
router.delete("/:eventId", verifyUserToken, deleteEvent);

module.exports = router;
