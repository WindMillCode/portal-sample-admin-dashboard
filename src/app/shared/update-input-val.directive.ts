import { ChangeDetectorRef, Directive, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appUpdateInputVal]'
})
export class UpdateInputValDirective {

    @Input() updateInputVal:any;
    extras:any;

    @HostListener('focusout', ['$event']) onFocusout(evt:FocusEvent) {

        this.extras.value = (evt!.target as HTMLInputElement).value
        this.extras.focusout?.()
        this.ref.detectChanges()
    }

    @HostListener('blur', ['$event']) onBlur(evt:FocusEvent) {

        this.extras.value = (evt!.target as HTMLInputElement).value
        this.extras.blur?.()
        this.ref.detectChanges()
    }

    constructor(
        private ref:ChangeDetectorRef
    ) { }

    ngOnInit(){
        this.extras = this.updateInputVal
    }

}
