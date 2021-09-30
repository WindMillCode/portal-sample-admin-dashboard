import { Directive, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appUpdateInputVal]'
})
export class UpdateInputValDirective {

    @Input() updateInputVal:any;
    extras:any;

    @HostListener('focusout', ['$event']) onFocusout(evt:FocusEvent) {
        this.updateInputVal.value = (evt!.target as HTMLInputElement).value
    }

    @HostListener('blur', ['$event']) onBlur(evt:FocusEvent) {
        this.updateInputVal.value = (evt!.target as HTMLInputElement).value
    }

    constructor() { }

    ngOnInit(){
        this.extras = this.updateInputVal
    }

}
