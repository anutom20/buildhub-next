import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProjectState {
  currentProject: { name: string; id: string };
  projects: { name: string; id: string }[];
}

const initialState: ProjectState = {
  currentProject: { name: "", id: "" },
  projects: [],
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setCurrentProject: (
      state,
      action: PayloadAction<{ name: string; id: string }>
    ) => {
      state.currentProject = action.payload;
    },
    setProjects: (
      state,
      action: PayloadAction<{ name: string; id: string }[]>
    ) => {
      state.projects = action.payload;
    },
  },
});

export const { setCurrentProject, setProjects } = projectSlice.actions;

export default projectSlice.reducer;
