import { socket } from "../../config/socket";
import { fetchEvents } from "../Event/eventSlice";

export const socketMiddleware = (store) => (next) => (action) => {
  next(action);

  if (action.type === "@@INIT") {
    socket.on("eventCreated", (newEvent) => {
      console.log("New event received via WebSocket:", newEvent);

      const existingEvents = store.getState().events.events;
      const isDuplicate = existingEvents.some(
        (event) => event._id === newEvent._id
      );

      if (!isDuplicate) {
        store.dispatch(fetchEvents());
      }
    });
  }
};
