import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import drawerReducer from "./slices/drawerSlice";
import todoReducer from "./slices/todoSlice";
import CommonReducer from "./slices/common";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drawer: drawerReducer,
    todo: todoReducer,
    common: CommonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
