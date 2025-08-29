// используемые в интерцепторе типы
// HttpInterceptorFn — функциональный HTTP интерцептор
// HttpRequest - исходный HTTP-запрос
// HttpHandlerFn - функция, которая передаёт запрос дальше по цепочке
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth';
// RxJS операторы для работы с потоками
import { BehaviorSubject, catchError, filter, switchMap, tap, throwError } from 'rxjs';

// флаг, показывающий, что в данный момент выполняется обновление токена
let isRefreshing$ = new BehaviorSubject<boolean>(false);

// функция для добавления токена к запросу
const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
    });
};

// основной интерцептор (перехватчик) для добавления токена авторизации в заголовки всех запросов
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    // внедрение зависимости (экземпляр сервиса AuthService)
    const authService = inject(AuthService);
    // берем текущий token из сервиса
    const token = authService.token;

    // если токена нет - пропускаем запрос без изменений
    if (!token) return next(req);

    // если ИДЕТ процесс обновления - вызываем функцию обновления не дожидаясь ошибки
    if (isRefreshing$.value) {
        return refreshAndProceed(authService, req, next);
    }

    // если НЕ ИДЕТ процесс обновления - добавляем токен к запросу
    return next(addToken(req, token)).pipe(
        catchError((error) => {
            // если токен просроченый (403) - вызываем функцию обновления
            if (error.status === 403) {
                return refreshAndProceed(authService, req, next);
            }
            return throwError(() => error);
        }),
    );
};

// функция для обновления токена и повторной отправки запроса
const refreshAndProceed = (
    authService: AuthService,
    req: HttpRequest<any>,
    next: HttpHandlerFn,
) => {
    // если в данный момент НЕ ИДЕТ обновление токена - запускаем процесс обновления
    if (!isRefreshing$.value) {
        isRefreshing$.next(true);
        // получаем новый токен по переданному refreshToken
        return authService.refreshAuthToken().pipe(
            // меняем поток на поток с новым запросом
            switchMap((res) => {
                // добавляем новый токен к запросу
                return next(addToken(req, res.access_token)).pipe(
                    tap(() => isRefreshing$.next(false)),
                );
            }),
        );
    }

    // пробиваем путь для прохода refresh запроса
    if (req.url.includes('refresh')) return next(addToken(req, authService.token!));

    // если ИДЕТ обновление токена - ждать пока закончится обновление
    // подписываемся на isRefreshing$
    return isRefreshing$.pipe(
        // игнорируем все не false значения (ждем когда закончится обновление)
        filter((isRefreshing) => !isRefreshing),
        switchMap((res) => {
            return next(addToken(req, authService.token!));
        }),
    );
};
