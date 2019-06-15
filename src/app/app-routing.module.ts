import {ExtraOptions, RouterModule, Routes} from '@angular/router'
import {NgModule} from '@angular/core'
import {IndexComponent} from './page/index/index.component'
import {NotFoundComponent} from './page/not-found/not-found.component'
import {StaticPageComponent} from './page/static-page/static-page.component'
import {WalletComponent} from './page/wallet/wallet.component'
import {GoogleDirectLinkComponent} from './page/google-direct-link/google-direct-link.component'
import {QrCodeComponent} from './page/qr-code/qr-code.component'

const routes: Routes = [
    {
        path: 'wallet',
        component: WalletComponent,
    },
    {
        path: 'google-direct-link',
        component: GoogleDirectLinkComponent,
    },
    {
        path: 'static/:name',
        component: StaticPageComponent,
    },
    {
        path: 'qr-code',
        component: QrCodeComponent,
    },
    {
        path: '',
        component: IndexComponent,
    },

    {path: '**', component: NotFoundComponent},
]

const config: ExtraOptions = {
    useHash: true,
}

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
