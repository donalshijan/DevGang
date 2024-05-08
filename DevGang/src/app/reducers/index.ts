import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { projectReducer, ProjectState } from '../project.reducer';

export interface State {
  project: ProjectState; 
}

export const reducers: ActionReducerMap<State> = {
  project: projectReducer  
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
