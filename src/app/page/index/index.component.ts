import {Component, OnInit} from '@angular/core'
import {CurrencyHistoryService, IItems} from '../../services/currency-history.service'
import {Colors} from '../common/chart/chart.component'

@Component({
    selector: 'ngx-wg-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {

    btcChart: IItems[]
    ethChart: IItems[]
    eosChart: IItems[]

    colors = Colors

    constructor(
        private currencyHistoryService: CurrencyHistoryService,
    ) {
    }

    ngOnInit() {
        this.currencyHistoryService
            .getBtc()
            .then((value) => {
                this.btcChart = value
            })

        this.currencyHistoryService
            .getEth()
            .then((value) => this.ethChart = value)

        this.currencyHistoryService
            .getEos()
            .then((value) => this.eosChart = value)
    }
}
