import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "@/lib/features/project/projectSlice";
import chatReducer from "@/lib/features/chat/chatSlice";
import generalReducer from "@/lib/features/general/generalSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      project: projectReducer,
      chat: chatReducer,
      general: generalReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
