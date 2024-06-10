import { ApplicationConfig } from '@angular/platform-browser';
import { Route, provideRouter } from '@angular/router';

const routes: Route[] = [];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
