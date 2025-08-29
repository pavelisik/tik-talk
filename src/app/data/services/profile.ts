import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
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

    // создаем сигнал для данных по своему аккаунту
    me = signal<Profile | null>(null);

    // создаем сигнал для отфильтрованных профилей в поиске
    filteredProfiles = signal<Profile[]>([]);

    // метод сервиса по запросу данных тестового аккаунта
    getTestAccounts() {
        return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
    }

    // метод сервиса по запросу данных о текущем пользователе
    getMe() {
        return this.http
            .get<Profile>(`${this.baseApiUrl}account/me`)
            .pipe(tap((res) => this.me.set(res)));
    }

    // метод сервиса по запросу данных о конкретном пользователе по id
    getAccount(id: string) {
        return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`);
    }

    // метод сервиса по запросу короткого списка подписчиков
    getSubscribersShortList(subsAmount = 3) {
        return (
            this.http
                .get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
                // обрезаем поток с данными подписчиков до необходимого числа
                .pipe(map((res) => res.items.slice(0, subsAmount)))
        );
    }

    // метод сервиса обновляющий данный о текущем пользователе
    patchProfile(profile: Partial<Profile>) {
        return this.http.patch<Profile>(`${this.baseApiUrl}account/me`, profile);
    }

    // метод сервиса загружающий аватарку пользователя на сервер
    uploadAvatar(file: File) {
        const fd = new FormData();
        fd.append('image', file);

        return this.http.post<Profile>(`${this.baseApiUrl}account/upload_image`, fd);
    }

    // метод сервиса загружающий отфильтрованные профили по запросу
    filterProfiles(params: Record<string, any>, limit = 5) {
        return this.http
            .get<Pageble<Profile>>(`${this.baseApiUrl}account/accounts`, { params })
            .pipe(
                map((res) => res.items.slice(0, limit)),
                tap((profiles) => this.filteredProfiles.set(profiles)),
            );
    }
}
