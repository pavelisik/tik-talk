import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '@app/data/services/profile';
import { debounceTime, startWith, switchMap } from 'rxjs';

@Component({
    selector: 'app-profile-filters',
    imports: [ReactiveFormsModule],
    templateUrl: './profile-filters.html',
    styleUrl: './profile-filters.scss',
})
export class ProfileFilters {
    // инжектируем фабрику для создания форм и сервис для профилей
    fb = inject(FormBuilder);
    profileService = inject(ProfileService);

    // создаем реактивную форму
    searchForm = this.fb.group({
        firstName: [''],
        lastName: [''],
        stack: [''],
    });

    constructor() {
        // подписка на изменения формы
        // возвращает Observable, который эмиттирует значения формы каждый раз, когда пользователь что-то вводит
        this.searchForm.valueChanges
            .pipe(
                // устанавливаем пустое начальное значение потока
                // чтобы сразу после инициализации произошел первый запрос, даже если пользователь еще ничего не ввел
                startWith({}),
                // задержка после последнего изменения формы, чтобы не отправлять запросы слишком часто
                debounceTime(300),
                switchMap((formValue) => {
                    return this.profileService.filterProfiles(formValue);
                }),
                // автоматическая отписка от Observable при уничтожении компонента
                takeUntilDestroyed(),
            )
            .subscribe();
    }
}
