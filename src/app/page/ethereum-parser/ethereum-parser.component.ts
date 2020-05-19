import { Component, Input, OnInit } from '@angular/core'
import * as decoder from 'ethereum-tx-decoder'

@Component({
    selector: 'ngx-wg-index',
    templateUrl: './ethereum-parser.component.html',
    styleUrls: [],
})
export class EthereumParserComponent implements OnInit {
    protected parsedTx: string

    @Input()
    set rawTx(value) {
        try {
            this.parsedTx = JSON.stringify(decoder.decodeTx(value), undefined, 2)
        } catch (e) {
            this.parsedTx = e.message
        }
    }

    constructor(
    ) {
    }

    ngOnInit() {

    }
}
