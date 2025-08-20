import { Auth } from './../../auth/auth';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login-page',
    imports: [ReactiveFormsModule],
    templateUrl: './login-page.html',
    styleUrl: './login-page.scss',
})
export class LoginPage {
    auth = inject(Auth);
    router = inject(Router);

    form = new FormGroup({
        username: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        password: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    onSubmit() {
        if (this.form.valid) {
            console.log(this.form.value);
            this.auth.login(this.form.getRawValue()).subscribe((res) => {
                this.router.navigate(['']);
                console.log(res);
            });
        }
    }
}
