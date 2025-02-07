import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateEvent } from "../../state/Event/eventSlice";
import { toast } from "sonner";
import { axiosInstance } from "../../config/apiConfig";
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

const UpdateEvent = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const { loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/v1/event/${eventId}`);
        setEventData(data);
      } catch (error) {
        toast.error("Failed to fetch event details");
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const time24 = formData?.get("time");
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

    const event = await dispatch(updateEvent({ formData, eventId }));

    // Emit WebSocket event
    if (event) {
      socket.emit("eventUpdated", event.payload);
      toast.success("Event updated successfully");
      navigate("/home");
    } else {
      toast.error("Failed to create event");
    }
  };

  if (!eventData) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Update Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Event Name</label>
          <input
            name="name"
            type="text"
            defaultValue={eventData.name}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            defaultValue={eventData.description}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="mb-4 w-1/2">
            <label className="block font-semibold mb-2">Date</label>
            <input
              type="date"
              name="date"
              defaultValue={eventData.date ? eventData.date.split("T")[0] : ""}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 w-1/2">
            <label className="block font-semibold mb-2">Time</label>
            <input
              type="time"
              name="time"
              defaultValue={eventData.time ? eventData.time.slice(0, 5) : ""}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Location</label>
          <input
            type="text"
            name="location"
            defaultValue={eventData.location}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Status</label>
          <select
            name="status"
            defaultValue={eventData.status}
            className="w-full p-2 border rounded-md"
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
          <label className="block font-semibold mb-2">Category</label>
          <select
            name="category"
            defaultValue={eventData.category}
            className="w-full p-2 border rounded-md"
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
          <label className="block font-semibold mb-2">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Updating" : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateEvent;
