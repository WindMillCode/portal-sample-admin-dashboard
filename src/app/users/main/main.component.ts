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
                    return {}
                })
            },
            db:{
                items:[]
            }
        },
        query:{
            sortBy:{
                items:Array(2).fill(null)
                .map((x:any,i)=>{
                    
                })
            }
        }
    }

    constructor(
        private ref: ChangeDetectorRef,
        private vcf:ViewContainerRef,
        public ryber: RyberService
    ) { }

    ngOnInit(): void {
        let {ryber,ref}= this
        ryber.http.post(`${env.backend.url}/users/list`,{})
        .pipe(
            tap((res:any)=>{
                let {message} = res
                this.users.table.db.items = message.list
                console.log(this.users.table.db.items[3])
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
