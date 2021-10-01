import { Component, OnInit,ChangeDetectionStrategy,ChangeDetectorRef,HostBinding, HostListener,ViewContainerRef } from '@angular/core';
import {fromEvent,iif,Subscription,of} from 'rxjs';
import { RyberService } from 'src/app/ryber.service';
import { classPrefix } from 'src/app/customExports';
import { environment as env } from 'src/environments/environment';
import {tap} from 'rxjs/operators'

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class MainComponent implements OnInit {

    // metadata
    meta = {
        name:"Users"
    }
    @HostBinding('class') myClass: string = `a_p_p_${this.meta.name}View`;
    prefix ={
        main:classPrefix( {view:`${this.meta.name}Main`}),
        view: classPrefix({view:`${this.meta.name}`}),
        pods:Array(2).fill(null)
        .map((x:any,i)=>{
            return classPrefix({view:`${this.meta.name}Pod`+i})
        })
    }
    subs: Subscription[] = [];
    //

    users:any = {
        table:{
            header:{
                items:Array(5).fill(null)
                .map((x:any,i)=>{
                    let item = {
                        sort:{
                            state:"ascend",  // ascend or descend
                            confirm:[true,true,false,false,false][i],
                            click:(evt:MouseEvent)=>{
                                let {users,ref} = this
                                let key = ["user","latestOrderId"][i]
                                users.table.db.displayItems =users.table.db.displayItems
                                .sort((a, b)=> {
                                    if(item.sort.state === "ascend"){
                                        return a[key] > b[key] ? 1 : -1 ;
                                    }
                                    else{
                                        return a[key] < b[key] ? 1 : -1 ;
                                    }
                                });
                                item.sort.state = item.sort.state === "ascend" ? "descend" : "ascend"
                                ref.detectChanges()
                            },

                        }
                    }
                    return item
                })
            },
            db:{
                items:[],
                displayItems:[]
            }
        },
        query:{
            searchBy:{
                items:Array(2).fill(null)
                .map((x:any,i)=>{

                })
            },
            input:{
                value:"",
            },
            search:{
                click:(evt:MouseEvent)=>{
                    let {users} = this
                    console.log(users.query.input.value)
                    console.log(users.table.db.items)
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
        let {ryber,ref,users}= this
        ryber.http.post(`${env.backend.url}/users/list`,
            {
                data:{
                    filter:['myPass']
                }
            }
        )
        .pipe(
            tap((res:any)=>{
                let {message} = res

                users.table.db.items = message.list
                // proivde for the latest orderId
                users.table.db.items.forEach((x:any,i)=>{
                    x.latestOrderId = x.orderId.length !== 0  ?  x.orderId[x.orderId.length-1]:null
                    users.table.db.displayItems.push(x)
                })
                //
                console.log(users.table.db.items[3])
                ref.detectChanges()
            })
        )
        .subscribe()
    }

    ngOnDestroy(): void {
        this.subs
        .forEach((x:any,i)=>{
            x?.unsubscribe();
        })
    }

}
