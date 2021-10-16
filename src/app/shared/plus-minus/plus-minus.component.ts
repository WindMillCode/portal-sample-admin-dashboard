import { Component, Output,OnInit,ChangeDetectionStrategy,ChangeDetectorRef,HostBinding, HostListener,ViewContainerRef, Input, SimpleChange } from '@angular/core';
import {fromEvent,iif,Subscription,of} from 'rxjs';
import { RyberService } from 'src/app/ryber.service';
import { classPrefix } from 'src/app/customExports';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-plus-minus',
  templateUrl: './plus-minus.component.html',
  styleUrls: ['./plus-minus.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlusMinusComponent implements OnInit {

    @Input() input!:{
        value:any
    }
    @Input() onAdd:Function
    @Input() onMinus:Function
    @Input() focusout:Function
    @Input() blur:Function
    @Input() range:{min:number,max:number}
    // metadata
    meta = {
        name:"plusMinus"
    }
    // @HostBinding('class') myClass: string = `a_p_p_${this.meta.name}View`;
    prefix ={
        main:classPrefix( {view:`${this.meta.name}Main`}),
        view: classPrefix({view:`${this.meta.name}`}),
        pods:Array(1).fill(null)
        .map((x:any,i)=>{
            return classPrefix({view:`${this.meta.name}Pod`+i})
        })
    }
    subs: Subscription[] = [];
    //

    pM:any = {
        input: {
            value:1
        },
        minus:{
            click:()=>{
                let {pM,ref}= this;
                if(pM.input.value>pM.input.range.min){
                    pM.input.value--
                    pM.input.onMinus()
                    ref.detectChanges()
                }
            }
        },
        add:{
            click:()=>{
                let {pM,ref}= this;
                if(pM.input.value<pM.input.range.max){
                    pM.input.value++
                    pM.input.onAdd()
                    ref.detectChanges()
                }
            }
        },
    }


    constructor(
        private ref: ChangeDetectorRef,
        private vcf:ViewContainerRef,
        public ryber: RyberService
    ) { }

    ngOnInit(): void {
        let {pM,input,ref,onAdd,onMinus,focusout,blur,range} = this;
        // initalize the actual value from the parennt logic

        pM.input = input
        pM.input.onAdd = onAdd ?? pM.input.onAdd ?? (()=>{})
        pM.input.onMinus = onMinus ?? pM.input.onMinus ?? (()=>{})
        pM.input.focusout = focusout ?? pM.input.focusout ?? (()=>{})
        pM.input.blur = blur ?? pM.input.blur ?? (()=>{})
        pM.input.range = range ?? pM.input.range ?? {min:1,max:50}
        ref.detectChanges()
        //
    }



    ngOnDestroy(): void {
        this.subs
        .forEach((x:any,i)=>{
            x?.unsubscribe();
        })
    }

}
