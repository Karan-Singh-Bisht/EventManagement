import { io } from "socket.io-client";
import { API_BASE_URL } from "../config/apiConfig";

export const socket = io(API_BASE_URL, {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to WebSocket server");
});

socket.on("newEventCreated", (data) => {
  console.log("New event received via WebSocket:", data);
});

socket.on("attendeeCountUpdated", (data) => {
  console.log("Attendee count updated via WebSocket:", data);
});

socket.on("eventUpdated", (data) => {
  console.log("Event updated via WebSocket:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});
