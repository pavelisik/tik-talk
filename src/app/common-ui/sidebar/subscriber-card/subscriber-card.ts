import { Profile } from './../../../data/interfaces/profile.interface';
import { Component, Input } from '@angular/core';
import { ImgUrlPipe } from '../../../helpers/pipes/img-url-pipe';

@Component({
    selector: 'app-subscriber-card',
    imports: [ImgUrlPipe],
    templateUrl: './subscriber-card.html',
    styleUrl: './subscriber-card.scss',
})
export class SubscriberCard {
    @Input() profile!: Profile;
}
