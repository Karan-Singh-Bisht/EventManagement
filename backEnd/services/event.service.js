const Event = require("../models/event.model");
const uploadOnCloudinary = require("../utils/cloudinary");

const createEvent = async (eventData) => {
  try {
    const { name, description, date, location, user, files, category, time } =
      eventData;
    const eventImageLocalPath = files?.path;
    if (!eventImageLocalPath) {
      throw new Error("Event image is required");
    }
    const eventImage = await uploadOnCloudinary(eventImageLocalPath);
    if (!eventImage) {
      throw new Error("Failed to upload event image");
    }
    const newEvent = await Event.create({
      name,
      description,
      date,
      location,
      image: eventImage.url,
      user,
      category,
      time,
    });

    if (!newEvent) {
      throw new Error("Failed to create event");
    }

    return newEvent;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const updateEventStatus = async (eventId, updatedFields, userId, io) => {
  try {
    const event = await Event.findById(eventId).populate("attendees");
    if (!event) {
      throw new Error("Event not found");
    }

    if (event.user.toString() !== userId.toString()) {
      throw new Error("Unauthorized to update event");
    }

    if (updatedFields.image) {
      const eventImage = await uploadOnCloudinary(updatedFields.image);
      updatedFields.image = eventImage?.url || event.image;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: updatedFields }, //only update the provided fields
      { new: true }
    );
    if (!updatedEvent) {
      throw new Error("Event not found");
    }

    // Emit real-time event status update
    io.to(eventId).emit("attendeeCountUpdated", {
      eventId,
      status: event.status,
    });

    return updatedEvent;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const showEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId).populate("attendees");
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const eventAttendees = async (eventId) => {
  try {
    const event = await Event.findById(eventId).populate("attendees");
    if (!event) {
      throw new Error("Event not found");
    }
    const attendeesCount = event.attendees.length;
    return { event, attendeesCount };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const showAllEvents = async (skip, limit) => {
  try {
    const events = await Event.find()
      .skip(skip)
      .limit(limit)
      .populate("attendees");

    return events;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const rsvpForEvent = async (eventId, userId, action, io) => {
  try {
    const event = await Event.findById(eventId).populate("attendees");
    if (!event) {
      throw new Error("Event not found");
    }
    if (action === "register") {
      if (event.attendees.includes(userId)) {
        throw new Error("User is already registered for this event");
      }
      event.attendees.push(userId);
    } else if (action === "unregister") {
      event.attendees.pull(userId);
    } else {
      throw new Error("Invalid action");
    }

    const updatedEvent = (await event.save()).populate("attendees");

    return updatedEvent;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const searchEvents = async (filters) => {
  try {
    const query = {};
    if (filters.name) query.name = { $regex: filters.name, $options: "i" }; // case-insensitive search
    if (filters.location)
      query.location = { $regex: filters.location, $options: "i" };
    if (filters.date) query.date = { $gte: new Date(filters.date) }; // Events after a specific date

    const events = await Event.find(query).populate("attendees");

    if (!events || events.length === 0) {
      throw new Error("No events found with the given filters");
    }

    return events;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getEventsByCategory = async (categoryName) => {
  try {
    const events = await Event.find({ category: categoryName }).populate(
      "attendees"
    );
    return events;
  } catch (err) {
    throw new Error("Error fetching events by category: " + err.message);
  }
};

const deleteEvent = async (eventId, userId) => {
  try {
    const event = await Event.findById(eventId).populate("user");
    if (!event) {
      throw new Error("Event not found");
    }
    if (event.user._id.toString() == userId.toString()) {
      await Event.findByIdAndDelete(eventId);
      return "Event deleted successfully";
    }
    throw new Error("You are not the owner of this event");
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  createEvent,
  updateEventStatus,
  showEvent,
  eventAttendees,
  showAllEvents,
  rsvpForEvent,
  searchEvents,
  deleteEvent,
  getEventsByCategory,
};
