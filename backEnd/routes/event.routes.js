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
  getEventsByCategory,
} = require("../controllers/event.controller");
const verifyUserToken = require("../middleware/verifyUserToken");
const upload = require("../middleware/multer.middleware");

router.get("/filter", searchEvents);
router.post("/create", verifyUserToken, upload.single("image"), createEvent);
router.put(
  "/:eventId/updateEvent",
  verifyUserToken,
  upload.single("image"),
  updateEvent
);
router.get("/", showAllEvents);
router.get("/:eventId", showEvent);
router.get("/:eventId/attendees", verifyUserToken, showEventAttendees);
router.post("/:eventId/rsvp", verifyUserToken, rsvpForEvent);
router.delete("/:eventId", verifyUserToken, deleteEvent);
router.get(
  "/category/:categoryName([a-zA-Z]*)",
  verifyUserToken,
  getEventsByCategory
);

module.exports = router;
