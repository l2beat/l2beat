export type EthereumDaConfig = {
  type: 'Ethereum'
  config: {
    inbox: string
    sequencers: string[]
  }
}

export type CelestiaDaConfig = {
  type: 'Celestia'
  config: {
    namespace: string
    signers?: string[]
  }
}

export type AvailDaConfig = {
  type: 'Avail'
  config: {
    applicationId: string
  }
}

export type DaConfig = CelestiaDaConfig | EthereumDaConfig | AvailDaConfig
