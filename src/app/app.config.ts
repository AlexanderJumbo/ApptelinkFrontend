import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './custom/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(), provideToastr({ timeOut: 1000, preventDuplicates: true }), provideRouter(routes), provideHttpClient(), provideHttpClient(withInterceptors([authInterceptor])), provideClientHydration()]
};
