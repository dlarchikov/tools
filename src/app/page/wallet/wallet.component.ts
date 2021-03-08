import {Component, Input, OnInit} from '@angular/core'
import {GeneratorService, TGenerate} from '../../services/generator.service'
import {IKeyPair, IKeyPairEos} from '../../interfaces/IKeyPair'
import * as bitcoin from 'bitcoinjs-lib'
import { Network } from 'bitcoinjs-lib'

@Component({
    selector: 'ngx-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
    @Input() type: TGenerate
    @Input() btcNetwork: Network = bitcoin.networks.bitcoin

    keys: IKeyPair | IKeyPairEos
    generatorStarted: boolean = false

    constructor(
        private generatorService: GeneratorService,
    ) {
    }

    ngOnInit() {
    }

    isGenerateDisabled(): boolean {
        if (this.isShowNetworkSelector()) {}

        return !this.type
    }

    isShowNetworkSelector(): boolean {
        return this.type === 'BTC'
    }

    onSelectType() {
        this.keys = undefined
        this.generatorStarted = false
    }

    generate() {
        this.generatorStarted = true
        setTimeout(
            async () => this.keys = await this.generatorService.generate(this.type, {network: this.btcNetwork} ), 500,
        )
    }
}
