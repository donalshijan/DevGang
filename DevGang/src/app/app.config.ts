import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ErrorHandler } from '@angular/core';
import { ErrorHandlingService } from './core/error-handling.service';
import { provideStore } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { combineReducers } from '@ngrx/store';

import { StoreModule } from '@ngrx/store';
import { projectReducer } from './project.reducer';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideHttpClient(withFetch()), provideAnimationsAsync(), provideStore(reducers, { metaReducers })]
};
