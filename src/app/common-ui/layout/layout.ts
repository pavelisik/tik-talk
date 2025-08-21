import { ProfileService } from './../../data/services/profile';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
    selector: 'app-layout',
    imports: [RouterOutlet, Sidebar],
    templateUrl: './layout.html',
    styleUrl: './layout.scss',
})
export class Layout {
    // внедрение зависимости (экземпляр сервиса ProfileService)
    profileService = inject(ProfileService);

    // вызывается единожды после инициализации компонента (жизненный цикл)
    ngOnInit() {
        console.log('ngOnInit');
        // вызывается метод сервиса getMe для запроса информации о текущем пользователе
        this.profileService.getMe().subscribe((val) => console.log(val));
    }
}
