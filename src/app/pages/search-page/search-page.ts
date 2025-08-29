import { Component, inject } from '@angular/core';
import { ProfileCard } from '../../common-ui/profile-card/profile-card';
import { ProfileService } from '../../data/services/profile';
import { ProfileFilters } from './profile-filters/profile-filters';

@Component({
    selector: 'app-search-page',
    imports: [ProfileCard, ProfileFilters],
    templateUrl: './search-page.html',
    styleUrl: './search-page.scss',
})
export class SearchPage {
    // внедрение зависимости (экземпляр сервиса ProfileService)
    profileService = inject(ProfileService);
    // подключаем сигнал с массивом отфильтрованных профилей из сервиса
    profiles = this.profileService.filteredProfiles;
}
