import {Component, OnInit} from '@angular/core'

import {NbMenuService, NbSidebarService} from '@nebular/theme'

@Component({
    selector: 'ngx-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

    constructor(
        private sidebarService: NbSidebarService,
        private menuService: NbMenuService,
    ) {
    }

    ngOnInit() {
    }

    toggleSidebar(): void {
        this.sidebarService.toggle(false, 'menu-sidebar')
    }

    goToHome() {
        this.menuService.navigateHome()
    }
}
