import { EthereumAddress } from '@l2beat/shared-pure'
import { extendType, number, type Type } from 'cmd-ts'
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

/**
 * A count the code can honour as given: `AuthoringLoop` would clamp a zero
 * or negative `--ai-rounds` to one turn without saying so.
 */
export const PositiveInteger: Type<string, number> = extendType(number, {
  from(value): Promise<number> {
    if (!Number.isInteger(value) || value < 1) {
      return Promise.reject(
        new Error(`Expected a positive integer, got ${value}`),
      )
    }
    return Promise.resolve(value)
  },
  displayName: 'positive integer',
  description: 'a positive integer',
})
