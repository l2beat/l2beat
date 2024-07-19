import { EthereumAddress } from '@l2beat/shared-pure'
import { Type } from 'cmd-ts'
import { ChainName, chains } from '../config/chains'

export const EthereumAddressValue: Type<string, EthereumAddress> = {
  async from(str): Promise<EthereumAddress> {
    return new Promise((resolve, _) => {
      resolve(EthereumAddress(str))
    })
  },
}

export const ChainValue: Type<string, ChainName> = {
  async from(str): Promise<ChainName> {
    return new Promise((resolve, reject) => {
      const chainNames = chains.map((c) => c.name)
      if (!chainNames.includes(str as ChainName)) {
        reject(new Error(`Possible chains are: ${chainNames.join(', ')}`))
      }
      resolve(str as ChainName)
    })
  },
}
