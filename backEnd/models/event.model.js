const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: "Event date must be in the future",
      },
    },
    time: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^(0[1-9]|1[0-2]):([0-5]\d) (AM|PM)$/i.test(value); // Validates "hh:mm AM/PM" format
        },
        message: "Time must be in hh:mm AM/PM format",
      },
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "canceled"],
      default: "upcoming",
    },
    location: {
      type: String,
      required: true,
    },
    image: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    category: {
      type: String,
      enum: [
        "sports",
        "music",
        "conference",
        "meet",
        "workshop",
        "tech",
        "art",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
