import {Component, OnDestroy} from '@angular/core'
import {delay, takeWhile, withLatestFrom} from 'rxjs/operators'
import {
    NbMediaBreakpoint, NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService,
} from '@nebular/theme'

import {Router} from '@angular/router'

// TODO: move layouts into the framework
@Component({
    selector: 'ngx-sample-layout',
    styleUrls: ['./sample.layout.scss'],
    template: `
        <nb-layout windowMode>
            <nb-layout-header fixed>
                <ngx-header></ngx-header>
            </nb-layout-header>

            <nb-sidebar #sideBar class="menu-sidebar"
                        tag="menu-sidebar" state="collapsed" fixed>
                <ng-content select="nb-menu"></ng-content>
            </nb-sidebar>

            <nb-layout-column class="main-content">
                <ng-content select="router-outlet"></ng-content>
            </nb-layout-column>

            <nb-layout-footer fixed>
                <ngx-footer></ngx-footer>
            </nb-layout-footer>
        </nb-layout>
        <!--<ngx-toggle-settings-button></ngx-toggle-settings-button>-->
    `,
})
export class SampleLayoutComponent implements OnDestroy {

    layout: any = {}
    sidebar: any = {}
    currentTheme: string
    private alive = true

    constructor(
        protected menuService: NbMenuService,
        protected themeService: NbThemeService,
        protected bpService: NbMediaBreakpointsService,
        protected sidebarService: NbSidebarService,
        protected router: Router,
    ) {
        const isBp = this.bpService.getByName('is')
        this.menuService.onItemSelect()
            .pipe(
                takeWhile(() => this.alive),
                withLatestFrom(this.themeService.onMediaQueryChange()),
                delay(20),
            )
            .subscribe(([item, [bpFrom, bpTo]]: [any, [NbMediaBreakpoint, NbMediaBreakpoint]]) => {

                if (bpTo.width <= isBp.width) {
                    this.sidebarService.collapse('menu-sidebar')
                }
            })

        this.themeService.getJsTheme()
            .pipe(takeWhile(() => this.alive))
            .subscribe(theme => {
                this.currentTheme = theme.name
            })
    }

    goToHome(): void {
        this.router.navigateByUrl('/')
            .catch(reason => console.error(reason))
    }

    toggleMenu(): void {
        this.sidebarService.toggle()
    }

    ngOnDestroy() {
        this.alive = false
    }
}
