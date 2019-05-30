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
    @Input() type: TGenerate

    keys: IKeyPair | IKeyPairEos
    generatorStarted: boolean = false

    btcChart: IItems[]
    ethChart: IItems[]

    constructor(
        private generatorService: GeneratorService,
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

    isGenerateDisabled(): boolean {
        return !this.type
    }

    onSelectType() {
        this.keys = undefined
        this.generatorStarted = false
    }

    generate() {
        this.generatorStarted = true
        setTimeout(
            async () => this.keys = await this.generatorService.generate(this.type), 500,
        )
    }
}
