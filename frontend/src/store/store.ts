import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import drawerReducer from "./slices/drawerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drawer: drawerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
