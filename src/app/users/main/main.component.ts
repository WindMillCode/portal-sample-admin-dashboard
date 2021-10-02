import { Component, OnInit,ChangeDetectionStrategy,ChangeDetectorRef,HostBinding, HostListener,ViewContainerRef } from '@angular/core';
import {fromEvent,iif,Subscription,of} from 'rxjs';
import { RyberService } from 'src/app/ryber.service';
import { classPrefix, MyTable } from 'src/app/customExports';
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
        pods:Array(3).fill(null)
        .map((x:any,i)=>{
            return classPrefix({view:`${this.meta.name}Pod`+i})
        })
    }
    subs: Subscription[] = [];
    //

    users:MyTable = {
        table:{
            header:{
                items:Array(6).fill(null)
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
            input:{
                value:"",
            },
            searchBy:{
                items:Array(2).fill(null)
                .map((x:any,i)=>{
                    let item =  {
                        style:{
                            background:["var(--radial-bg-viogreen)",""][i],
                        },
                        click:(evt:MouseEvent)=>{
                            let {users,ref} = this
                            users.query.searchBy.items.forEach((x:any,i)=>{
                                x.style.background = ""
                            })
                            item.style.background = "var(--radial-bg-viogreen)"
                            users.query.search.state = ["user","latestOrderId"][i]
                            ref.detectChanges()
                        }
                    }
                    return item
                })
            },
            reset:{
                click:(evt:MouseEvent)=>{
                    let{users,ref} = this
                    users.table.db.displayItems = []
                    users.table.db.items
                    .map((x:any,i)=>{
                        users.table.db.displayItems.push(x)
                    })
                    ref.detectChanges()
                }
            },
            search:{
                click:(evt:MouseEvent)=>{
                    let {users,ref} = this
                    users.table.db.displayItems = users.table.db.items
                    .filter((x:any,i)=>{
                        return x[users.query.search.state].toLowerCase().startsWith(users.query.input.value.toLowerCase())
                    })
                    ref.detectChanges()
                },
                state:"user"
            }
        },
        details:{
            view:{
                style:{}
            },
            close:{

                click:(evt:MouseEvent)=>{
                    let {users,ref} = this
                    users.details.view.style.display = "none"
                    ref.detectChanges()
                },
            },
            values:{
                target:{},
                state:"view" // ["view","edit"]
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
                    filter:['myPass','shipping_same_as_billing']
                }
            }
        )
        .pipe(
            tap((res:any)=>{
                let {message} = res

                users.table.db.items = message.list
                // proivde for the latest orderId
                users.table.db.items.forEach((x:any,i)=>{
                    x.meta = {
                        latestOrderId :{
                            value: x.orderId.length !== 0  ?  x.orderId[x.orderId.length-1]:""
                        },
                        interact : {
                            click:(devObj:any)=>{
                                let {key,perm} = devObj
                                return (evt:MouseEvent)=>{
                                    let {ryber,ref,users} = this
                                    users.details.view.style.display = "flex"

                                    users.details.values.target = Array.isArray(x[key]) ? Object.fromEntries([[key,x[key]]]) : x[key] ?? {}

                                    // custom mods to see the approiate data with component
                                    switch (key) {
                                        case "shipping":
                                            users.details.values.target = {
                                                info:users.details.values.target.info.items,
                                                sameAsBilling:users.details.values.target.sameAsBilling
                                            }
                                            break;

                                        default:
                                            break;
                                    }
                                    //
                                    users.details.values.state = perm ?? "view"

                                    ref.detectChanges()
                                }
                            }
                        }
                    }
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
