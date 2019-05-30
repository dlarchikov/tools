import {Injectable} from '@angular/core'
import {IKeyPair, IKeyPairEos} from '../interfaces/IKeyPair'

import CoinKey from 'coinkey'
import Wallet from 'ethereumjs-wallet'
import {Keygen} from 'eosjs-keygen'

export type TGenerate = 'BTC' | 'ETH' | 'EOS'

@Injectable({
    providedIn: 'root',
})
export class GeneratorService {

    constructor() {
    }

    generate(type: TGenerate): Promise<IKeyPair | IKeyPairEos> {
        switch (type) {
            case 'BTC':
                return this.generateBtcPair()
            case 'ETH':
                return this.generateEthPair()
            case 'EOS':
                return this.generateEosPair()
        }
    }

    private generateBtcPair(): Promise<IKeyPair> {
        return new Promise<IKeyPair>(async (success) => {
            const keys = CoinKey.createRandom()
            return success({
                privateKey: keys.privateKey.toString('hex'),
                publicKey: keys.publicAddress,
            })
        })
    }

    private generateEthPair(): Promise<IKeyPair> {
        return new Promise<IKeyPair>(async (success) => {
            const wallet = Wallet.generate()

            return success({
                publicKey: wallet.getAddressString(),
                privateKey: wallet.getPrivateKeyString(),
            })
        })
    }

    private generateEosPair(): Promise<IKeyPairEos> {
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
}
