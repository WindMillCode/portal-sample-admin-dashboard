import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment as env } from 'src/environments/environment';
import {SharedModule} from './shared/shared.module';
import {HttpClientModule,HttpClient} from '@angular/common/http';
// ngx-translate
import {TranslateLoader, TranslateModule,TranslatePipe} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}
//

// dev addtions
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//

if (env.production) {

    Object.entries(console)
    .forEach((x, i) => {
        let [key, val] = x
        if (typeof val === "function") {
            (console[key] as any) = () => { }
        }
    })
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,

        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            },
            isolate : false
        }),
        SharedModule.forRoot(),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
