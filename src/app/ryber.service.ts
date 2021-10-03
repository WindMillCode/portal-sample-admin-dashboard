import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { delay,tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class RyberService {

    constructor(
        public router: Router,
        public http: HttpClient,
        public translate:TranslateService
    ) {
        translate.setDefaultLang("en")
    }

    loading:any = {
        view:{
            style:{

            }
        }
    }

    meta:any={
        keyvaluePipe:{
            unsorted:()=>{}
        }
    }



}
