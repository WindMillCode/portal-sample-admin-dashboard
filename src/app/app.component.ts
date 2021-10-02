import { Component,ViewContainerRef } from '@angular/core';
import { RyberService } from './ryber.service';
import { environment as env } from 'src/environments/environment';
import {Route} from '@angular/router';
import { eventDispatcher,numberParse } from './customExports';
import { of,Subscription,fromEvent } from 'rxjs';
import { delay,tap } from 'rxjs/operators';

declare global{
    var Prism:any
}
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
                    let orderId0Button:HTMLButtonElement | null = document.querySelector("body > app-root > app-main > main > section > section.a_p_p_UsersPod1 > div.a_p_p_UsersPod1ItemA2 > div > div:nth-child(2) > button")
                    orderId0Button = (orderId0Button as HTMLButtonElement)
                    let shipping0Button:HTMLButtonElement| null = document.querySelector("body > app-root > app-main > main > section > section.a_p_p_UsersPod1 > div.a_p_p_UsersPod1ItemA3 > div > div:nth-child(2) > button")
                    shipping0Button = (shipping0Button as HTMLButtonElement)
                    let billing0Button:HTMLButtonElement | null = document.querySelector("body > app-root > app-main > main > section > section.a_p_p_UsersPod1 > div.a_p_p_UsersPod1ItemA4 > div > div:nth-child(2) > button")
                    billing0Button = (billing0Button as HTMLButtonElement)
                    let modify0Button= document.querySelector("body > app-root > app-main > main > section > section.a_p_p_UsersPod1 > div.a_p_p_UsersPod1ItemA5 > div > div:nth-child(2) > button")
                    modify0Button = (modify0Button as HTMLButtonElement)
                    let buttonArray = [orderId0Button,shipping0Button,billing0Button,modify0Button]
                    eventDispatcher({
                        element:buttonArray[1],
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

