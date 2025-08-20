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
    // в переменную profileService сохраняем экземпляр Profile
    profileService = inject(ProfileService);
    // массив полученных профилей
    profiles: Profile[] = [];

    constructor() {
        this.profileService.getTestAccounts().subscribe((val) => {
            this.profiles = val;
        });
    }
}
