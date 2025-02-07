import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../../state/Event/eventSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { socket } from "../../config/socket";
import LoadingOverlay from "./LoadingOverLay";

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

    // Convert time from 24-hour to 12-hour format
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

    // Update formData with the formatted event data
    Object.keys(eventData).forEach((key) => {
      formData.set(key, eventData[key]);
    });

    const event = await dispatch(createEvent(formData));

    // Emit WebSocket event if successful
    if (event.error == null) {
      socket.emit("newEventCreated", event.payload);
      toast.success("Event created successfully");
      navigate("/");
    } else {
      toast.error(`${error}`);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6 md:p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Create Event
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Event Name
            </label>
            <input
              name="name"
              id="name"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            ></textarea>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Time
              </label>
              <input
                type="time"
                name="time"
                id="time"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Status & Category in Flex */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Status */}
            <div className="flex-1">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                name="status"
                id="status"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Category */}
            <div className="flex-1">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                name="category"
                id="category"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
        <LoadingOverlay loading={loading} message="Creating event..." />
      </div>
    </div>
  );
};

export default CreateEvent;
