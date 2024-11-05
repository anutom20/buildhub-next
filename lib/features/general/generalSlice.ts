import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GeneralState {
  currentViewId: string;
}

const initialState: GeneralState = {
  currentViewId: "overview",
};

export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setCurrentViewId: (state, action: PayloadAction<string>) => {
      state.currentViewId = action.payload;
    },
  },
});

export const { setCurrentViewId } = generalSlice.actions;

export default generalSlice.reducer;
