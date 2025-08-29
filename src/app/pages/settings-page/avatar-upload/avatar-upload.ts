import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SvgIcon } from '@app/common-ui/svg-icon/svg-icon';
import { Dnd } from '@app/common-ui/directives/dnd';

@Component({
    selector: 'app-avatar-upload',
    imports: [SvgIcon, Dnd, FormsModule],
    templateUrl: './avatar-upload.html',
    styleUrl: './avatar-upload.scss',
})
export class AvatarUpload {
    // сигнал, в котором хранится путь к превью аватарки
    preview = signal<string>('/assets/images/avatar-placeholder.png');
    // свойство в котором хранится загруженный файл изображения
    avatar: File | null = null;

    // метод обработчика событий для input
    fileBrowserHandler(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        this.processFile(file);
    }

    // метод для загрузки файла после перетаскивания (от директивы dnd)
    onFileDropped(file: File) {
        this.processFile(file);
    }

    // универсальный метод для загрузки картинки
    processFile(file: File | null | undefined) {
        // проверка на наличие и на тип image
        if (!file || !file.type.match('image')) return;

        // создаем экземпляр FileReader
        const reader = new FileReader();

        // назначем обработчик onload, загружаем файл с изображением как Base64 строку
        reader.onload = (event) => {
            // обновляем путь к изображению в превью
            this.preview.set(event.target?.result?.toString() ?? '');
        };

        // читает файл полностью и кодирует его содержимое в base64-строку, обёрнутую в формат Data URL
        reader.readAsDataURL(file);

        // сохраняем файл в avatar, чтобы позже можно было его отправить на сервер
        this.avatar = file;
    }
}
