import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Sets up Angular's routing based on app.routes.ts
    provideRouter(routes),
    // Registers HttpClient globally and wires in the auth interceptor
    // so every HTTP request automatically goes through authInterceptor
    provideHttpClient(withInterceptors([authInterceptor])
)
  ]
};
