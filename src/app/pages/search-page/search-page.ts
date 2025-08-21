import { Component, inject } from '@angular/core';
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileCard } from '../../common-ui/profile-card/profile-card';
import { ProfileService } from '../../data/services/profile';

@Component({
    selector: 'app-search-page',
    imports: [ProfileCard],
    templateUrl: './search-page.html',
    styleUrl: './search-page.scss',
})
export class SearchPage {
    // внедрение зависимости (экземпляр сервиса ProfileService)
    profileService = inject(ProfileService);
    // создаем пустой массив для профилей
    profiles: Profile[] = [];

    constructor() {
        // вызывается метод сервиса getTestAccounts для тестового запроса по выбору профилей
        this.profileService.getTestAccounts().subscribe((val) => {
            this.profiles = val;
        });
    }
}
