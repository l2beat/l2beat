import { ContractParameters } from '@l2beat/shared'
import { ethers } from 'ethers'

import { concatAbis } from '../../../../../../core/discovery/concatAbis'
import { getAddresses } from './getAddresses'

export function getFunctions(
  contract: ContractParameters,
  discoveryABIs: Record<string, string[]>,
): string[] {
  // contracts without values do not have ABI in discovery.json
  if (contract.values === undefined) {
    return []
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
      return abi
    })
    .flat()

  const iface = new ethers.utils.Interface(concatAbis(...abis))

  const functions = Object.entries(iface.functions)
    .filter(([, fn]) => fn.stateMutability === 'view')
    .map(([name]) => name)

  return functions
}
