import { createSelector } from '@ngrx/store';
import { ProjectState } from './project.reducer';
import { State } from './reducers';
export type AppState = State;

export const selectProject = (state: AppState) => state.project;

export const selectCurrentProjectId = createSelector(
  selectProject,
  (state: ProjectState) => state.currentProjectId
);
