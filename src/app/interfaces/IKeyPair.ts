export interface IKeyPair {
    publicKey: string,
    privateKey: string,
}

export interface IKeyPairEos {
    owner: {
        publicKey: string,
        privateKey: string,
    },
    active: {
        publicKey: string,
        privateKey: string,
    }
}
