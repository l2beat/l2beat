import { EthereumAddress } from '@l2beat/types'

import { concatAbis } from './concatAbis'
import { DiscoveryProvider } from './provider/DiscoveryProvider'

export interface ContractMetadata {
  name: string
  isEOA: boolean
  isVerified: boolean
  implementationVerified: boolean
  abi: string[]
}

export async function getMetadata(
  provider: DiscoveryProvider,
  additionalAbiEntries: string[],
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
    ...additionalAbiEntries,
  )
  return {
    name,
    isEOA: false,
    isVerified: metadata.isVerified,
    implementationVerified: implementationMeta.every((x) => x.isVerified),
    abi,
  }
}
