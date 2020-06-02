/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {APP_BASE_HREF} from '@angular/common'
import {BrowserModule} from '@angular/platform-browser'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {NgModule} from '@angular/core'
import {HttpClientModule} from '@angular/common/http'
import {CookieService} from 'ngx-cookie-service'

import {AppComponent} from './app.component'
import {AppRoutingModule} from './app-routing.module'
import {ThemeModule} from './@theme/theme.module'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import {IndexComponent} from './page/index/index.component'
import {NotFoundComponent} from './page/not-found/not-found.component'
import {StaticPageComponent} from './page/static-page/static-page.component'
import {ChartComponent} from './page/common/chart/chart.component'
import {ChartModule} from 'angular2-chartjs';
import { WalletComponent } from './page/wallet/wallet.component';
import { GoogleDirectLinkComponent } from './page/google-direct-link/google-direct-link.component';
import { QrCodeComponent } from './page/qr-code/qr-code.component'
import {NbCardModule} from '@nebular/theme'
import { EthereumParserComponent } from './page/ethereum-parser/ethereum-parser.component'
import { CryptoSendComponent } from './page/crypto-send/crypto-send.component'


@NgModule({
    declarations: [
        AppComponent,
        IndexComponent,
        NotFoundComponent,
        StaticPageComponent,
        ChartComponent,
        WalletComponent,
        GoogleDirectLinkComponent,
        QrCodeComponent,
        EthereumParserComponent,
        CryptoSendComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        NgbModule.forRoot(),
        ThemeModule.forRoot(),
        ChartModule,
        NbCardModule,
    ],
    bootstrap: [AppComponent],
    providers: [
        CookieService,
        {provide: APP_BASE_HREF, useValue: '/'},
    ],
})
export class AppModule {
}
