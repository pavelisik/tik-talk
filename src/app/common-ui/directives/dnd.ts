import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[dnd]',
})
export class Dnd {
    // декоратор Output передает событие fileDropped (которе будет эмитить File) наружу (родительскому компоненту)
    @Output() fileDropped = new EventEmitter<File>();

    // декоратор HostBinding - привязывает свойство fileover к классу host-элемента
    @HostBinding('class.fileover')
    fileover = false;

    // декоратор HostListener - подписка на события DOM (декларативная замена EventListener)

    // подписывает метод onDragOver на событие dragover (когда файл тащат над элементом)
    @HostListener('dragover', ['$event'])
    onDragOver(event: DragEvent) {
        // отменяем дефолтное поведение браузера
        event.preventDefault();
        // останавливаем всплытие события
        event.stopPropagation();

        // меняем свойство (а с ним и класс) для подсветки зоны наведения
        this.fileover = true;
    }

    // подписывает метод onDragLeave на событие dragleave (когда файл уходит за пределы зоны)
    @HostListener('dragleave', ['$event'])
    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        // отмена подсветки
        this.fileover = false;
    }

    // подписывает метод onDrop на событие drop (когда пользователь отпускает файл над зоной)
    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        // отмена подсветки
        this.fileover = false;

        // эмитим файл с изображением наружу родительскому компоненту
        this.fileDropped.emit(event.dataTransfer?.files[0]);
    }
}
