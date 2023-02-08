import { EthereumAddress } from '@l2beat/shared'
import { zip } from 'lodash'

import { concatAbis } from './concatAbis'
import { DiscoveryProvider } from './provider/DiscoveryProvider'

export interface ContractMetadata {
  name: string
  isEOA: boolean
  isVerified: boolean
  implementationVerified: boolean
  abi: string[]
  abis: Record<string, string[]>
}

export async function getMetadata(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  implementations: EthereumAddress[],
): Promise<ContractMetadata> {
  const [code, metadata] = await Promise.all([
    provider.getCode(address),
    provider.getMetadata(address),
  ])

  if (code.length === 0) {
    return {
      name: 'EOA',
      isEOA: true,
      isVerified: true,
      implementationVerified: true,
      abi: [],
      abis: {},
    }
  }

  const implementationMeta = await Promise.all(
    implementations.map((address) => provider.getMetadata(address)),
  )

  const name =
    implementationMeta.length === 1 ? implementationMeta[0].name : metadata.name
  const abi = concatAbis(
    ...metadata.abi,
    ...implementationMeta.flatMap((x) => x.abi),
  )

  const abis: Record<string, string[]> = {}
  if (metadata.abi.length > 0) {
    abis[address.toString()] = metadata.abi
  }
  for (const [implementation, metadata] of zip(
    implementations,
    implementationMeta,
  )) {
    if (implementation && metadata && metadata.abi.length > 0) {
      abis[implementation.toString()] = metadata.abi
    }
  }

  return {
    name,
    isEOA: false,
    isVerified: metadata.isVerified,
    implementationVerified: implementationMeta.every((x) => x.isVerified),
    abi,
    abis,
  }
}
