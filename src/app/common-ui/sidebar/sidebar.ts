import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIcon } from '../svg-icon/svg-icon';
import { SubscriberCard } from './subscriber-card/subscriber-card';
import { ProfileService } from '../../data/services/profile';
import { firstValueFrom } from 'rxjs';
import { ImgUrlPipe } from '../../helpers/pipes/img-url-pipe';

@Component({
    selector: 'app-sidebar',
    imports: [SvgIcon, CommonModule, RouterLink, SubscriberCard, ImgUrlPipe, RouterLinkActive],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar {
    // внедрение зависимости (экземпляр сервиса ProfileService)
    profileService = inject(ProfileService);

    // вызывается метод сервиса getSubscribersShortList и Observable присваевается потоку
    subscribers$ = this.profileService.getSubscribersShortList();

    // в свойство me записываем значение сигнала me
    me = this.profileService.me;

    menuItems = [
        {
            label: 'Моя страница',
            icon: 'home',
            link: 'profile/me',
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

    // вызывается единожды после инициализации компонента (жизненный цикл)
    ngOnInit() {
        // вызывается метод сервиса getMe без подписки (только первое значение)
        firstValueFrom(this.profileService.getMe());
    }
}
