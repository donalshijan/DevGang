import { createReducer, on } from '@ngrx/store';
import * as ProjectActions from './project.actions';

export interface ProjectState {
  currentProjectId: string;
}

export const initialState: ProjectState = {
  currentProjectId: ''
};

export const projectReducer = createReducer(
  initialState,
  on(ProjectActions.setCurrentProjectId, (state, { id }) => ({ ...state, currentProjectId: id })),
  on(ProjectActions.clearCurrentProjectId, state => ({ ...state, currentProjectId: '' }))
);
