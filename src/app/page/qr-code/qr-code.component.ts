import {Component, Input, OnInit} from '@angular/core'
import * as qrcode from 'qrcode-generator'

const TYPE_NUMBER = 4
const ERROR_LEVEL = 'L'
const CELL_SIZE = 8
const MARGIN = 0

@Component({
    selector: 'ngx-qr-code',
    templateUrl: './qr-code.component.html',
    styleUrls: ['./qr-code.component.scss'],
})
export class QrCodeComponent implements OnInit {
    protected codeTag: any
    private link: string = ''

    private updateRender() {
        if (!this.link) {
            this.codeTag = ''
            return
        }

        const qr = qrcode(TYPE_NUMBER, ERROR_LEVEL)
        qr.addData(this.link)
        qr.make()
        this.codeTag = qr.createImgTag(CELL_SIZE, MARGIN)
    }

    constructor() {
    }

    ngOnInit() {
    }

}
