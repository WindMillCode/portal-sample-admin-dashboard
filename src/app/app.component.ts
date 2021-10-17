import { Component,ComponentFactoryResolver,ViewContainerRef } from '@angular/core';
import { RyberService } from './ryber.service';
import { environment as env } from 'src/environments/environment';
import {Route} from '@angular/router';
import { eventDispatcher,flatDeep,numberParse } from './customExports';
import { of,Subscription,fromEvent } from 'rxjs';
import { delay,tap,concatMap, pluck } from 'rxjs/operators';
import faker from 'faker';
import { KeyValuePipe } from '@angular/common';

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
        let {ryber}= this
        of({})
        .pipe(
            delay(1000),
            tap(()=>{
                let createButton=
                    document
                    .querySelector("app-inventory")!
                    .shadowRoot!
                    .querySelector(".a_p_p_InventoryPod0Button2")

                eventDispatcher({
                    element:createButton  as HTMLButtonElement ,
                    event:"click"
                })
            }),
            delay(1000),
            concatMap(()=>{

                return ryber.http.post(
                    `${env.backend.url}/product/list`,
                    {
                        data:{
                            filter:["desc","img_url","quantity"]
                        }
                    }
                )
                .pipe(
                    pluck("message","list")
                )
            }),
            tap((result:any)=>{
                // create a new resource


                let products = result
                let product= products[Math.floor(Math.random()*products.length)]
                product.quantity  =   Math.floor(Math.random() *10) +1
                product.total = parseFloat(product.price) * product.quantity
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
                    ...flatDeep(bSA.final),
                    product.total.toFixed(2),
                    product.title,
                    product.price.toFixed(2),
                    product.quantity
                ]

                let inputs = document
                .querySelector("app-inventory")!
                .shadowRoot!
                .querySelectorAll(".a_p_p_InventoryPod3Input0")
                .forEach((x:any,i)=>{
                    x.value = myValues[i];
                    eventDispatcher({
                        element:x,
                        event:"focusout"
                    })
                })
                //
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

