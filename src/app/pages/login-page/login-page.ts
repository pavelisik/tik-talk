import { AuthService } from './../../auth/auth';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login-page',
    imports: [ReactiveFormsModule],
    templateUrl: './login-page.html',
    styleUrl: './login-page.scss',
})
export class LoginPage {
    // внедрение зависимости (экземпляр сервиса AuthService)
    authService = inject(AuthService);
    // внедрение зависимости (экземпляр сервиса маршрутизации для навигации)
    router = inject(Router);

    // создание сигнала, описывающего видимость пароля
    isPasswordVisible = signal<boolean>(false);

    // создается экземпляр FormGroup для формы, каждое поле это FormControl
    form = new FormGroup({
        username: new FormControl<string>('', {
            // запрещает null (значение всегда будет строкой)
            nonNullable: true,
            // массив валидаторов
            validators: [Validators.required],
        }),
        password: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    // метод для обработки сабмита
    onSubmit() {
        // проверка что все валидаторы пройдены
        if (this.form.valid) {
            console.log(this.form.value);
            // вызывает метод login из сервиса authService, передавая объект с логином и паролем
            this.authService.login(this.form.getRawValue()).subscribe((res) => {
                // перенаправляет на главную страницу
                this.router.navigate(['']);
                console.log(res);
            });
        }
    }
}
