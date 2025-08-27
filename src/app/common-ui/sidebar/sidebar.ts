import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SvgIcon } from '../svg-icon/svg-icon';
import { SubscriberCard } from './subscriber-card/subscriber-card';
import { ProfileService } from '../../data/services/profile';

@Component({
    selector: 'app-sidebar',
    imports: [SvgIcon, CommonModule, RouterLink, SubscriberCard],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar {
    profileService = inject(ProfileService);

    subscribers$ = this.profileService.getSubscribersShortList();

    // me = this.profileService.me

    menuItems = [
        {
            label: 'Моя страница',
            icon: 'home',
            link: '',
        },
        {
            label: 'Чаты',
            icon: 'chat',
            link: 'chat',
        },
        {
            label: 'Поиск',
            icon: 'search',
            link: 'search',
        },
    ];
}
