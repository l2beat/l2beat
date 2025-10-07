import chains from './chains.json'

export type Chain = {
  /** Id for internal purposes, set it to an arbitrary string*/
  id: string
  /** This will be displayed on the UOPS explorer */
  name: string
  /** Currently we support two types of blockchain APIs. Provide the type and the working url.*/
  blockchainApi: {
    type: 'rpc' | 'starknet'
    url: string
    callsPerMinute?: number
  }
  /** If the chain has Etherscan instance deployed provide the address here. With this configured UOPS explorer will show contract names.*/
  etherscanChainId?: string
  /** We use it to build links to the block explorer */
  explorerUrl?: string
}

export const SUPPORTED_CHAINS = chains as Chain[]
