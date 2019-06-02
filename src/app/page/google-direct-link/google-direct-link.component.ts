import {Component, Input, OnInit} from '@angular/core'

@Component({
    selector: 'ngx-google-direct-link',
    templateUrl: './google-direct-link.component.html',
    styleUrls: ['./google-direct-link.component.scss'],
})
export class GoogleDirectLinkComponent implements OnInit {
    generatedLink: string = ''
    inputStatus: string = ''

    constructor() {
    }

    @Input()
    set sourceLink(value) {
        if (!value) {
            this.generatedLink = ''
            return
        }

        const parseResult = this.parse(value)

        if (!parseResult) {
            this.inputStatus = 'danger'
            return
        } else {
            this.inputStatus = ''
        }

        this.generatedLink = 'https://drive.google.com/uc?export=download&id=' + parseResult[1]
    }

    parse(value) {
        const regExp = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_\-=.]+)/
        const regExpShort = /https:\/\/drive\.google\.com\/open\?id=([a-zA-Z0-9_\-=.]+)/
        return value.match(regExp) || value.match(regExpShort)
    }

    ngOnInit() {
    }
}
