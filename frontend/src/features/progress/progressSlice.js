import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../api/axios";

// FETCH PROGRESS

export const fetchProgress = createAsyncThunk(
  "progress/fetchProgress",

  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/progress");

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch progress",
      );
    }
  },
);

// UPDATE PROGRESS

export const updateProgress = createAsyncThunk(
  "progress/updateProgress",

  async ({ problemId, completed }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/progress/${problemId}`, {
        completed,
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update progress",
      );
    }
  },
);

const initialState = {
  progress: [],

  fetchLoading: false,
  updateLoading: false,

  error: null,
};

const progressSlice = createSlice({
  name: "progress",

  initialState,

  reducers: {
    resetProgressState: () => initialState,
  },

  extraReducers: (builder) => {
    builder;

    // FETCH PROGRESS

    builder
      .addCase(fetchProgress.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })

      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.fetchLoading = false;

        state.progress = action.payload;
      })

      .addCase(fetchProgress.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload;
      });

    // UPDATE PROGRESS

    builder
      .addCase(updateProgress.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })

      .addCase(updateProgress.fulfilled, (state, action) => {
        state.updateLoading = false;

        const updatedProgress = action.payload;

        // normalize ids
        const updatedProblemId = String(updatedProgress.problemId);

        const existingIndex = state.progress.findIndex(
          (item) => String(item.problemId) === updatedProblemId,
        );

        if (existingIndex !== -1) {
          // UPDATE EXISTING ENTRY
          state.progress[existingIndex] = updatedProgress;
        } else {
          // ADD NEW ENTRY
          state.progress.push(updatedProgress);
        }
      })

      .addCase(updateProgress.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProgressState } = progressSlice.actions;

export default progressSlice.reducer;
