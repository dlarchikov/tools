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

        if (!this.validate(value)) {
            this.inputStatus = 'danger'
            return
        } else {
            this.inputStatus = ''
        }

        const valueParsed = this.parse(value)

        this.generatedLink = 'https://drive.google.com/uc?export=download&id=' + valueParsed[1]
    }

    validate(value): boolean {
        const result = this.parse(value)
        return result !== null
    }

    parse(value) {
        const regExp = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_\-=.]+)/
        return value.match(regExp)
    }

    setSelected(event) {
        event.relatedTarget.setSelectionRange(0, 10)
        // console.log(event.relatedTarget.setSelectionRange)
    }

    ngOnInit() {
    }
}
