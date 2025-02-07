import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEvents,
  fetchEventsByCategory,
} from "../../state/Event/eventSlice.js";
import EventCard from "../components/EventCard.jsx";
import Loading from "../components/Loading.jsx";
import { getUser } from "../../state/Auth/authSlice.js";

const HomePage = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);

  const token = localStorage.getItem("token");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Handle dropdown changes
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Fetch events whenever the selected category changes.
  // If no category is selected, fetch all events.
  useEffect(() => {
    if (selectedCategory === "") {
      dispatch(fetchEvents());
    } else {
      dispatch(fetchEventsByCategory(selectedCategory));
    }
  }, [selectedCategory, dispatch]);

  // Fetch user details (if token exists)
  useEffect(() => {
    if (token) {
      dispatch(getUser());
    }
  }, [token, dispatch]);

  if (loading) {
    return (
      <div className="text-center text-xl mt-10">
        <Loading text={"Loading Events"} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchEvents())}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-center mb-6">All Events</h1>
        <div className="flex justify-end mb-4">
          <select
            className="border border-gray-300 rounded-md p-2"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            <option value="sports">Sports</option>
            <option value="music">Music</option>
            <option value="conference">Conference</option>
            <option value="meet">Meet</option>
            <option value="workshop">Workshop</option>
            <option value="tech">Tech</option>
            <option value="art">Art</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events?.events?.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
