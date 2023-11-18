import { configureStore } from "@reduxjs/toolkit";

import gptSlice from "./features/gptSlice";
// import AuthProvider from '../hooks/useFirebase';

export const store = configureStore({
  reducer: {
    gpts: gptSlice,
    // auth:AuthProvider(),
  },
});
