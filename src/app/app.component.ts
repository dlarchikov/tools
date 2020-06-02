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
        <ngx-sample-layout>
            <nb-menu [items]="menu"></nb-menu>
            <router-outlet></router-outlet>
        </ngx-sample-layout>`,
})
export class AppComponent implements OnInit {
    menu: NbMenuItem[] = [
        {
            title: 'Menu',
            group: true,
        },
        {
            title: 'Home',
            icon: 'nb-home',
            link: '/',
        },
        {
            title: 'Wallet generate',
            icon: 'nb-locked',
            link: '/wallet',
        },
        {
            title: 'Google direct link',
            icon: 'nb-shuffle',
            link: '/google-direct-link',
        },
        {
            title: 'QR-code generator',
            icon: 'nb-grid-a-outline',
            link: '/qr-code',
        },
        {
            title: 'Ethereum tx parser',
            icon: 'nb-compose',
            link: '/ethereum-parser',
        },
        {
            title: 'Crypto send',
            icon: 'nb-checkmark',
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
