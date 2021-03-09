import { Component, Input, OnInit } from '@angular/core'

import coinselect from 'coinselect'
import * as bitcoin from 'bitcoinjs-lib'
import { GeneratorService } from '../../services/generator.service'
import { HttpClient } from '@angular/common/http'
import { Psbt } from 'bitcoinjs-lib'

@Component({
    selector: 'ngx-btc-rpc-wallet',
    templateUrl: './btc-rpc-wallet.component.html',
    styleUrls: ['./btc-rpc-wallet.component.css'],
})
export class BtcRpcWalletComponent implements OnInit {
    @Input() networkName: string = 'bitcoin'
    @Input() rpc: string = ''
    @Input() privateKey: string = ''
    @Input() to: string = ''
    @Input() amount: number = 0

    address: string = ''
    utxo = []
    balance = 0

    result: string

    constructor(protected generatorService: GeneratorService, protected http: HttpClient) {
    }

    ngOnInit(): void {
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
        const utxoResult = await this.http.post(this.rpc,
            {
                'jsonrpc': '1.0',
                'id': 'curltest',
                'method': 'scantxoutset',
                'params': ['start', [`addr(${ this.address })`]],
            },
            {
                headers: { 'content-type': 'text/plain' },
                withCredentials: true,
            })
            .toPromise()
            .catch(_ => {
            })

        console.log({ utxoResult })

        this.balance = 0.2002822
        this.utxo = [{
            'txid': 'd72e08f5aaea9ce30b2fcbf9f8687c095f6a59ee575248ee9343b48f880b5959',
            'vout': 0,
            'scriptPubKey': '76a91448ab8a09076ef10561de7918f0a485062e3222fb88ac',
            'desc': 'addr(mn9CScpY8Eqx4DVeNvujuawCftuADF1sFt)#yktzrver',
            'amount': 0.01000000,
            'height': 2518,
        }]
    }

    async send() {
        const targets = [
            {
                address: this.to,
                value: this.amount * 10 ** 8,
            },
        ]

        const utxos = this.utxo.map(i => {
            return {
                txId: i.txid,
                value: i.amount * 10 ** 8,
                nonWitnessUtxo: Buffer.from('020000000001013ae9dfae6e1a7a69c04b2a463fa93627a45de71350ee5f5ce3cce8b2546a1e27010000001716001472ca5b1db2e55826704b684fe5fe30e75fee5712ffffffff023c9b3101000000001976a914e8806fafcf9b5877981b37be790cffbdbfb2291888acc002872e0000000017a914047032105670286fa4eae517f510ace192895fd78702483045022100bedcd1537c8954e51e855363468b71d4dbb13b2faf1827137c25b8e1d79bb6790220041d626b61daaf201e4a42268775f0b8f918c99fbb350dc990d7bcf1d5f07f89012103b569edd93800049284359bf36c0b263721a72986dfffdcf131ded081cd04686600000000', 'hex'),
                vout: i.vout,
            }
        })

        const { inputs, outputs } = coinselect(utxos, targets, 50)

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

        const pushResult = await this.http.post(this.rpc,
            {
                'jsonrpc': '1.0',
                'id': 'curltest',
                'method': 'sendrawtransaction',
                'params': [txHex],
            },
            {
                headers: { 'content-type': 'text/plain' },
                withCredentials: true,
            }).toPromise()

        this.result = JSON.stringify(pushResult)
    }
}
