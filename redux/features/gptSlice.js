import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts } from "../../components/common/apicalculator";
import gptData from "../../data/gptData";

export const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    gpts: getAllPosts,
    specificItem: gptData[0],
  },
  reducers: {
    specificgpt: (state, action) => {
      state.specificItem = state.gpts.find((gpt) => gpt.id === action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { specificgpt } = gptSlice.actions;

export default gptSlice.reducer;
