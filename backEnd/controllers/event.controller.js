const eventService = require("../services/event.service");
const Event = require("../models/event.model");

module.exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, location, time, category } = req.body;
    const user = req.user.id;
    const files = req.file;
    const io = req.app.get("socketio");
    const newEvent = await eventService.createEvent({
      name,
      description,
      date,
      location,
      user,
      files,
      io,
      time,
      category,
    });
    if (!newEvent) {
      return res.status(400).json({ message: "Failed to create event" });
    }

    io.emit("newEventCreated", newEvent);

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { status, name, description, category, location, date } = req.body;
    const userId = req.user.id;
    const io = req.app.get("socketio");
    const files = req.file;

    const updatedFields = {};

    if (name) updatedFields.name = name;
    if (description) updatedFields.description = description;
    if (location) updatedFields.location = location;
    if (date) updatedFields.date = date;
    if (status) {
      // Status validation
      const validStatuses = ["upcoming", "ongoing", "canceled", "completed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      updatedFields.status = status;
    }
    if (files) {
      updatedFields.image = files.path;
    }
    if (category) {
      updatedFields.category = category;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedEvent = await eventService.updateEventStatus(
      eventId,
      updatedFields,
      userId,
      io
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.showEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await eventService.showEvent(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.showAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const events = await eventService.showAllEvents(skip, limit);

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }

    const totalEvents = await Event.countDocuments();

    const pagination = {
      total: totalEvents,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalEvents / limit),
    };

    res.status(200).json({ events, pagination });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.showEventAttendees = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const eventAttendeesCount = await eventService.eventAttendees(eventId);
    if (!eventAttendeesCount) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(eventAttendeesCount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.rsvpForEvent = async (req, res) => {
  try {
    const { action } = req.body;
    const eventId = req.params.eventId;
    const userId = req.user.id;
    const io = req.app.get("socketio");

    const updatedEvent = await eventService.rsvpForEvent(
      eventId,
      userId,
      action,
      io
    );

    // Emit the full updated event object
    io.to(eventId).emit("attendeeCountUpdated", updatedEvent);

    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.searchEvents = async (req, res) => {
  try {
    const { name, location, date } = req.query;
    const filters = { name, location, date };

    const events = await eventService.searchEvents(filters);

    if (!events || events.length == 0) {
      return res.status(404).json({ message: "No events found" });
    }

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    const deletedEvent = await eventService.deleteEvent(eventId, userId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(deletedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getEventsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    if (categoryName === "") {
      return await Event.find().populate("attendees");
    }
    const events = await eventService.getEventsByCategory(categoryName);
    if (!events) {
      return res
        .status(404)
        .json({ message: "No events found in this category" });
    }
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
