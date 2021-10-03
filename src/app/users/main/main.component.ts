import { Component, OnInit,ChangeDetectionStrategy,ChangeDetectorRef,HostBinding, HostListener,ViewContainerRef } from '@angular/core';
import {fromEvent,iif,Subscription,of, pipe} from 'rxjs';
import { RyberService } from 'src/app/ryber.service';
import { classPrefix, MyTable } from 'src/app/customExports';
import { environment as env } from 'src/environments/environment';
import {catchError, tap,delay,concatMap,take} from 'rxjs/operators'
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
                displayItems:[],
                updateDisplayItems:()=>{
                    let {users,ref} = this
                    users.table.db.displayItems =users.table.db.items.map(x => x)
                    ref.detectChanges()
                }
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
            },
            create:{
                request:{
                    click:()=>{
                        let {users,ref} = this
                        users.details.view.style.display = "flex"
                        users.details.values.state = "create"
                        let billing = Object.fromEntries(
                            ["First Name","Last Name","Email","Phone","Address","City","State","Zip Code","Country"]
                            .map((x:any,i)=>{
                                return [
                                    x.toLowerCase().split(" ").join("_"),
                                    {input:{value:""}}
                                ]
                            })
                        )
                        let shipping =Object.fromEntries(
                            ["First Name","Last Name","Email","Phone","Address","City","State","Zip Code","Country"]
                            .map((x:any,i)=>{
                                return [
                                    x.toLowerCase().split(" ").join("_"),
                                    {input:{value:""}}
                                ]
                            })
                        )
                        users.details.values.target = {
                            user:{username:{input:{value:""}}},
                            pass:{password:{input:{value:""}}},
                            billing,
                            shipping
                        }
                        ref.detectChanges()
                    },
                },
                confirm:{
                    click:()=>{

                        let confirmChoice = confirm("Are you sure you want to create this item on the resource")
                        if(confirmChoice){
                            let {users,ref,ryber} = this
                            console.log(users.details.values.target)
                            let targetItem:any = {
                                actual:users.details.values.target,
                                create:{
                                    user:users.details.update.viewUpdate({
                                        target:users.details.values.target.user
                                    }).username,
                                    pass:users.details.update.viewUpdate({
                                        target:users.details.values.target.pass
                                    }).password,
                                    billing:{
                                        items:users.details.update.viewUpdate({
                                            target:users.details.values.target.billing,
                                        })
                                    },
                                    shipping:{
                                        info:{
                                            items:users.details.update.viewUpdate({
                                                target:users.details.values.target.shipping
                                            })
                                        },
                                        sameAsBilling:{
                                            checked:false
                                        }
                                    },
                                }
                            }
                            console.log(targetItem.create)

                            // now make XHR
                            of({})
                            .pipe(
                                take(1),
                                tap(()=>{
                                    users.details.view.style.display = "none"
                                    ryber.loading.view.style.display = "flex"
                                    ref.detectChanges()
                                }),
                                concatMap(()=>{
                                    return iif(
                                        ()=> env?.mock?.adminCreateUser.confirm ?? true,
                                        ryber.http.request(
                                            users.query.create.method,
                                            users.query.create.url,
                                            {
                                                body:{
                                                    data:targetItem.create
                                                }
                                            }
                                        ),
                                        of({}).pipe(delay(2000))
                                    )
                                }),
                                tap(
                                    ()=>{

                                        // remove the modify panel
                                        ryber.loading.view.style.display = "none"
                                        ref.detectChanges()
                                        //

                                        // refresh page to see changes
                                        alert("refresh page to see changes")
                                        //
                                    },
                                    (err:HttpErrorResponse)=>{
                                        ryber.loading.view.style.display = "none"
                                        ref.detectChanges()
                                        env.mock.general.fn()
                                    }
                                )
                            )
                            .subscribe()
                            //
                        }
                    }
                },
                url:`${env.backend.url}/users/create`,
                method:"PUT"
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
                meta:{},
                target:{},
                state:"view" // ["view","edit"]
            },
            update:{
                url:`${env.backend.url}/users/adminUpdate`,
                method:"PATCH",
                viewUpdate:(devObj:any)=>{
                    let {target}= devObj
                    let result = Object.fromEntries(
                        Object.entries(target)
                        .map((x:any,i)=>{
                            let [keyx,valx] = x
                            return [keyx,valx.input.value]
                        })
                    )
                    return result
                },
                click:()=>{
                    let updateChoice = confirm("Are you sure you want to update this item from the resource?");
                    if(updateChoice){
                        let {users,ref,ryber} = this
                        let targetItem:any = {
                            username:users.details.values.meta.user,
                            index:-1,
                            actual:users.details.values.target
                        }
                        targetItem.target =users.table.db.items
                        .filter((x:any,i)=>{
                            return x.user === targetItem.username
                        })[0]

                        targetItem.update = {
                            billing:{
                                items:users.details.update.viewUpdate({
                                    target:targetItem.actual.billing
                                })
                            },
                            shipping:{
                                info:{
                                    items:users.details.update.viewUpdate({
                                        target:targetItem.actual.shipping
                                    })
                                }
                            },
                            user:users.details.update.viewUpdate({
                                target:targetItem.actual.user
                            }).username

                        }

                        //now make Xhr
                        of({})
                        .pipe(
                            take(1),
                            tap(()=>{
                                users.details.view.style.display = "none"
                                ryber.loading.view.style.display = "flex"
                                ref.detectChanges()
                            }),
                            concatMap(()=>{
                                return iif(
                                    ()=> env?.mock?.adminUpdateUser.confirm ?? true,
                                    ryber.http.request(
                                        users.details.update.method,
                                        users.details.update.url,
                                        {
                                            body:{
                                                data:{
                                                    user:targetItem.username,
                                                    update_body:targetItem.update
                                                }
                                            }
                                        }
                                    ),
                                    of({}).pipe(delay(2000))
                                )
                            }),
                            tap(
                                ()=>{

                                    // remove the modify panel
                                    ryber.loading.view.style.display = "none"
                                    ref.detectChanges()
                                    //

                                    // refresh page to see changes
                                    alert("refresh page to see changes")
                                    //
                                },
                                (err:HttpErrorResponse)=>{
                                    ryber.loading.view.style.display = "none"
                                    ref.detectChanges()
                                    env.mock.general.fn()
                                }
                            )
                        )
                        .subscribe()
                    }
                }
            },
            delete:{
                click:()=>{
                    let deleteChoice = confirm("Are you sure you want to delete this item from the resource");
                    if(deleteChoice){
                        let {users,ref,ryber} = this
                        let targetItem:any = {
                            username:users.details.values.target.user.username,
                            index:-1
                        }
                        targetItem.target =users.table.db.items
                        .filter((x:any,i)=>{
                            return x.user === targetItem.username
                        })[0]

                        targetItem.index =users.table.db.items.indexOf(targetItem.target)
                        users.table.db.items.splice(targetItem.index,1)

                        // xhr to delete user then update the table
                        of({})
                        .pipe(
                            take(1),
                            tap(()=>{
                                users.details.view.style.display = "none"
                                ryber.loading.view.style.display = "flex"
                                ref.detectChanges()
                            }),
                            concatMap(()=>{
                                return iif(
                                    ()=> env?.mock?.adminDeleteUser.confirm ?? true,
                                    ryber.http.request(
                                        users.details.delete.method,
                                        users.details.delete.url,
                                        {
                                            body:{
                                                data:{user:targetItem.username}
                                            }
                                        }
                                    ),
                                    of({}).pipe(delay(2000))
                                )
                            }),
                            tap(
                                ()=>{
                                    // update display items
                                    users.table.db.updateDisplayItems()
                                    //

                                    // remove the modify panel
                                    ryber.loading.view.style.display = "none"
                                    ref.detectChanges()
                                    //
                                },
                                (err:HttpErrorResponse)=>{
                                    ryber.loading.view.style.display = "none"
                                    ref.detectChanges()
                                    env.mock.general.fn()
                                }
                            )
                        )
                        .subscribe()

                    }
                },
                url:`${env.backend.url}/users/adminDelete`,
                method:"DELETE"
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
                    filter:['myPass','shipping_same_as_billing','cartId']
                }
            }
        )
        .pipe(
            catchError(()=>{
                if(env.production){
                    alert("this is a sample userList reload and try again")
                }
                return of({
                    message:{
                        list:usersList
                    }
                })
            }),
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
                                        case "modify":
                                            users.details.values.meta.user = x.user
                                            users.details.values.target = {
                                                user:{username:x.user},
                                                billing:x.billing.items,
                                                shipping:{
                                                    ...x.shipping.info.items,
                                                    sameAsBilling:x.shipping.sameAsBilling.checked // cant use this either true or false
                                                },
                                            }
                                            Object.entries(users.details.values.target)
                                            .forEach((x:any,i)=>{
                                                let [keyx,valx]= x
                                                Object.entries(valx)
                                                .forEach((y:any,j)=>{
                                                    let [keyy,valy] = y
                                                    users.details.values.target[keyx][keyy] = {
                                                        input:{
                                                            value:valy
                                                        }
                                                    }
                                                })
                                            })
                                            break

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
