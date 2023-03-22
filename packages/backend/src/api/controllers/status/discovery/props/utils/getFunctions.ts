import { EthereumAddress, ProjectParameters } from '@l2beat/shared'
import { ethers } from 'ethers'

import { concatAbis } from '../../../../../../core/discovery/concatAbis'
import { getAddresses } from './getAddresses'

export function getFunctions(
  discovery: ProjectParameters,
  address: EthereumAddress,
): string[] {
  const contract = discovery.contracts.find((c) => c.address === address)

  if (contract === undefined) {
    throw new Error(`Contract ${address.toString()} not found`)
  }

  if (contract.values === undefined) {
    return []
  }

  const addresses = getAddresses(contract)

  const functionNames: Set<string> = new Set<string>()
  const abis: string[] = []

  for (const address of addresses) {
    const abi = Object.entries(discovery.abis).find(
      ([a]) => a === address.toString(),
    )
    if (abi === undefined) {
      throw new Error(`ABI for ${address.toString()} not found`)
    }
    abis.push(...abi[1])
    abi[1].forEach((a) => {
      if (a.includes('view')) {
        functionNames.add(a)
      }
    })
  }
  const iface = new ethers.utils.Interface(concatAbis(...abis))

  const functions = Object.entries(iface.functions)
    .filter(([, fn]) => fn.stateMutability === 'view')
    .map(([name]) => name)

  return functions.sort()
}
