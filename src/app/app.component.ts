/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, OnInit} from '@angular/core'
import {NbThemeService} from '@nebular/theme'
import {CookieService} from 'ngx-cookie-service'

@Component({
    selector: 'ngx-app',
    template: `
        <ngx-sample-layout>
            <router-outlet></router-outlet>
        </ngx-sample-layout>`,
})
export class AppComponent implements OnInit {
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
