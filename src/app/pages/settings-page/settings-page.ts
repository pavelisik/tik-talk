import { Component, effect, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileHeader } from '../../common-ui/profile-header/profile-header';
import { ProfileService } from '../../data/services/profile';
import { firstValueFrom } from 'rxjs';
import { AvatarUpload } from './avatar-upload/avatar-upload';

@Component({
    selector: 'app-settings-page',
    imports: [ProfileHeader, ReactiveFormsModule, AvatarUpload],
    templateUrl: './settings-page.html',
    styleUrl: './settings-page.scss',
})
export class SettingsPage {
    // инжектируем сущность FormBuilder для форм
    fb = inject(FormBuilder);
    // инжектируем сервис ProfileService
    profileService = inject(ProfileService);

    // декоратор ViewChild - позволяет получить доступ к методам и свойствам дочернего компонента
    // нужен, чтобы при сохранении профиля можно было достать avatarUploader.avatar
    @ViewChild(AvatarUpload) avatarUploader!: AvatarUpload;

    // создаем реактивную форму
    form = this.fb.nonNullable.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: [{ value: '', disabled: true }, Validators.required],
        description: [''],
        stack: [''],
    });

    // инициализация формы и заполнение ее актуальными данными пользователя
    constructor() {
        effect(() => {
            // обновляем значения в форме
            this.form.patchValue({
                // значениями из сигнала me
                ...this.profileService.me(),
                // и исправленным в одну строку значением поля навыков
                stack: this.mergeStack(this.profileService.me()?.stack),
            });
        });
    }

    // метод для сохранения данных из формы
    onSave() {
        // сделать так как-будто с формой интерактивили
        this.form.markAllAsTouched();
        // отрабатывают все валидаторы
        this.form.updateValueAndValidity();

        // если ошибки валидации - не сохраняем
        if (this.form.invalid) return;

        // если загружен аватар, то отправляем его отдельно запросом uploadAvatar
        if (this.avatarUploader.avatar) {
            firstValueFrom(this.profileService.uploadAvatar(this.avatarUploader.avatar));
        }

        // обновляем данные профиля данными из формы
        firstValueFrom(
            this.profileService.patchProfile({
                ...this.form.value,
                // превращает строку с навыками в массив
                stack: this.splitStack(this.form.value.stack),
            }),
        );
    }

    // метод превращает строку с навыками в массив
    splitStack(stack: string | null | string[] | undefined): string[] {
        if (!stack) return [];
        if (Array.isArray(stack)) return stack;
        return stack.split(',');
    }

    // метод превращает массив навыков в строку
    mergeStack(stack: string | null | string[] | undefined) {
        if (!stack) return '';
        if (Array.isArray(stack)) return stack.join(',');
        return stack;
    }
}
