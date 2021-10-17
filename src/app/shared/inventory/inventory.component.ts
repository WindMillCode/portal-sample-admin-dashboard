import { ViewEncapsulation,EventEmitter,Component,QueryList, OnInit,ChangeDetectionStrategy,Input,ChangeDetectorRef,HostBinding, HostListener,ViewContainerRef, Output, ViewChild, TemplateRef, ViewChildren } from '@angular/core';
import {fromEvent,iif,Subscription,of,Subject, pipe} from 'rxjs';
import { RyberService } from 'src/app/ryber.service';
import { classPrefix } from 'src/app/customExports';
import { environment as env } from 'src/environments/environment';
import { catchError,tap,take, concatMap,delay } from 'rxjs/operators';
import {
    InventoryTable, InventoryTableDevObj,
} from './inventory.model';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation:ViewEncapsulation.ShadowDom
})
export class InventoryComponent implements OnInit {



    // metadata
    meta = {
        name:"Inventory"
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
    subs: Subscription =  new Subscription;
    @ViewChildren('entryPropertyView',{read:ViewContainerRef}) entryPropertyView:QueryList<ViewContainerRef>
    //

    // parent values
    @Input() table:InventoryTable 
    @Input() textEntry:TemplateRef<any>;
    @Input() viewEntry:TemplateRef<any>;
    @Input() modifyEntry:TemplateRef<any>;
    //



    constructor(
        private ref: ChangeDetectorRef,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        let {table,ref,subs,http}= this;

        // setup icon to open the dropdown
        table.searchBy.icon.click = ()=>{
            table.searchBy.options.items
            .forEach((x:any,i)=>{
                if(x.style.display === "block"){
                    x.style.display = "none";
                }
                else{
                    x.style.display = "block";
                }
            })
            ref.detectChanges()
        }
        //

        //  setup click functionality in dropdown
        table.searchBy.options.items
        .forEach((x:any,i)=>{
            x.click = ()=>{
                table.searchBy.placeholder.text = x.text;
                table.searchBy.icon.click();
                table.searchBy.options.items
                .forEach((y:any,j)=>{
                    y.style.display = "none";
                })
                table.search.query.state = x.stateText
            }
        })
        //

        // initalize the dropdown
        table.searchBy.placeholder.text =  table.searchBy.options.items[0].text
        //

        // setup search functionality
        table.search.query = {
            input:{
                value:"",
            },
            state:table.searchBy.options.items[0].stateText
        }
        table.search.button.click =()=>{
            table.db.displayItems = table.db.items
            .filter((x:any,i)=>{
                return x.meta[table.search.query.state]
                .value
                .toLowerCase()
                .startsWith(table.search.query.input.value.toLowerCase())
            })
            ref.detectChanges()
        }
        //

        // setup reset functionality
        table.search.reset = {
            click:()=>{
                of({})
                .pipe(
                    take(1),
                    ...table.pages.list.pipeFns,
                )
                .subscribe()
            },
            ...table.search.reset as any
        }

        // setup the details modal
        table.details = {
            view:{
                style:{}
            },
            values:{
                meta:{},
                target:{},
                state:"view"
            },
            close:{
                click:()=>{
                    table.details.view.style.display = "none"
                    ref.detectChanges()
                },
            },
            update:{

                click:()=>{
                    let updateChoice = confirm("Are you sure you want to update this item from the resource?");
                    if(updateChoice){
                        let resource = table.details.update.clickAux()

                        // now make xhr
                        of({})
                        .pipe(
                            ...table.util.modifyResorucePipeFns({
                                resource,
                                action:"update"
                            })
                        )
                        .subscribe()
                        //
                    }
                },
                ...table.details.update as any,
            },
            delete:{
                click:()=>{
                    let deleteChoice = confirm("Are you sure you want to delete this item from the resource");
                    if(deleteChoice){
                        let resource = table.details.delete.clickAux()

                        // xhr to delete entry from resource
                        of({})
                        .pipe(
                            ...table.util.modifyResorucePipeFns({
                                resource,
                                action:"delete"
                            })
                        )
                        .subscribe()
                        //
                    }
                },
                ...table.details.delete as any,
            },
            create:{
                ...table.details.create,
                request:{
                    text:"Create",
                    click:()=>{
                        table.details.view.style.display = "flex"
                        table.details.values.state = "create"
                        table.details.values.target = table.details.create.request.clickAux()
                        ref.detectChanges()
                    },
                    ...table.details.create.request as any,
                },
                confirm:{
                    text:"Create",
                    click:()=>{
                        let confirmChoice = confirm("Are you sure you want to create this item on the resource")
                        if(confirmChoice){
                            let resource = table.details.create.confirm.clickAux()
                            of({})
                            .pipe(
                                ...table.util.modifyResorucePipeFns({
                                    resource,
                                    action:"create"
                                })
                            )
                            .subscribe()
                        }
                    },
                    ...table.details.create.confirm as any,
                },

            }
        }
        //

        // setup for the pagination
        table.pages.current = {
            input:{

                disabled:true,
                onAdd: ()=>{
                    table.util.listItems()
                },
                onMinus:()=>{
                    table.util.listItems()
                },
                ...table.pages.current.input as any,

            },
            lastPageSet:false,
            setLastPage:(devObj)=>{
                if(!table.pages.current.lastPageSet){
                    table.pages.current.lastPageSet = true
                    let {max,lastResultSize} = devObj
                    if(lastResultSize === 0){
                        table.pages.current.input.range.max = max
                    }
                    else{
                        table.pages.current.input.range.max = max +1
                    }
                }
            }
        }

        //

        // setup for the perPage
        table.pages.per.input.focusout=()=>{
            table.util.listItems()
        }
        //

        // setup up data modification to be entered into table
        table.db.xhrItems = new Subject<{data:any[]}>();
        table.pages.list ={
            retrieved:new Set(),
            pipeFns:[

                tap((res:any)=>{
                    let {table,ref} = this
                    let {data} = res
                    let current = parseInt( table.pages.current.input.value) -1
                    let myWindow = parseInt(table.pages.per.input.value)
                    let retrieved = table.pages.list.retrieved
                    if(!table.pages.list.retrieved.has(current)){
                        // update retrieved array
                        table.pages.list.retrieved.add(
                            current
                        )
                        //
                        table.db.items.push(...data)
                    }
                    table.db.displayItems = []

                    /**
                     if data
                        is not defined
                        is not equal to myWindow
                        if the next page length is 0
                        then we know we have come to end of page
                     */
                    if(![myWindow,undefined].includes(data?.length)){

                        table.pages.current.setLastPage({max:current,lastResultSize:data?.length})
                    }
                    //

                    // proivde for metadata
                    table.db.items
                    .slice(
                        (current)*myWindow,
                        (current + 1) *myWindow
                    )
                    .forEach((x:any,i)=>{
                        // user defined meta vlaues
                        x.meta = table.util.metaForEntry({entry:x}) ?? {}
                        //
                        x.meta.interact = {
                            click:(devObj:any)=>{
                                let {key,perm} = devObj
                                return (evt:MouseEvent)=>{
                                    table.details.view.style.display = "flex"
                                    let devCustom = table.util.customInteractMods({key,item:x[key] ??x})
                                    table.details.values.target = devCustom ? devCustom :
                                    Array.isArray(x[key]) ? Object.fromEntries([[key,x[key]]]) : x[key] ?? {}

                                    table.details.values.meta = x.meta
                                    table.details.values.state = perm ?? "view"
                                    ref.detectChanges()
                                }
                            }
                        }
                        table.db.displayItems.push(x)
                    })

                    // sort for prettiness

                    //
                    // console.log(table.headers.items)
                    // console.log(table.db.items[3])
                    ref.detectChanges()
                })
            ]
        }
        //

        // setup sort functaility in the headers
        table.headers.items
        .forEach((x:any,i)=>{
            let click = (devObj)=>{
                let {direction} = devObj
                return ()=>{
                    let key = x.view.subProp
                    let current = parseInt( table.pages.current.input.value) -1
                    let myWindow = parseInt(table.pages.per.input.value)

                    table.db.displayItems =table.db.items
                    .sort((a, b)=> {
                        if( direction === "up"){
                            return a[key] > b[key] ? 1 : -1 ;
                        }
                        else{
                            return a[key] < b[key] ? 1 : -1 ;
                        }
                    })
                    .slice(
                        (current)*myWindow,
                        (current+1)*myWindow
                    )
                    ref.detectChanges()
                }


            }
            x.sort = {

                up:{
                    click:click({direction:"up"}),
                },
                down:{
                    click:click({direction:"down"}),
                },
                ...x.sort
            }
        })
        //

        // additional util
        table.util ={
            pullValues:(devObj)=>{
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
            keyvaluePipe :{
                unsorted:()=>{}
            },
            mock:{
                general:{
                    fn:()=>{
                        alert("There was an error please try again later")
                    }
                },
                delete:{
                    confirm:true
                },
                update:{
                    confirm:true
                },
                create:{
                    confirm:true
                }
            },
            modifyResorucePipeFns:(devObj)=>{
                let{resource,action} = devObj
                return [
                    take(1),
                    tap(()=>{
                        table.details.view.style.display = "none"
                        table.details.update.loading.view.style.display = "flex"
                        ref.detectChanges()
                    }),
                    concatMap(()=>{

                        return iif(
                            () => table.util.mock[action].confirm,
                            http.request(
                                table.details[action].method,
                                table.details[action].url,
                                {
                                    body:resource.body
                                }
                            ),
                            of({}).pipe(delay(2000))
                        )
                    }),
                    tap(
                        ()=>{

                            // remove the modify panel
                            table.details.update.loading.view.style.display = "none"
                            ref.detectChanges()
                            //

                            // refresh page to see changes
                            alert("refresh page to see changes")
                            //
                        },
                        (err:HttpErrorResponse)=>{
                            table.details.update.loading.view.style.display = "none"
                            ref.detectChanges()
                            table.util.mock.general.fn()
                        }
                    )
                ]
            },
            toInputInPlace:(devObj)=>{
                // modifies myResult in place
                let {myResult} = devObj
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
            },
            ...table.util as any
        }
        //



        let sub0 = table.db.xhrItems
        .pipe(
            ...table.pages.list.pipeFns
        )
        .subscribe()
        subs.add(sub0)
        //

        // initalize the table
        table.util.listItems()
        console.log(table)
        //

    }


    ngOnDestroy(): void {
        this.subs.unsubscribe()
    }

}


