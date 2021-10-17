import { ChangeDetectorRef, Directive,Input, TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appEntryPropertyType]'
})
export class EntryPropertyTypeDirective {

    @Input() entryPropertyType!:{
        type:string,
        textEntry:TemplateRef<any>
        viewEntry:TemplateRef<any>
        modifyEntry:TemplateRef<any>,
        y:any,
        x:any,
        prefix:any
    }
    extras:any;




    constructor(
        public vcf:ViewContainerRef,
        public ref:ChangeDetectorRef
    ) { }

    ngAfterViewInit(){
        this.extras = this.entryPropertyType
        let {extras,vcf,ref} = this
        switch (extras.type) {
            case "text":
                vcf.createEmbeddedView(
                    extras.textEntry,
                    {$implicit:{
                        x:extras.x,
                        y:extras.y,
                        class:extras.prefix.pods[2]({val:'Text1'})
                    }}
                )

                break;
            case "view":
                vcf.createEmbeddedView(
                    extras.viewEntry,
                    {
                        $implicit:{
                            x:extras.x,
                            class:extras.prefix.pods[2]({val:'Button0'})
                        }
                    }
                )

                break;
            case "modify":
                vcf.createEmbeddedView(
                    extras.modifyEntry,
                    {
                        $implicit:{
                            x:extras.x,
                            class:extras.prefix.pods[2]({val:'Button1'})
                        }
                    }
                )
                break;

            default:
                break;
        }
        ref.detectChanges()

    }

}
