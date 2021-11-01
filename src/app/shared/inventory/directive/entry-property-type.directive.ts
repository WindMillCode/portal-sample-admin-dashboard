import { ChangeDetectorRef, Directive,Input, TemplateRef,  ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appEntryPropertyType]'
})
export class EntryPropertyTypeDirective {

    @Input() entryPropertyType!:{
        type:string,
        textEntry:TemplateRef<any>
        viewEntry:TemplateRef<any>
        modifyEntry:TemplateRef<any>,
        imageEntry:TemplateRef<any>
        y:any,
        x:any,
        prefix:any,
        click?:()=> void
    }
    extras:any;




    constructor(
        public vcf:ViewContainerRef,
        public ref:ChangeDetectorRef
    ) { }

    ngAfterViewInit(){
        this.extras = this.entryPropertyType
        let {extras,vcf,ref} = this
        let {prefix,x,y} = extras

        switch (extras.type) {

            case "image":
                vcf.createEmbeddedView(
                    extras.imageEntry,
                        {
                            $implicit:{
                            x:x,
                            y:y,
                            click:y.meta.interact.click({
                                key:x.view.subProp,perm:"img"
                            }),
                            class:x.title.class ?? prefix.pods[2]({val:'Img0'})
                        }
                    }
                )

                break;

            case "text":
                vcf.createEmbeddedView(
                    extras.textEntry,
                        {
                            $implicit:{
                            x:x,
                            y:y,
                            class:x.title.class ?? prefix.pods[2]({val:'Text1'})
                        }
                    }
                )

                break;
            case "view":

                vcf.createEmbeddedView(
                    extras.viewEntry,
                    {
                        $implicit:{
                            x:x,
                            class:x.title.class ?? prefix.pods[2]({val:'Button0'}),
                            click:y.meta.interact.click({
                                key:x.view.subProp
                            })
                        }
                    }
                )

                break;
            case "modify":
                vcf.createEmbeddedView(
                    extras.modifyEntry,
                    {
                        $implicit:{
                            x:x,
                            class:x.title.class ??prefix.pods[2]({val:'Button1'}),
                            click:y.meta.interact.click({
                                key:x.view.subProp,perm:"edit"
                            })
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
