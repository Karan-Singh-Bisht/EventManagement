import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL, axiosInstance } from "../../config/apiConfig";
import axios from "axios";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message || "Registeration Failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/login`,
        formData
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Login Failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("token");
      axios.defaults.headers.common["Authorization"] = null;
      return { message: "Logged out successfully" };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to log out");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAuth } = authSlice.actions; // Export the reset action
export default authSlice.reducer;
