import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileCard } from './common-ui/profile-card/profile-card';
import { ProfileService } from './data/services/profile';
import { Profile } from './data/interfaces/profile.interface';

@Component({
    selector: 'app-root',
    imports: [ProfileCard],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('tik-talk');
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
