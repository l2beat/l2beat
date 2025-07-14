import { EthereumAddress } from '@l2beat/shared-pure'
import type { Type } from 'cmd-ts'
import { chains } from '../config/chains'

export const EthereumAddressValue: Type<string, EthereumAddress> = {
  from(str): Promise<EthereumAddress> {
    return new Promise((resolve, _) => {
      resolve(EthereumAddress(str))
    })
  },
}

export const ChainValue: Type<string, string> = {
  from(str): Promise<string> {
    return new Promise((resolve, reject) => {
      const chainNames = chains.map((c) => c.name)
      if (!chainNames.includes(str)) {
        reject(
          new Error(
            `Possible chains are: ${chainNames.join(', ')}. If want to add a chain modify chains.ts in discovery.`,
          ),
        )
      }
      resolve(str)
    })
  },
}
