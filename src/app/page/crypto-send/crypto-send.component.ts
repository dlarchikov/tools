import { Component, OnInit } from '@angular/core'
import { Transaction as EthereumTx } from 'ethereumjs-tx'
import { HttpClient } from '@angular/common/http'
import EthWallet from 'ethereumjs-wallet'
import coinSelect from 'coinselect'
import * as bitcoin from 'bitcoinjs-lib'
import { payments } from 'bitcoinjs-lib'

export enum CryptoSendType {
    BTC = 'BTC',
    ETH = 'ETH',
}

@Component({
    selector: 'ngx-crypto-send',
    templateUrl: './crypto-send.component.html',
    styleUrls: [],
})
export class CryptoSendComponent implements OnInit {
    constructor(protected http: HttpClient) {
    }

    protected type: CryptoSendType
    protected privateKey: string = ''
    protected target: string = ''
    protected amount: number
    protected speed: number
    protected customSpeed: number

    protected error = ''

    async sendClick() {
        this.error = ''

        try {
            switch (this.type) {
                case CryptoSendType.BTC:
                    return await this.sendBtc(this.privateKey, this.target, this.amount)
                case CryptoSendType.ETH:
                    return await this.sendEth(this.privateKey, this.target, this.amount)
                default:
                    throw new Error('Unsupported currency')
            }
        } catch (e) {
            this.error = e.message
        }
    }

    async sendBtc(privateKey: string, to: string, amount: number): Promise<void> {
        const keyPair = bitcoin.ECPair.fromWIF(privateKey)
        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
        const { unspent_outputs: inputsResult }: any = await this.http.get(
            `https://cors-anywhere.herokuapp.com/https://blockchain.info/unspent?active=${ address }`,
        ).toPromise()

        const accountSum = inputsResult.reduce((a, b) => a + b.value, 0)

        if (accountSum <= amount) {
            console.log('Amount must me less')
            return
        }

        console.log({ inputsResult })

        const utxos = inputsResult.map(i => {
            const redeem = payments.p2wpkh({ pubkey: keyPair.publicKey })
            const redeemScript = payments.p2sh({ redeem }).redeem.output

            return {
                txId: i.tx_hash_big_endian,
                vout: 0,
                value: i.value,
                redeemScript,
                witnessUtxo: {
                    script: Buffer.from(i.tx_hash_big_endian, 'hex'),
                    value: i.value,
                },
            }
        })

        const targets = [
            {
                address: to,
                value: amount * 10 ** 8,
            },
        ]

        const { inputs, outputs } = coinSelect(utxos, targets, this.speed)

        if (!inputs || !outputs) {
            console.log('Solution not found')
            return
        }

        const psbt = new bitcoin.Psbt()

        inputs.forEach(input => {
                psbt.addInput({
                    hash: input.txId,
                    index: input.vout,
                    nonWitnessUtxo: input.nonWitnessUtxo,
                    // witnessUtxo: input.witnessUtxo,
                })
            },
        )
        outputs.forEach(output => {
            if (!output.address) {
                output.address = address
            }

            psbt.addOutput({
                address: output.address,
                value: output.value,
            })
        })

        console.log({ inputs, outputs })

        psbt.signAllInputs(keyPair)

        console.log(psbt.validateSignaturesOfAllInputs())

        // psbt.finalizeAllInputs()

        // console.log(psbt.toHex())
    }

    async sendEth(privateKey: string, to: string, amount: number): Promise<void> {
        const privateKeyBuffer = Buffer.from(privateKey, 'hex')
        const wallet = EthWallet.fromPrivateKey(privateKeyBuffer)

        const url = `https://api.etherscan.io/api`

        const httpResult: any = await this.http.get(url, {
            params: {
                module: 'proxy',
                address: wallet.getAddressString(),
                action: 'eth_getTransactionCount',
                tag: 'latest',
                apikey: '574GKIB3UT2A6DH6AXF786S27YHFKSTRX3',
            },
        }).toPromise()
        let { result: nonce } = httpResult

        nonce = parseInt(nonce, 16)

        const speed = this.customSpeed ? this.customSpeed : this.speed

        const txParams = {
            nonce: `0x${ (nonce).toString(16) }`,
            gasPrice: `0x${ (speed * 10 ** 9).toString(16) }`,
            gasLimit: `0x${ (21000).toString(16) }`,
            to: to,
            value: `0x${ (amount * 10 ** 18).toString(16) }`,
        }

        const tx = new EthereumTx(txParams)
        tx.sign(privateKeyBuffer)
        const serializedTx = tx.serialize()

        await this.http.get(`https://api.etherscan.io/api`, {
            params: {
                module: 'proxy',
                action: 'eth_sendRawTransaction',
                hex: serializedTx.toString('hex'),
                apikey: '574GKIB3UT2A6DH6AXF786S27YHFKSTRX3',
            },
        }).toPromise()
    }

    isDisabledPrivateKeyControl(): boolean {
        return !this.type
    }

    isDisabledTargetControl(): boolean {
        return !this.privateKey
    }

    isDisabledAmountControl(): boolean {
        return !this.target
    }

    isDisabledSendButton(): boolean {
        return !Number(this.speed) && !Number(this.customSpeed)
    }

    isShowCustomSpeed(): boolean {
        return Number(this.speed) === 0
    }

    isDisabledSpeedControl(): boolean {
        return !this.amount
    }

    ngOnInit(): void {
    }

    getControlStatus(isAllowed: boolean): string {
        return isAllowed ? 'default' : 'info'
    }
}
