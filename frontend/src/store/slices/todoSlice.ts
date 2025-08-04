import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TodoState {
  search: string;
}

const initialState: TodoState = {
  search: "",
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
  },
});

export const { setSearch, clearSearch } = todoSlice.actions;
export default todoSlice.reducer;
