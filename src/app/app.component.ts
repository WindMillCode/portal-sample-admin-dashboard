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
            delay(2000),
            tap(()=>{
                eventDispatcher({
                    element:document.querySelector("button.a_p_p_UsersPod0Button3") as HTMLElement,
                    event:"click"
                })
            }),
            delay(100),
            tap(()=>{
                let sameAsBilling = [true,false][Math.random()*2|0];
                let bSA:any= { // billingShippingArithmetic
                    initial : [faker.name.firstName,
                    faker.name.lastName,
                    faker.internet.email,
                    faker.phone.phoneNumber,
                    faker.address.streetAddress,
                    faker.address.city,
                    faker.address.state,
                    faker.address.zipCode,
                    faker.address.country]
                    .map((y:any,j)=>{
                        let val= y()
                        return  sameAsBilling ? [val,val] :[val,y()]

                    }),
                }
                bSA.final = Array(2).fill(null)
                .map((x:any,i)=>{
                    return bSA.initial
                    .map((y:any,j)=>{
                        return y[i]
                    })
                })
                let myValues = [
                    faker.internet.userName(),
                    faker.internet.password(),
                    ...flatDeep(bSA.final)
                ]
                console.log(myValues)
                document.querySelectorAll(".a_p_p_UsersPod2Input0")
                .forEach((x:any,i)=>{
                    x.value = myValues[i];
                    eventDispatcher({
                        element:x,
                        event:"focusout"
                    })
                })


            })
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

