import { inject } from '@angular/core';
import { AuthService } from './auth';
import { Router } from '@angular/router';

export const canActivateAuth = () => {
    // внедрение зависимостей (экземпляры сервисов AuthService и Router)
    const authService = inject(AuthService);
    const router = inject(Router);

    // если авторизован (вызов геттера isAuth проверяющего наличие токенов) - guard пропускает маршрут
    if (authService.isAuth) {
        return true;
    }

    // если не авторизован - возвращаем объект UrlTree (перенаправит на login)
    return router.createUrlTree(['/login']);
};
