import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DrawerType =
  | "profile"
  | "notification"
  | "todo_detail"
  | "add_todo"
  | null;

interface DrawerState {
  opened: boolean;
  type: DrawerType;
  data?: unknown;
}

const initialState: DrawerState = {
  opened: false,
  type: null,
  data: null,
};

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    openDrawer: (
      state,
      action: PayloadAction<{ type: DrawerType; data?: unknown }>
    ) => {
      state.opened = true;
      state.type = action.payload.type;
      state.data = action.payload.data || null;
    },
    closeDrawer: (state) => {
      state.opened = false;
      state.type = null;
      state.data = null;
    },
  },
});

export const { openDrawer, closeDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;
