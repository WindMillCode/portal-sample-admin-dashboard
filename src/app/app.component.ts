import { Component,ComponentFactoryResolver,ViewContainerRef } from '@angular/core';
import { RyberService } from './ryber.service';
import { environment as env } from 'src/environments/environment';
import {Route} from '@angular/router';
import { eventDispatcher,flatDeep,numberParse } from './customExports';
import { of,Subscription,fromEvent } from 'rxjs';
import { delay,tap } from 'rxjs/operators';
import faker from 'faker';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    // metadata
    title = 'WindMillCode';
    subs: Subscription[] = [];
    //

    constructor(
        public ryber: RyberService,
        private vcf: ViewContainerRef
    ){}
    ngOnInit() {
        let {ryber,subs} =this;

        //remove version
        if(env.production){
            this.vcf.element.nativeElement.removeAttribute("ng-version");
        }
        //

        // so we dont have to navigate on dev
        if(!env.production){
            ryber.router.navigateByUrl(env.startURL);
        }
        //

    }

    ngAfterViewInit() {
        // dev addtions

        // e2e automation tests you wnat to remove these

        of({})
        .pipe(
            delay(1000),
            tap(
                ()=>{
                    let row = Math.floor(Math.random()*20);


                    // let buttonArray = [cart0Button,shipping0Button,billing0Button,modify0Button]
                    let buttonArray = Array(4).fill(null)
                    .map((x: HTMLButtonElement,i=4)=>{

                        return document
                        .querySelector("app-inventory")!
                        .shadowRoot!
                        .querySelector(`main >
                        section.a_p_p_InventoryPod2 >
                        div:nth-child(${i+4}) > div > div:nth-child(${row}) > button`)

                    })
                    eventDispatcher({
                        element:buttonArray[3] as HTMLButtonElement,
                        event:"click"
                    })
                }
            )
        )
        .subscribe()

        //
    }

    ngOnDestroy(): void {
        this.subs
        .forEach((x:any,i)=>{
            x?.unsubscribe();
        })
    }
}

