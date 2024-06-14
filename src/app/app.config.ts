import { ApplicationConfig } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Route, provideRouter } from '@angular/router';

const routes: Route[] = [];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations()],
};
