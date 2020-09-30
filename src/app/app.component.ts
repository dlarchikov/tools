/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, OnInit} from '@angular/core'
import {NbMenuItem, NbThemeService} from '@nebular/theme'
import {CookieService} from 'ngx-cookie-service'

@Component({
    selector: 'ngx-app',
    template: `
        <ngx-one-column-layout>
            <nb-menu [items]="menu"></nb-menu>
            <router-outlet></router-outlet>
        </ngx-one-column-layout>`,
})
export class AppComponent implements OnInit {
    menu: NbMenuItem[] = [
        {
            title: 'Menu',
            group: true,
        },
        {
            title: 'Home',
            icon: 'home',
            link: '/',
        },
        {
            title: 'Wallet generate',
            icon: 'lock-outline',
            link: '/wallet',
        },
        {
            title: 'Google direct link',
            icon: 'shuffle',
            link: '/google-direct-link',
        },
        {
            title: 'QR-code generator',
            icon: 'square-outline',
            link: '/qr-code',
        },
        {
            title: 'Ethereum tx parser',
            icon: 'code-download-outline',
            link: '/ethereum-parser',
        },
        {
            title: 'Crypto send',
            icon: 'checkmark',
            link: '/crypto-send',
        },
    ]


    constructor(
        private cookieService: CookieService,
        private themeService: NbThemeService,
    ) {
    }

    ngOnInit(): void {
        const themeName: string = this.cookieService.get('nb-theme')

        if (themeName) {
            this.themeService.changeTheme(themeName)
        }

        this.themeService.onThemeChange()
            .subscribe((theme: any) => {
                this.cookieService.set('nb-theme', theme.name)
            })
    }
}
