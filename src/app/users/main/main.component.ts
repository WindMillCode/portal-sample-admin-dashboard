import { Component, OnInit,ChangeDetectionStrategy,ChangeDetectorRef,HostBinding, HostListener,ViewContainerRef } from '@angular/core';
import {fromEvent,iif,Subscription,of, pipe} from 'rxjs';
import { RyberService } from 'src/app/ryber.service';
import { classPrefix, Users } from 'src/app/customExports';
import { environment as env } from 'src/environments/environment';
import {catchError, tap,delay,concatMap,take,pluck} from 'rxjs/operators'
import { usersList } from 'src/app/usersList';
import { HttpErrorResponse } from '@angular/common/http';

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
        pods:Array(4).fill(null)
        .map((x:any,i)=>{
            return classPrefix({view:`${this.meta.name}Pod`+i})
        })
    }
    subs: Subscription = new Subscription();
    //



    target:Users ={
        fn0:(devObj)=>{
            let {table,target} = devObj
            return {
                user:table.util.pullValues({
                    target:target.user
                }).username,
                pass:table.util.pullValues({
                    target:target.pass
                }).password,
                billing:{
                    items:table.util.pullValues({
                        target:target.billing
                    })
                },
                shipping:{
                    info:{
                        items:table.util.pullValues({
                            target:target.shipping
                        })
                    }
                },
            }
        },
        table:{

            searchBy:{
                placeholder:{
                    text:""
                },
                options:{
                    items:Array(2).fill(null)
                    .map((x:any,i)=>{
                        return {
                            text:"",
                            style:{},
                            stateText:["user","latestOrderId"][i]
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
                },
                reset:{
                    text:""
                },
            },
            details:{
                create:{

                    loading:this.ryber.loading,
                    url:`${env.backend.url}/users/create`,
                    method:"PUT",
                    request:{
                        text:"",
                        clickAux:()=>{
                            let {table} = this.target
                            let billing = Object.fromEntries(
                                ["First Name","Last Name","Email","Phone","Address","City","State","Zip Code","Country"]
                                .map((x:any,i)=>{
                                    return [
                                        x.toLowerCase().split(" ").join("_"),
                                        ""
                                    ]
                                })
                            )
                            let shipping =Object.fromEntries(
                                ["First Name","Last Name","Email","Phone","Address","City","State","Zip Code","Country"]
                                .map((x:any,i)=>{
                                    return [
                                        x.toLowerCase().split(" ").join("_"),
                                        ""
                                    ]
                                })
                            )
                            let myResult = {
                                user:{
                                    username:""
                                },
                                pass:{
                                    password:""
                                },
                                billing,
                                shipping,
                            }

                            table.util.toInputInPlace!({myResult})

                            return myResult
                        },
                    },
                    confirm:{
                        text:"",
                        clickAux:()=>{
                            let {table,fn0} = this.target
                            // @ts-ignore
                            let {target} = table.details.values
                            let data =  fn0({table,target})
                            data.shipping.sameAsBilling = {
                                checked:false
                            }
                            let resource = {
                                body:{
                                    data
                                }
                            }
                            return resource
                        }
                    },
                },
                update:{
                    text:"",
                    loading:this.ryber.loading,
                    url:`${env.backend.url}/users/adminUpdate`,
                    method:"PATCH",
                    clickAux:()=>{
                        let {table,fn0} = this.target
                        // @ts-ignore
                        let {target,meta} = table.details.values

                        let resource ={
                            body:{
                                data:{
                                    user:meta.user.value,
                                    update_body:fn0({table,target})
                                }
                            }
                        }
                        return resource
                    },
                },
                delete:{
                    text:"",
                    loading:this.ryber.loading,
                    url:`${env.backend.url}/users/adminDelete`,
                    method:"DELETE",
                    clickAux:()=>{
                        // @ts-ignore
                        let {target,meta} = this.target.table.details.values
                        return {
                            body:{
                                data:{
                                    user: meta.user.value
                                }
                            }
                        }
                    }
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
                items:Array(6).fill(null)
                .map((x:any,i)=>{
                    return {
                        title:{
                            text:""
                        },
                        sort:{
                            confirm:[true,true,false,false,false,false][i]
                        },
                        view:{
                            subProp:["user","latestOrderId","orderId","shipping","billing","modify"][i],
                            text:"",
                            type:["text","text","view","view","view","modify"][i]
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

                    let {target,ryber} = this
                    let current = parseInt( target.table.pages.current.input.value) -1
                    let myWindow = parseInt(target.table.pages.per.input.value)


                    iif(
                        () => !target.table.pages.list!.retrieved.has(current),
                        ryber.http.post(`${env.backend.url}/users/list`,
                            {
                                data:{
                                    filter:['myPass','shipping_same_as_billing','cartId'],
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
                            result = result
                            ?.map((x:any,i)=>{
                                x["latestOrderId"] = x["orderId"].slice(-1)[0]
                                return x
                            })
                            target.table.db.xhrItems!.next({data:result})
                        })
                    )
                    .subscribe()
                },
                metaForEntry:(devObj)=>{
                    let {entry} = devObj;
                    let result = {};
                    ["user","latestOrderId"]
                    .map((x:any,i)=>{
                        result[x] ={
                            value: entry[x]?.toString() || ""
                        }
                    })
                    return result
                },
                customInteractMods:(devObj)=>{
                    let {target}= this
                    let {key,item} = devObj
                    console.log(key,item)
                    switch (key) {
                        case "orderId":
                            return {
                                "orderId's":Object.entries(item)
                            }
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
                                pass:{
                                    passowrd:item.pass
                                },
                                billing:item.billing.items,
                                shipping:{
                                    ...item.shipping.info.items,
                                    // sameAsBilling:item.shipping.sameAsBilling.checked // cant use this either true or false
                                },
                            }

                            target.table.util.toInputInPlace!({myResult})

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
        let {ryber,ref,target,subs}= this
        let my_subs = [
            ryber.translate.get("users.search.button")
            .pipe(tap((result:string)=>{
                target.table.search!.button.text = result;
            })),
            ryber.translate.get("users.search.label")
            .pipe(tap((result:string)=>{
                target.table.search!.label.text = result;
            })),
            ryber.translate.get("users.searchBy.placeholder")
            .pipe(tap((result:string)=>{
                target.table.searchBy!.placeholder.text = result;
            })),
            ryber.translate.get("users.searchBy.options")
            .pipe(tap((result:string[])=>{

                target.table.searchBy!.options.items
                .forEach((x:any,i)=>{
                    x.text = result[i]
                })

            })),
            ryber.translate.get("users.reset")
            .pipe(tap((result:string)=>{

                target.table.search.reset.text = result;
            })),
            ryber.translate.get("users.create")
            .pipe(tap((result:string)=>{
                target.table.details.create.request.text = result;
                target.table.details.create.confirm.text = result
            })),
            ryber.translate.get("users.delete")
            .pipe(tap((result:string)=>{
                target.table.details.delete.text = result;
            })),
            ryber.translate.get("users.update")
            .pipe(tap((result:string)=>{
                target.table.details.update.text = result;
            })),
            ryber.translate.get("users.pages.per.label")
            .pipe(tap((result:string)=>{
                target.table.pages.per.label.text = result;
            })),
            ryber.translate.get("users.headers")
            .pipe(tap((result:any[])=>{

                target.table.headers.items
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
