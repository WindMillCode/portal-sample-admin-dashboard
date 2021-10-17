import { Component, OnInit,ChangeDetectionStrategy,ChangeDetectorRef,HostBinding, HostListener,ViewContainerRef } from '@angular/core';
import {fromEvent,iif,Subscription,of, concat, zip, forkJoin} from 'rxjs';
import { RyberService } from 'src/app/ryber.service';
import { classPrefix, Orders } from 'src/app/customExports';
import { environment as env } from 'src/environments/environment';
import { merge } from 'rxjs';
import { catchError, combineAll, tap,pluck,take } from 'rxjs/operators';
import { InventoryTableDetailsUpdateClickAuxReturn } from 'src/app/shared/inventory/inventory.model';

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
    subs: Subscription = new Subscription();
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
                    items:Array(3).fill(null)
                    .map((x:any,i)=>{
                        return {
                            text:"",
                            style:{},
                            stateText:["user","total","orderId"][i]
                        }
                    })
                },
                icon:{}
            },
            search:{
                label:{
                    text:""
                },
                button:{
                    text:""
                }
            },
            reset:{
                text:""
            },
            create:{
                text:""
            },
            details:{
                update:{
                    loading:this.ryber.loading,
                    url:`${env.backend.url}/order/adminUpdate`,
                    method:"PATCH",
                    clickAux:()=>{
                        let {table} = this.orders
                        let {target,meta} = table.details.values
                        console.log(table.details.values)

                        let resource ={
                            body:{
                                data:{
                                    orderId:meta.orderId.value,
                                    update_body:{
                                        user:table.details.update.pullValues({
                                            target:target.user
                                        }).username,
                                        total:table.details.update.pullValues({
                                            target:target.total
                                        }).value,
                                        billing:{
                                            items:table.details.update.pullValues({
                                                target:target.billing
                                            })
                                        },
                                        shipping:{
                                            info:{
                                                items:table.details.update.pullValues({
                                                    target:target.shipping
                                                })
                                            }
                                        },
                                        cart:Object.entries(target)
                                        .filter((x:[string,any],i)=>{
                                            let [keyx,valx]= x
                                            return keyx.startsWith("cart Item")
                                        })
                                        .map((x:[string,any],i)=>{
                                            let [keyx,valx]= x
                                            return table.details.update.pullValues({
                                                target:valx
                                            })
                                        })
                                    }
                                }
                            }
                        }
                        return resource
                    },
                },
                delete:{
                    url:`${env.backend.url}/order/adminDelete`,
                    method:"DELETE"
                }
            },
            pages:{
                per:{
                    input:{
                            value:20
                        },
                    label:{
                        text:""
                    }
                },
                current:{
                    input:{
                        value:1
                    }
                }
            },
            headers:{
                items:Array(7).fill(null)
                .map((x:any,i)=>{
                    return {
                        title:{
                            text:""
                        },
                        sort:{
                            confirm:[true,true,true,false,false,false][i]
                        },
                        view:{
                            subProp:["user","total","orderId","cart","billing","shipping","modify"][i],
                            text:"",
                            type:["text","text","text","view","view","view","modify"][i]
                        }
                    }
                })
            },
            db:{
                items:[],
                displayItems:[],
            },
            util:{
                listItems:()=>{

                    let {orders,ryber} = this
                    let current = parseInt( orders.table.pages.current.input.value) -1
                    let myWindow = parseInt(orders.table.pages.per.input.value)


                    iif(
                        () => !orders.table.pages.list.retrieved.has(current),
                        ryber.http.post(`${env.backend.url}/order/list`,
                            {
                                data:{
                                    pages:{
                                        page:current,
                                        per_page:myWindow
                                    }
                                }
                            }
                        ),
                        of({})
                    )
                    .pipe(
                        take(1),
                        pluck("message","list"),
                        tap((result:any)=>{
                            orders.table.db.xhrItems.next({data:result})
                        })
                    )
                    .subscribe()
                },
                metaForEntry:(devObj)=>{
                    let {entry} = devObj;
                    let result = {};
                    ["user","total","orderId"]
                    .map((x:any,i)=>{
                        result[x] ={
                            value: entry[x].toString()
                        }
                    })
                    return result
                },
                customInteractMods:(devObj)=>{
                    let {orders}= this
                    let {key,item} = devObj

                    switch (key) {
                        case "cart":
                            let result = {}
                            item
                            .forEach((x:any,i)=>{
                                result[i+1] =x
                            })
                            return result
                            break;
                        case "shipping":
                            return {
                                info:item.info.items,
                                sameAsBilling:item.sameAsBilling
                            }
                            break;
                        case "modify":
                            let myResult = {
                                user:{
                                    username:item.user
                                },
                                billing:item.billing.items,
                                shipping:{
                                    ...item.shipping.info.items,
                                    sameAsBilling:item.shipping.sameAsBilling.checked // cant use this either true or false
                                },
                                total:{
                                    value:item.total
                                },

                            }
                            item.cart
                            .forEach((x:any,i)=>{
                                myResult["cart Item " +(i+1)] =x
                            })
                            Object.entries(myResult)
                            .forEach((x:any,i)=>{
                                let [keyx,valx]= x
                                myResult[keyx] = Object.fromEntries(
                                    Object.entries(valx)
                                    .map((y:any,j)=>{
                                        let [keyy,valy] = y
                                        return [
                                            keyy,
                                            {
                                                input:{
                                                    value:valy
                                                }
                                            }
                                        ]
                                    })
                                )
                            })
                            return myResult
                            break;
                        default:
                            return false
                            break
                    }

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
                orders.table.search!.button.text = result;
            })),
            ryber.translate.get("orders.search.label")
            .pipe(tap((result:string)=>{
                orders.table.search!.label.text = result;
            })),
            ryber.translate.get("orders.searchBy.placeholder")
            .pipe(tap((result:string)=>{
                orders.table.searchBy!.placeholder.text = result;
            })),
            ryber.translate.get("orders.searchBy.options")
            .pipe(tap((result:string[])=>{

                orders.table.searchBy!.options.items
                .forEach((x:any,i)=>{
                    x.text = result[i]
                })

            })),
            ryber.translate.get("orders.reset")
            .pipe(tap((result:string)=>{

                orders.table.reset.text = result;
            })),
            ryber.translate.get("orders.create")
            .pipe(tap((result:string)=>{
                orders.table.create.text = result;
            })),
            ryber.translate.get("orders.pages.per.label")
            .pipe(tap((result:string)=>{
                orders.table.pages.per.label.text = result;
            })),
            ryber.translate.get("orders.headers")
            .pipe(tap((result:any[])=>{

                orders.table.headers.items
                .forEach((x:any,i)=>{
                    x.title.text = result[i].title
                    x.view.text = result[i].view
                })

            })),
        ]
        .map((x:any,i)=>{
            subs.add(x.subscribe())
        })




    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

}
