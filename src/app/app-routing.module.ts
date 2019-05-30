import {ExtraOptions, RouterModule, Routes} from '@angular/router'
import {NgModule} from '@angular/core'
import {IndexComponent} from './page/index/index.component'
import {NotFoundComponent} from './page/not-found/not-found.component'
import {StaticPageComponent} from './page/static-page/static-page.component'
import {GeneratorComponent} from './page/generator/generator.component'

const routes: Routes = [
    {
        path: 'generator/:type',
        component: GeneratorComponent,
    },
    {
        path: 'static/:name',
        component: StaticPageComponent,
    },
    {
        path: '',
        component: IndexComponent,
    },

    {path: '**', component: NotFoundComponent},

    // {path: '**', component: NotFoundComponent},

    // {path: 'pages', loadChildren: 'app/pages/pages.module#PagesModule'},
    // {
    //     path: 'auth',
    //     component: NbAuthComponent,
    //     children: [
    //         {
    //             path: '',
    //             component: NbLoginComponent,
    //         },
    //         {
    //             path: 'login',
    //             component: NbLoginComponent,
    //         },
    //         {
    //             path: 'register',
    //             component: NbRegisterComponent,
    //         },
    //         {
    //             path: 'logout',
    //             component: NbLogoutComponent,
    //         },
    //         {
    //             path: 'request-password',
    //             component: NbRequestPasswordComponent,
    //         },
    //         {
    //             path: 'reset-password',
    //             component: NbResetPasswordComponent,
    //         },
    //     ],
    // },
    // {path: '', redirectTo: 'pages', pathMatch: 'full'},
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
