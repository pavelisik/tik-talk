import { Component, Input } from '@angular/core';

@Component({
    selector: 'svg[icon]',
    imports: [],
    template: '<svg:use [attr.href]="href"></svg:use>',
    styles: [''],
})
export class SvgIcon {
    @Input() icon = '';

    // геттер, который формирует полный путь к SVG-иконке
    get href() {
        return `/assets/svg/${this.icon}.svg#${this.icon}`;
    }
}
