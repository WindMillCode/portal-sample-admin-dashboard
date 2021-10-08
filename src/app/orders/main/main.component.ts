import { Component, OnInit,ChangeDetectionStrategy,ChangeDetectorRef,HostBinding, HostListener,ViewContainerRef } from '@angular/core';
import {fromEvent,iif,Subscription,of, concat, zip, forkJoin} from 'rxjs';
import { RyberService } from 'src/app/ryber.service';
import { classPrefix, Orders } from 'src/app/customExports';
import { environment as env } from 'src/environments/environment';
import { merge } from 'rxjs';
import { catchError, combineAll, tap } from 'rxjs/operators';
import { InventoryTable } from 'src/app/shared/inventory/inventory.component';
@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {

    // metadata
    meta = {
        name:"Orders"
    }
    @HostBinding('class') myClass: string = `a_p_p_${this.meta.name}View`;
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

    // table
    orders:Orders= {
        title:{
            text:"orders.title"
        },
        table:{

            searchBy:{
                placeholder:{
                    text:""
                },
                options:{
                    items:[]
                }
            },
            search:{
                label:{
                    text:""
                },
                button:{
                    text:""
                }
            }
        }
    }


    constructor(
        private ref: ChangeDetectorRef,
        private vcf:ViewContainerRef,
        public ryber: RyberService
    ) { }

    ngOnInit(): void {
        let {ryber,orders,ref,subs} = this;
        let my_subs = [
            ryber.translate.get("orders.search.button")
            .pipe(tap((result:string)=>{
                orders.table.search.button.text = result;
            })),
            ryber.translate.get("orders.search.label")
            .pipe(tap((result:string)=>{
                orders.table.search.label.text = result;
            })),
            ryber.translate.get("orders.searchBy.placeholder")
            .pipe(tap((result:string)=>{
                orders.table.searchBy.placeholder.text = result;
            })),
            ryber.translate.get("orders.searchBy.options")
            .pipe(tap((result:string[])=>{
                
                orders.table.searchBy.options.items =
                result
                .map((x:any,i)=>{
                    return {
                        text:x
                    }
                })

            })),
        ]
        .map((x:any,i)=>{
            x
            .subscribe()
            subs.push(x)
        })


    }

    ngOnDestroy(): void {
        this.subs
        .forEach((x:any,i)=>{
            x?.unsubscribe();
        })
    }

}
