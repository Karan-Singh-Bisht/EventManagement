import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { fetchEventById, joinEvent } from "../../state/Event/eventSlice";
import { getUser } from "../../state/Auth/authSlice";
import { toast } from "sonner";

const EventDetails = () => {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const { event, loading, error } = useSelector((state) => state.events);
  const [events, setEvents] = useState({});
  const auth = useSelector((state) => state.auth);
  const token = localStorage?.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(getUser(token));
    }
  }, [token]);

  useEffect(() => {
    const getEventById = async (eventId) => {
      const response = await dispatch(fetchEventById(eventId));
      setEvents(response?.payload);
    };
    getEventById(eventId);
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl">
          <Loading text={"Loading Event Details"} />
        </h2>
      </div>
    );
  }

  const isJoined =
    auth?.user?.user?._id &&
    event?.attendees?.some((attendee) => attendee._id === auth.user.user._id);

  const handleJoinButton = async (action) => {
    if (!auth.user) {
      toast.error("Please log in to join this event");
      return;
    }
    // Only dispatch joinEvent if the user is not already joined.
    if (!isJoined) {
      const resultAction = await dispatch(
        joinEvent({ eventId: event._id, action })
      );
      if (joinEvent.fulfilled.match(resultAction)) {
        toast.success("You have joined this event");
      } else {
        toast.error(resultAction.payload || "Failed to join event");
      }
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {events?.image && (
          <img
            src={events?.image}
            alt={events.name}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <div className="flex items-center gap-5">
            <h1 className="text-3xl font-bold">{events?.name}</h1>
            <button
              onClick={() => handleJoinButton("register")}
              className={`mt-4 mr-2 font-semibold text-white py-2 px-4 rounded-md ${
                isJoined
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-indigo-600 hover:bg-indigo-500"
              }`}
              disabled={isJoined}
            >
              {isJoined ? "Joined" : "Join"}
            </button>
          </div>
          <p className="text-gray-600 mb-2">
            {new Date(events?.date).toLocaleDateString()} at {events?.time}
          </p>
          <p className="text-gray-600 mb-4">{events?.location}</p>
          <div className="mb-4">
            <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-sm mr-2">
              {events?.category}
            </span>
            <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm">
              {events?.status}
            </span>
          </div>
          <p className="text-gray-700 mb-4">{events?.description}</p>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <span className="font-bold text-lg">
                {events?.attendees?.length}
              </span>
              <span className="ml-2 text-gray-600">Attendees</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
