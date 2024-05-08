import { createAction, props } from '@ngrx/store';

export const setCurrentProjectId = createAction(
  '[Project] Set Current Project ID',
  props<{ id: string }>()
);

export const clearCurrentProjectId = createAction(
  '[Project] Clear Current Project ID'
);
