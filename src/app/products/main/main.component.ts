import { Component, OnInit,ChangeDetectionStrategy,ChangeDetectorRef,HostBinding, HostListener,ViewContainerRef } from '@angular/core';
import {fromEvent,iif,Subscription,of} from 'rxjs';
import { RyberService } from 'src/app/ryber.service';
import { classPrefix, Products } from 'src/app/customExports';
import { environment as env } from 'src/environments/environment';
import { pluck, take, tap } from 'rxjs/operators';


@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class MainComponent implements OnInit {

    // metadata
    meta = {
        name:"Products"
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
    model:Products = {
        title:{
            text:"products.title"
        },
        table:{
            searchBy:{
                placeholder:{
                    text:""
                },
                options:{
                    items:Array(4).fill(null)
                    .map((x:any,i)=>{
                        return {
                            text:"",
                            style:{},
                            stateText:["title","price","quantity","desc"][i]
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
                    url:`${env.backend.url}/product/create`,
                    method:"PUT",
                    request:{
                        text:"",
                        clickAux:()=>{
                            let {table} = this.model

                            let myResult = {
                                user:{
                                    username:""
                                },
                                total:{
                                    value:""
                                },
                                "cart Item 1":{
                                    name:"",
                                    price:"",
                                    quantity:""
                                }
                            }

                            table.util.toInputInPlace!({myResult})

                            return myResult
                        },
                    },
                    confirm:{
                        text:"",
                        clickAux:()=>{
                            let {table,fn0} = this.model
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
                    url:`${env.backend.url}/product/adminUpdate`,
                    method:"PATCH",
                    clickAux:()=>{
                        let {table,fn0} = this.model
                        // @ts-ignore
                        let {target,meta} = table.details.values

                        let resource ={
                            body:{
                                data:{
                                    orderId:meta.orderId.value,
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
                    url:`${env.backend.url}/product/adminDelete`,
                    method:"DELETE",
                    clickAux:()=>{
                        // @ts-ignore
                        let {target,meta} = this.model.table.details.values

                        return {
                            body:{
                                data:{
                                    orderId: meta.orderId.value
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
                            confirm:[true,false,true,true,true,false][i]
                        },
                        view:{
                            subProp:["title","img_url","price","quantity","desc","modify"][i],
                            text:"",
                            type:["text","text","text","text","text","modify"][i]
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

                    let {model,ryber} = this
                    let current = parseInt( model.table.pages.current.input.value) -1
                    let myWindow = parseInt(model.table.pages.per.input.value)


                    iif(
                        () => !model.table.pages.list!.retrieved.has(current),
                        ryber.http.post(`${env.backend.url}/product/list`,
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
                            model.table.db.xhrItems!.next({data:result})
                        })
                    )
                    .subscribe()
                },
                metaForEntry:(devObj)=>{
                    let {entry} = devObj;
                    let result = {};
                    ["title","img_url","price","quantity","desc"]
                    .map((x:any,i)=>{
                        result[x] ={
                            value: entry[x].toString()
                        }
                    })
                    return result
                },
                customInteractMods:(devObj)=>{
                    let {model}= this
                    let {key,item} = devObj
                    return false
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
        let {ryber,model,ref,subs} = this;
        let my_subs = [
            ryber.translate.get("products.search.button")
            .pipe(tap((result:string)=>{
                model.table.search!.button.text = result;
            })),
            ryber.translate.get("products.search.label")
            .pipe(tap((result:string)=>{
                model.table.search!.label.text = result;
            })),
            ryber.translate.get("products.searchBy.placeholder")
            .pipe(tap((result:string)=>{
                model.table.searchBy!.placeholder.text = result;
            })),
            ryber.translate.get("products.searchBy.options")
            .pipe(tap((result:string[])=>{

                model.table.searchBy!.options.items
                .forEach((x:any,i)=>{
                    x.text = result[i]
                })

            })),
            ryber.translate.get("products.reset")
            .pipe(tap((result:string)=>{

                model.table.search.reset.text = result;
            })),
            ryber.translate.get("products.create")
            .pipe(tap((result:string)=>{
                model.table.details.create.request.text = result;
                model.table.details.create.confirm.text = result
            })),
            ryber.translate.get("products.delete")
            .pipe(tap((result:string)=>{
                model.table.details.delete.text = result;
            })),
            ryber.translate.get("products.update")
            .pipe(tap((result:string)=>{
                model.table.details.update.text = result;
            })),
            ryber.translate.get("products.pages.per.label")
            .pipe(tap((result:string)=>{
                model.table.pages.per.label.text = result;
            })),
            ryber.translate.get("products.headers")
            .pipe(tap((result:any[])=>{

                model.table.headers.items
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
