import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authTokenInterceptor } from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
    // глобальные провайдеры для приложения
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        // функция для маршрутизации принимает массив всех маршрутов
        provideRouter(routes),
        // добавление сервиса HttpClient со списком HTTP-перехватчиков интерцепторов
        // authTokenInterceptor - пользовательский интерцептор для добавления токена авторизации в заголовки всех запросов
        provideHttpClient(withInterceptors([authTokenInterceptor])),
    ],
};
