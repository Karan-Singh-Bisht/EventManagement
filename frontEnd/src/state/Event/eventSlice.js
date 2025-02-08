import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, axiosInstance } from "../../config/apiConfig";
import { socket } from "../../config/socket"; // Import your WebSocket instance

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/event`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (formData, { rejectWithValue }) => {
    const token = await localStorage.getItem("token");
    try {
      const response = await axiosInstance.post(
        `/api/v1/event/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      socket.emit("eventCreated", response.data);

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create event"
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ formData, eventId }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.put(
        `/api/v1/event/${eventId}/updateEvent`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update event"
      );
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      await axiosInstance.delete(`/api/v1/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { _id: eventId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete event"
      );
    }
  }
);

export const fetchEventsByCategory = createAsyncThunk(
  "events/fetchCategoryEvents",
  async (categoryName, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/v1/event/category/${categoryName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch events by category"
      );
    }
  }
);

export const joinEvent = createAsyncThunk(
  "events/joinEvent",
  async ({ eventId, action }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/api/v1/event/${eventId}/rsvp`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      socket.emit("eventAttendeesUpdated", response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to join event"
      );
    }
  }
);

export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/event/${eventId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch event by ID"
      );
    }
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState: {
    event: null,
    events: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
        state.error = null;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.events = state.events?.events?.filter(
          (event) => event._id !== action.payload._id
        );
        state.error = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(joinEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinEvent.fulfilled, (state, action) => {
        state.loading = false;
        const updatedEvent = action.payload;
        state.events.events = state.events.events.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        );
        state.event = action.payload;
        state.error = null;
      })
      .addCase(joinEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEventsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.events.events = action.payload;
        state.error = null;
      })
      .addCase(fetchEventsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
        state.error = null;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
