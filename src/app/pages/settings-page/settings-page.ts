import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileHeader } from '@app/common-ui/profile-header/profile-header';
import { ProfileService } from '@app/data/services/profile';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-settings-page',
    imports: [ProfileHeader, ReactiveFormsModule],
    templateUrl: './settings-page.html',
    styleUrl: './settings-page.scss',
})
export class SettingsPage {
    // инжектируем сущность FormBuilder для форм
    fb = inject(FormBuilder);
    // инжектируем сервис ProfileService
    profileService = inject(ProfileService);

    form = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: [{ value: '', disabled: true }, Validators.required],
        description: [''],
        stack: [''],
    });

    constructor() {
        effect(() => {
            // @ts-ignore
            this.form.patchValue(this.profileService.me());
        });
    }

    onSave() {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        if (this.form.invalid) return;

        // @ts-ignore
        firstValueFrom(this.profileService.patchProfile(this.form.value));
    }
}
