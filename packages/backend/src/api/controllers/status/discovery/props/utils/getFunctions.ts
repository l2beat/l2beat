import { deduplicateAbi } from '@l2beat/discovery'
import { ContractParameters } from '@l2beat/shared-pure'
import { ethers } from 'ethers'

import { getAddresses } from './getAddresses'

export function getViewABI(
  contract: ContractParameters,
  discoveryABIs: Record<string, string[]>,
): ethers.utils.Interface {
  // contracts without values do not have ABI in discovery.json
  if (contract.values === undefined) {
    return new ethers.utils.Interface([])
  }

  const addresses = getAddresses(contract)

  const abis = addresses
    .map((address) => {
      const abi = discoveryABIs[address.toString()]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (abi === undefined) {
        throw new Error(
          `Programmer Error: ABI for ${address.toString()} not found`,
        )
      }
      return abi.filter((fn) => fn.includes(' view '))
    })
    .flat()

  return new ethers.utils.Interface(deduplicateAbi(abis))
}
