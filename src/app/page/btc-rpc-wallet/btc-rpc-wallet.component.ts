import { Component, Input, OnInit } from '@angular/core'

import coinselect from 'coinselect'
import * as bitcoin from 'bitcoinjs-lib'
import { GeneratorService } from '../../services/generator.service'
import { HttpClient } from '@angular/common/http'
import { Psbt } from 'bitcoinjs-lib'
import { ActivatedRoute } from '@angular/router'
import { NbToastrService } from '@nebular/theme'

export interface UtxoResult {
    error?: string,
    id: string,
    result: {
        success: boolean,
        txouts: number,
        height: number,
        bestblock: string,
        unspents: {
            txid: string,
            vout: number,
            scriptPubKey: string,
            desc: string,
            amount: number,
            height: number,
        }[],
        total_amount: number,
    }
}

@Component({
    selector: 'ngx-btc-rpc-wallet',
    templateUrl: './btc-rpc-wallet.component.html',
    styleUrls: ['./btc-rpc-wallet.component.css'],
})
export class BtcRpcWalletComponent implements OnInit {
    @Input() networkName: string = 'bitcoin'
    @Input() rpc: string = ''
    @Input() user: string = ''
    @Input() password: string = ''
    @Input() privateKey: string = ''
    @Input() to: string = ''
    @Input() amount: number = 0
    @Input() speed: number = 50

    address: string = ''
    utxo = []
    balance = 0

    result: string

    constructor(
        protected generatorService: GeneratorService,
        protected http: HttpClient,
        protected route: ActivatedRoute,
        protected toastrService: NbToastrService,
    ) {
    }

    ngOnInit(): void {
        this.route.queryParams
            .subscribe(params => {
                if (params.rpc) {
                    this.rpc = params.rpc
                }

                if (params.user) {
                    this.user = params.user
                }

                if (params.password) {
                    this.password = params.password
                }

                if (params.privateKey) {
                    this.privateKey = params.privateKey
                }

                if (params.networkName) {
                    this.networkName = params.networkName
                }

                if (params.speed) {
                    this.speed = params.speed
                }
            })
    }

    isAllowCalculate() {
        return this.rpc && this.privateKey
    }

    calculateAddress() {
        try {
            const keyPair = bitcoin.ECPair.fromWIF(
                this.privateKey,
                this.generatorService.getBtcNetworkByName(this.networkName),
            )

            const { address } = bitcoin.payments.p2pkh({
                pubkey: keyPair.publicKey,
                network: this.generatorService.getBtcNetworkByName(this.networkName),
            })

            this.address = address

            this.utxo = []
            this.balance = 0
            this.to = ''
            this.amount = 0
            this.result = null
        } catch (e) {
            console.error(e)
        }
    }

    async loadUtxo() {
        const utxoResult: UtxoResult = await this.http.post(this.rpc,
            {
                'jsonrpc': '1.0',
                'id': 'curltest',
                'method': 'scantxoutset',
                'params': ['start', [`addr(${ this.address })`]],
            },
            {
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Basic ${ btoa(this.user + ':' + this.password) }`,
                },
            })
            .toPromise() as any

        this.balance = utxoResult.result.total_amount
        this.utxo = utxoResult.result.unspents
    }

    async send() {
        const targets = [
            {
                address: this.to,
                value: this.amount * 10 ** 8,
            },
        ]

        const utxos = await Promise.all(this.utxo.map(async i => {
                const { result: rawTx } = await this.http.post(this.rpc, {
                    'jsonrpc': '1.0',
                    'id': 'curltest',
                    'method': 'getrawtransaction',
                    'params': [i.txid],
                }, {
                    headers: {
                        'content-type': 'application/json',
                        'authorization': `Basic ${ btoa(this.user + ':' + this.password) }`,
                    },
                }).toPromise() as any

                return {
                    txId: i.txid,
                    value: i.amount * 10 ** 8,
                    nonWitnessUtxo: Buffer.from(rawTx, 'hex'),
                    vout: i.vout,
                }
            }),
        )

        console.log({ utxos, targets, speed: this.speed })

        const { inputs, outputs } = coinselect(utxos, targets, Number(this.speed))

        console.log({ inputs, outputs })

        const keyPair = bitcoin.ECPair.fromWIF(
            this.privateKey,
            this.generatorService.getBtcNetworkByName(this.networkName),
        )

        const psbt = new Psbt({ network: this.generatorService.getBtcNetworkByName(this.networkName) })
            .setVersion(2)
            .setLocktime(0)

        inputs.forEach(input => {
                psbt.addInput({
                    hash: input.txId,
                    index: input.vout,
                    nonWitnessUtxo: input.nonWitnessUtxo,
                })
            },
        )

        outputs.forEach(output => {
            if (!output.address) {
                output.address = this.address
            }

            psbt.addOutput({
                address: output.address,
                value: output.value,
            })
        })

        psbt.signAllInputs(keyPair)
            .finalizeAllInputs()

        const txHex = psbt.extractTransaction().toHex()

        const txId = psbt.extractTransaction().getId()

        try {
            await this.http.post(this.rpc,
                {
                    'jsonrpc': '1.0',
                    'id': 'curltest',
                    'method': 'sendrawtransaction',
                    'params': [txHex],
                },
                {
                    headers: {
                        'content-type': 'text/plain',
                        'authorization': `Basic ${ btoa(this.user + ':' + this.password) }`,
                    },
                }).toPromise()

            this.result = txId
        } catch (e) {
            this.toastrService.danger(e.message)
        }
    }

    async generateBlock() {
        if (!this.to) {
            this.toastrService.warning('', 'Please fill TO adress')
            return
        }

        try {
            await this.http.post(this.rpc,
                {
                    'jsonrpc': '1.0',
                    'id': 'curltest',
                    'method': 'generatetoaddress',
                    'params': [1, this.to],
                },
                {
                    headers: {
                        'content-type': 'text/plain',
                        'authorization': `Basic ${ btoa(this.user + ':' + this.password) }`,
                    },
                }).toPromise()

            this.toastrService.warning('', 'New block was generated')
        } catch (e) {
            this.toastrService.danger(e.message)
        }
    }

    async calculateOuts() {
        const targets = [
            {
                address: this.to,
                value: this.amount * 10 ** 8,
            },
        ]

        const utxos = await Promise.all(this.utxo.map(async i => {
                const { result: rawTx } = await this.http.post(this.rpc, {
                    'jsonrpc': '1.0',
                    'id': 'curltest',
                    'method': 'getrawtransaction',
                    'params': [i.txid],
                }, {
                    headers: {
                        'content-type': 'application/json',
                        'authorization': `Basic ${ btoa(this.user + ':' + this.password) }`,
                    },
                }).toPromise() as any

                return {
                    txId: i.txid,
                    value: i.amount * 10 ** 8,
                    nonWitnessUtxo: Buffer.from(rawTx, 'hex'),
                    vout: i.vout,
                }
            }),
        )

        console.log({ utxos, targets, speed: this.speed })

        const { inputs, outputs } = coinselect(utxos, targets, Number(this.speed))

        this.result = JSON.stringify({ inputs, outputs })
    }
}
