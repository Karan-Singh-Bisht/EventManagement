import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../state/Event/eventSlice.js";
import EventCard from "../components/EventCard.jsx";

const HomePage = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch, events.length]);

  if (loading)
    return <div className="text-center text-xl mt-10">Loading events...</div>;
  if (error)
    return (
      <div className="text-center text-xl mt-10 text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">All Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events?.events?.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
