import { Component, OnInit, ChangeDetectionStrategy,Input,ChangeDetectorRef,ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-penrose',
    templateUrl: './penrose.component.html',
    styleUrls: ['./penrose.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PenroseComponent implements OnInit {

    @Input() displaySub:Subject<any>;
    constructor(
        private ref: ChangeDetectorRef,
        private vcf:ViewContainerRef,
    ) { }

    ngOnInit(): void {

        let {displaySub,penrose} = this;

        // toggle loading display
        displaySub
        ?.pipe(tap(()=>{
            penrose.style.display = penrose.style.display === 'none' ? 'block' : 'none';
        }))
        .subscribe()
        //
    }

    penrose:any = {
        style:{}
    }
}
