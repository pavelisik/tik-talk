import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Profile } from '../interfaces/profile.interface';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    // внедрение зависимости (экземпляр сервиса HttpClient)
    http = inject(HttpClient);

    baseApiUrl = 'https://icherniakov.ru/yt-course/';

    // метод сервиса по запросу данных тестового аккаунта
    getTestAccounts() {
        return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
    }

    // метод сервиса по запросу данных о текущем пользователе
    getMe() {
        return this.http.get<Profile>(`${this.baseApiUrl}account/me`);
    }
}
