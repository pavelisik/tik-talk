import { ProfileService } from './../../data/services/profile';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { SvgIcon } from '../../common-ui/svg-icon/svg-icon';
import { ProfileHeader } from '@app/common-ui/profile-header/profile-header';
import { ImgUrlPipe } from '../../helpers/pipes/img-url-pipe';
import { PostFeed } from './post-feed/post-feed';

@Component({
    selector: 'app-profile-page',
    imports: [AsyncPipe, RouterLink, ProfileHeader, SvgIcon, ImgUrlPipe, PostFeed],
    templateUrl: './profile-page.html',
    styleUrl: './profile-page.scss',
})
export class ProfilePage {
    profileService = inject(ProfileService);
    rout = inject(ActivatedRoute);
    // конвертируем сигнал в Observable
    me$ = toObservable(this.profileService.me);
    // вызывается метод сервиса getSubscribersShortList и Observable присваевается потоку
    subscribers$ = this.profileService.getSubscribersShortList(5);

    // получение параметра из роута
    profile$ = this.rout.params.pipe(
        switchMap(({ id }) => {
            if (id === 'me') return this.me$;
            return this.profileService.getAccount(id);
        }),
    );
}
