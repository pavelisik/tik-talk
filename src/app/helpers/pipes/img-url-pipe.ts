import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    // имя пайпа, которое можно будет использовать в шаблоне
    name: 'imgUrl',
})
export class ImgUrlPipe implements PipeTransform {
    // обязательный метод пайпа который трансормирует входное значение
    transform(value: string | null, ...args: unknown[]): string | null {
        if (!value) return null;
        return `https://icherniakov.ru/yt-course/${value}`;
    }
}
