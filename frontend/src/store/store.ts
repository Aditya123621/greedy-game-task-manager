import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import drawerReducer from "./slices/drawerSlice";
import todoReducer from "./slices/todoSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drawer: drawerReducer,
    todo: todoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
