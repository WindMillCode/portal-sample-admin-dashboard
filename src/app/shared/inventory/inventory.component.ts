import { ViewEncapsulation,EventEmitter,Component,QueryList, OnInit,ChangeDetectionStrategy,Input,ChangeDetectorRef,HostBinding, HostListener,ViewContainerRef, Output, ViewChild, TemplateRef, ViewChildren } from '@angular/core';
import {fromEvent,iif,Subscription,of,Subject} from 'rxjs';
import { RyberService } from 'src/app/ryber.service';
import { classPrefix } from 'src/app/customExports';
import { environment as env } from 'src/environments/environment';
import { catchError,tap,take } from 'rxjs/operators';
import { InventoryTable } from './inventory.model';

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
        private vcf:ViewContainerRef,
        public ryber: RyberService
    ) { }

    ngOnInit(): void {
        let {table,ref,subs,entryPropertyView,textEntry,viewEntry,modifyEntry}= this;

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
            }
        }

        // setup the details modal
        table.details = {
            view:{
                style:{}
            },
            values:{
                meta:{},
                target:{},
                state:"view" // ["view","edit"]
            },
            close:{
                click:()=>{
                    table.details.view.style.display = "none"
                    ref.detectChanges()
                },
            }
        }
        //

        // setup for the pagination
        table.pages.current.input.disabled = true;
        table.pages.current.input.onAdd =  ()=>{

            table.util.listItems()

        }
        table.pages.current.input.onMinus = ()=>{
            table.util.listItems()
        }
        table.pages.current.lastPageSet = false
        table.pages.current.setLastPage = (devObj)=>{
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
                                    table.details.values.target = Array.isArray(x[key]) ? Object.fromEntries([[key,x[key]]]) : x[key] ?? {}


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



        let sub0 = table.db.xhrItems
        .pipe(
            ...table.pages.list.pipeFns
        )
        .subscribe()
        subs.add(sub0)
        //

        // initalize the table
        table.util.listItems()
        //

    }


    ngOnDestroy(): void {
        this.subs.unsubscribe()
    }

}


