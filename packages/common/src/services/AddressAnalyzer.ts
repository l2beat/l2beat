import { providers } from 'ethers'

import { EthereumAddress, json } from '../types'
import { EtherscanClient } from './etherscan/EtherscanClient'

interface EOAAddress {
  type: 'EOA'
  name: string
}

export interface UnverifiedContract {
  type: 'Contract'
  verified: false
  name: string
}

export interface VerifiedContract {
  type: 'Contract'
  verified: true
  name: string
  abi: json
}

export type AnalyzedAddress = EOAAddress | UnverifiedContract | VerifiedContract

export class AddressAnalyzer {
  constructor(
    private provider: providers.Provider,
    private etherscanClient: EtherscanClient,
  ) {}

  async getName(address: EthereumAddress) {
    const { name } = await this.analyze(address)
    return name
  }

  async analyze(address: EthereumAddress) {
    const [code, source] = await Promise.all([
      this.provider.getCode(address.toString()),
      this.etherscanClient.getContractSource(address),
    ])
    if (code === '0x') {
      return { type: 'EOA', name: `<EOA ${address.slice(2, 10)}>` }
    } else if (source.ABI === 'Contract source code not verified') {
      return {
        type: 'Contract',
        verified: false,
        name: `<Unverified ${address.slice(2, 10)}>`,
      }
    } else {
      return {
        type: 'Contract',
        verified: true,
        name: source.ContractName,
        abi: JSON.parse(source.ABI),
      }
    }
  }
}
