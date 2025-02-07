const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
