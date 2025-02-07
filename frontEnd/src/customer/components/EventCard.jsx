import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SlPeople } from "react-icons/sl";
import { deleteEvent, joinEvent } from "../../state/Event/eventSlice";
import { toast } from "sonner";

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const updatedEvent = useSelector((state) =>
    state.events.events.events.find((e) => e._id === event._id)
  );

  const attendeeCount =
    updatedEvent?.attendees.length || event.attendees.length;

  const isJoined =
    auth?.user?.user?._id &&
    event?.attendees?.some(
      (attendee) => attendee._id === auth?.user?.user?._id
    );

  const handleRouting = () => {
    navigate(`/update/${event?._id}`);
  };

  const handleEventDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteEvent(event._id));
    }
  };

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

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <img
        onClick={() => navigate(`/eventDetails/${event._id}`)}
        src={event.image}
        alt={event.name}
        className="w-full hover:cursor-pointer h-40 object-cover rounded-md"
      />
      <h3 className="text-lg font-semibold mt-2">{event.name}</h3>
      <p className="text-sm text-gray-600">
        {/* Slicing Date to only include date and not other non-essential data */}
        {event.date.slice(0, 10)} • {event.time} • {event.location}
      </p>
      <div className="flex gap-2">
        <p className="text-sm mt-2 text-gray-800">Category: {event.category}</p>
        <p className="text-sm mt-2 text-gray-800">Status: {event.status}</p>
        <div className="flex items-center gap-2">
          <SlPeople />
          <p className="text-sm mt-2 text-gray-800">{attendeeCount}</p>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
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
          {auth?.user?.user?._id === event?.user ? (
            <button
              onClick={handleRouting}
              className="mt-4 bg-indigo-600 font-semibold text-white py-2 px-4 rounded-md hover:bg-indigo-500"
            >
              Update
            </button>
          ) : (
            ""
          )}
        </div>
        {auth?.user?.user?._id === event?.user && (
          <button
            onClick={handleEventDelete}
            className="mt-4 mr-2 bg-red-600 font-semibold text-white py-2 px-4 rounded-md hover:bg-red-500"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
