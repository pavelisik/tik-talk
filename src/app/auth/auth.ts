import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
// RxJS операторы для работы с потоками
import { tap, catchError, throwError } from 'rxjs';
import { TokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    // внедрение зависимостей (экземпляр сервиса HttpClient, Router, CookieService)
    http = inject(HttpClient);
    router = inject(Router);
    cookieService = inject(CookieService);
    baseApiUrl = 'https://icherniakov.ru/yt-course/auth/';

    // храним token и refreshToken
    token: string | null = null;
    refreshToken: string | null = null;

    // геттер, который проверяет наличие токенов и при необходимости подгружает его из cookies
    get isAuth() {
        if (!this.token) {
            // подгружает значения токенов из cookies
            this.token = this.cookieService.get('token');
            this.refreshToken = this.cookieService.get('refreshToken');
        }
        return !!this.token;
    }

    // метод сервиса запрашивает токены по переданным в виде FormData логину и паролю
    login(payload: { username: string; password: string }) {
        const fd = new FormData();
        fd.append('username', payload.username);
        fd.append('password', payload.password);

        return (
            this.http
                .post<TokenResponse>(`${this.baseApiUrl}token`, fd)
                // сохраняем полученные токены в свойства и в cookies
                // tap - вмешивается в поток данных не внося в них изменения
                .pipe(tap((val) => this.saveTokens(val)))
        );
    }

    // метод сервиса запрашивает новые токены по переданному refreshToken
    refreshAuthToken() {
        return this.http
            .post<TokenResponse>(`${this.baseApiUrl}refresh`, {
                refresh_token: this.refreshToken,
            })
            .pipe(
                // сохраняем полученные токены в свойства и в cookies
                tap((val) => this.saveTokens(val)),
                // в случае ошибки разлогиниваемся и пробрасываем ошибку
                catchError((err) => {
                    this.logout();
                    return throwError(() => err);
                })
            );
    }

    // метод сервиса эмулирующий разлогинивание
    logout() {
        // удаляет все cookies
        this.cookieService.deleteAll();
        // обнуляет свойства для токенов
        this.token = null;
        this.refreshToken = null;
        // переадресовывает на страницу логина
        this.router.navigate(['/login']);
    }

    // метод сервиса сохраняющий переданные токены в свойства и в cookies
    saveTokens(res: TokenResponse) {
        this.token = res.access_token;
        this.refreshToken = res.refresh_token;
        this.cookieService.set('token', this.token);
        this.cookieService.set('refreshToken', this.refreshToken);
    }
}
