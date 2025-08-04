import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TodoState {
  search: string;
  stats: {
    total: number;
    upcoming: number;
    completed: number;
  };
}

const initialState: TodoState = {
  search: "",
  stats: {
    total: 0,
    upcoming: 0,
    completed: 0,
  },
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    clearSearch: (state) => {
      state.search = "";
    },
    setStats: (
      state,
      action: PayloadAction<{
        total: number;
        upcoming: number;
        completed: number;
      }>
    ) => {
      state.stats = action.payload;
    },
  },
});

export const { setSearch, clearSearch, setStats } = todoSlice.actions;
export default todoSlice.reducer;
