import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Profile } from '../interfaces/profile.interface';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    // инжектируем сущность HttpClient (запрашиваем ее у Angular)
    http = inject(HttpClient);

    baseApiUrl = 'https://icherniakov.ru/yt-course/';

    // метод сервиса по запросу данных тестового аккаунта
    getTestAccounts() {
        return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
    }
}
