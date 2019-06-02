import {Component, Input, OnInit} from '@angular/core'
import {GeneratorService, TGenerate} from '../../services/generator.service'
import {IKeyPair, IKeyPairEos} from '../../interfaces/IKeyPair'

@Component({
    selector: 'ngx-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
    @Input() type: TGenerate

    keys: IKeyPair | IKeyPairEos
    generatorStarted: boolean = false

    constructor(
        private generatorService: GeneratorService,
    ) {
    }

    ngOnInit() {
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
