import { Injectable } from '@angular/core'
import { IKeyPair, IKeyPairEos } from '../interfaces/IKeyPair'
import * as bitcoin from 'bitcoinjs-lib'

import Wallet from 'ethereumjs-wallet'
import { Keygen } from 'eosjs-keygen'
import { Network } from 'bitcoinjs-lib'

export type TGenerate = 'BTC' | 'ETH' | 'EOS'

@Injectable({
    providedIn: 'root',
})
export class GeneratorService {

    constructor() {
    }

    generate(type: TGenerate, options = {}): Promise<IKeyPair | IKeyPairEos> {
        switch (type) {
            case 'BTC':
                return this.generateBtcPair(options)
            case 'ETH':
                return this.generateEthPair(options)
            case 'EOS':
                return this.generateEosPair(options)
        }
    }

    private generateBtcPair(options?): Promise<IKeyPair> {
        return new Promise<IKeyPair>(async (success) => {
            const keyPair = bitcoin.ECPair.makeRandom({ network: this.getBtcNetworkByName(options.network) })
            const { address } = bitcoin.payments.p2pkh({
                pubkey: keyPair.publicKey,
                network: this.getBtcNetworkByName(options.network),
            })
            return success({
                privateKey: keyPair.toWIF(),
                publicKey: address,
            })
        })
    }

    private generateEthPair(options?): Promise<IKeyPair> {
        return new Promise<IKeyPair>(async (success) => {
            const wallet = Wallet.generate()

            return success({
                publicKey: wallet.getAddressString(),
                privateKey: wallet.getPrivateKeyString(),
            })
        })
    }

    private generateEosPair(options?): Promise<IKeyPairEos> {
        return new Promise(async (success) => {
            const keys = await Keygen.generateMasterKeys()

            return success({
                owner: {
                    publicKey: keys.publicKeys.owner,
                    privateKey: keys.privateKeys.owner,
                },
                active: {
                    publicKey: keys.publicKeys.active,
                    privateKey: keys.privateKeys.active,
                },
            })
        })
    }

    public getBtcNetworkByName(networkName: string): Network {
        switch (networkName) {
            case 'regtest':
                return bitcoin.networks.regtest
            case 'testnet':
                return bitcoin.networks.testnet
            default:
                return bitcoin.networks.bitcoin
        }
    }
}
