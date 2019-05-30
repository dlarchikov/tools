import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'ngx-static-page',
    templateUrl: './static-page.component.html',
    styleUrls: ['./static-page.component.scss'],
})
export class StaticPageComponent implements OnInit {
    protected name: string;

    constructor(private route: ActivatedRoute) {
        this.name = this.route.snapshot.params['name'];
    }

    ngOnInit() {
    }

}
