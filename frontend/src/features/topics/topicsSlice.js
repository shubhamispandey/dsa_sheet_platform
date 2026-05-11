
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const fetchTopics = createAsyncThunk(
  "topics/fetchTopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/topics");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch topics",
      );
    }
  },
);

export const fetchProblems = createAsyncThunk(
  "topics/fetchProblems",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/topics/${topicId}/problems`,
      );

      return {
        topicId,
        problems: response.data.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch problems",
      );
    }
  },
);

const initialState = {
  topics: [],
  problems: {},
  currentTopic: null,

  topicsLoading: false,
  problemsLoading: false,

  error: null,
};

const topicsSlice = createSlice({
  name: "topics",
  initialState,

  reducers: {
    setCurrentTopic: (state, action) => {
      state.currentTopic = action.payload;
      state.error = null;
    },

    resetTopicsState: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // FETCH TOPICS

      .addCase(fetchTopics.pending, (state) => {
        state.topicsLoading = true;
        state.error = null;
      })

      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.topicsLoading = false;
        state.topics = action.payload;

        // Auto select first topic
        if (
          action.payload.length > 0 &&
          !state.currentTopic
        ) {
          state.currentTopic = action.payload[0];
        }
      })

      .addCase(fetchTopics.rejected, (state, action) => {
        state.topicsLoading = false;
        state.error = action.payload;
      })

      // FETCH PROBLEMS

      .addCase(fetchProblems.pending, (state) => {
        state.problemsLoading = true;
        state.error = null;
      })

      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.problemsLoading = false;

        state.problems[action.payload.topicId] =
          action.payload.problems;
      })

      .addCase(fetchProblems.rejected, (state, action) => {
        state.problemsLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentTopic,
  resetTopicsState,
} = topicsSlice.actions;

export default topicsSlice.reducer;

