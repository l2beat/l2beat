import { EthereumAddress } from '@l2beat/shared'
import { zip } from 'lodash'

import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { deduplicateAbi } from './deduplicateAbi'
import { processSources } from './processSources'

export class SourceCodeService {
  constructor(private readonly provider: DiscoveryProvider) {}

  async getMetadata(
    address: EthereumAddress,
    implementations: EthereumAddress[],
  ) {
    return getMetadata(this.provider, address, implementations)
  }
}

interface ContractSource {
  address: EthereumAddress
  contract: string
  files: Record<string, string>
}

export interface ContractMetadata {
  name: string
  isEOA: boolean
  isVerified: boolean
  implementationVerified: boolean
  abi: string[]
  abis: Record<string, string[]>
  sources: ContractSource[]
}

export async function getMetadata(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  implementations: EthereumAddress[],
): Promise<ContractMetadata> {
  const metadata = await provider.getMetadata(address)

  const implementationMeta = await Promise.all(
    implementations.map((address) => provider.getMetadata(address)),
  )

  const name =
    implementationMeta.length === 1 ? implementationMeta[0].name : metadata.name
  const abi = deduplicateAbi([
    ...metadata.abi,
    ...implementationMeta.flatMap((x) => x.abi),
  ])

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

  const sources: ContractSource[] = []
  sources.push({
    address,
    contract: metadata.name,
    files: metadata.isVerified
      ? processSources(metadata.source, address, metadata.name)
      : {},
  })
  for (const [implementation, metadata] of zip(
    implementations,
    implementationMeta,
  )) {
    if (implementation && metadata) {
      sources.push({
        address: implementation,
        contract: metadata.name,
        files: metadata.isVerified
          ? processSources(metadata.source, implementation, metadata.name)
          : {},
      })
    }
  }

  return {
    name,
    isEOA: false,
    isVerified: metadata.isVerified,
    implementationVerified: implementationMeta.every((x) => x.isVerified),
    abi,
    abis,
    sources,
  }
}
