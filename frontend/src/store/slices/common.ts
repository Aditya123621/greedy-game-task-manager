import { createSlice } from "@reduxjs/toolkit";

interface CommonState {
  isSidebarOpen: boolean;
}

const initialState: CommonState = {
  isSidebarOpen: false,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setSidebarOpen } = commonSlice.actions;
export default commonSlice.reducer;
