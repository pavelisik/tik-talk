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
    profileService = inject(ProfileService);

    ngOnInit() {
        console.log('ngOnInit');
        this.profileService.getMe().subscribe((val) => console.log(val));
    }
}
