import { EventEmitter,Component, OnInit,ChangeDetectionStrategy,Input,ChangeDetectorRef,HostBinding, HostListener,ViewContainerRef, Output } from '@angular/core';
import {fromEvent,iif,Subscription,of,Subject} from 'rxjs';
import { RyberService } from 'src/app/ryber.service';
import { classPrefix } from 'src/app/customExports';
import { environment as env } from 'src/environments/environment';
import { catchError,tap } from 'rxjs/operators';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
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
        pods:Array(3).fill(null)
        .map((x:any,i)=>{
            return classPrefix({view:`${this.meta.name}Pod`+i})
        })
    }
    subs: Subscription[] = [];
    //

    // parent values
    @Input() table:any

    //



    constructor(
        private ref: ChangeDetectorRef,
        private vcf:ViewContainerRef,
        public ryber: RyberService
    ) { }

    ngOnInit(): void {
        let {table,ref,subs}= this;

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


        //  setup click functionality
        table.searchBy.options.items
        .forEach((x:any,i)=>{
            x.click = ()=>{
                table.searchBy.placeholder.text = x.text;
                table.searchBy.icon.click();
                table.searchBy.options.items
                .forEach((y:any,j)=>{
                    y.style.display = "none";
                })
            }
        })
        //

        // setup the details modal
        table.details = {}
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
                    // proivde for metadata
                    table.db.items
                    .slice(
                        (current)*myWindow,
                        (current + 1) *myWindow
                    )
                    .forEach((x:any,i)=>{
                        // user should have a role in deining this
                        x.meta = {

                            user:{
                                value:x.user
                            },
                            interact : {
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
                        }
                        table.db.displayItems.push(x)
                    })

                    // sort for prettiness

                    //
                    console.log(table.headers.items)
                    console.log(table.db.items[3])
                    ref.detectChanges()
                })
            ]
        }

        let sub0 = table.db.xhrItems
        .pipe(
            ...table.pages.list.pipeFns
        )
        .subscribe()
        subs.push(sub0)
        //

    }



    ngOnDestroy(): void {
        this.subs
        .forEach((x:any,i)=>{
            x?.unsubscribe();
        })
    }

}

export type InventoryTable ={
    [k:string]:any,
    searchBy:{
        placeholder:{
            text:string
        },
        options:{
            items:Array<{
                text:string
            }>
        },
        icon:{}
    },
    search:{
        label:{
            text:string
        },
        button:{
            text:string
        },
    }
}
