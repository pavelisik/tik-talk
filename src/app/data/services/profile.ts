import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Profile } from '../interfaces/profile.interface';
import type { Pageble } from '../interfaces/pageble.interface';
import { map, tap } from 'rxjs';

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
        // .pipe(
        //     tap(res => this.me.set(res))
        // )
    }

    getAccount(id: string) {
        return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`);
    }

    getSubscribersShortList() {
        return this.http
            .get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
            .pipe(map((res) => res.items.slice(0, 3)));
    }

    patchProfile(profile: Partial<Profile>) {
        return this.http.patch<Profile>(`${this.baseApiUrl}account/me`, profile);
    }
}
function Pageble<T>(arg0: string) {
    throw new Error('Function not implemented.');
}
