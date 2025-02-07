import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../../state/Event/eventSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { socket } from "../../config/socket";

const categories = [
  { value: "sports", label: "Sports" },
  { value: "music", label: "Music" },
  { value: "art", label: "Art" },
  { value: "tech", label: "Technology" },
  { value: "workshop", label: "Workshop" },
  { value: "conference", label: "Conference" },
  { value: "meet", label: "Meet" },
];

const statuses = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "canceled", label: "Canceled" },
];

const CreateEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.events);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const time24 = formData.get("time");
    const [hours, minutes] = time24.split(":");
    const suffix = hours >= 12 ? "PM" : "AM";
    const hours12 = (hours % 12 || 12).toString().padStart(2, "0");
    const formattedTime = `${hours12}:${minutes} ${suffix}`;

    const eventData = {
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      status: formData.get("status"),
      date: formData.get("date"),
      time: formattedTime,
      location: formData.get("location"),
    };

    Object.keys(eventData).forEach((key) => {
      formData.set(key, eventData[key]);
    });

    const event = await dispatch(createEvent(formData));

    // Emit WebSocket event
    if (event) {
      socket.emit("newEventCreated", event.payload);
      toast.success("Event created successfully");
      navigate("/home");
    } else {
      toast.error("Failed to create event");
    }
  };

  return (
    <div className="max-w-4xl h-[63vw] mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Event Name
          </label>
          <input
            name="name"
            id="name"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="flex">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Time
            </label>
            <input
              type="time"
              name="time"
              id="time"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Status
          </label>
          <select
            name="status"
            id="status"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Category
          </label>
          <select
            name="category"
            id="category"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Image
          </label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
