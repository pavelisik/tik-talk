import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth';
import { catchError, switchMap, throwError } from 'rxjs';

let isRefreshing = false;

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(Auth);
    const token = authService.token;

    if (!token) return next(req);

    if (isRefreshing) {
        return refreshAndProceed(authService, req, next);
    }

    req = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });

    return next(addToken(req, token)).pipe(
        catchError((error) => {
            if (error.status === 403) {
                return refreshAndProceed(authService, req, next);
            }

            return throwError(error);
        })
    );
};

const refreshAndProceed = (authService: Auth, req: HttpRequest<any>, next: HttpHandlerFn) => {
    if (!isRefreshing) {
        isRefreshing = true;
        return authService.refreshAuthToken().pipe(
            switchMap((res) => {
                isRefreshing = false;
                return next(addToken(req, res.access_token));
            })
        );
    }
    return next(addToken(req, authService.token!));
};

const addToken = (req: HttpRequest<any>, token: string) => {
    return (req = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    }));
};
