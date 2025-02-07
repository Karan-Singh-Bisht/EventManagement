import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/authSlice";
import eventReducer from "./Event/eventSlice";
import { socketMiddleware } from "./middlewares/socketMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
});
