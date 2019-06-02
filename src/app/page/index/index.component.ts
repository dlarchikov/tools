import {Component, Input, OnInit, Output} from '@angular/core'
import {GeneratorService, TGenerate} from '../../services/generator.service'
import {IKeyPair, IKeyPairEos} from '../../interfaces/IKeyPair'
import {CurrencyHistoryService, IItems} from '../../services/currency-history.service'

@Component({
    selector: 'ngx-wg-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {

    btcChart: IItems[]
    ethChart: IItems[]

    constructor(
        private currencyHistoryService: CurrencyHistoryService,
    ) {
    }

    ngOnInit() {
        this.currencyHistoryService
            .getBtc()
            .then((value) => { this.btcChart = value })

        this.currencyHistoryService
            .getEth()
            .then((value) => this.ethChart = value)
    }
}
