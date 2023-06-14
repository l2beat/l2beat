import { EthereumAddress } from '@l2beat/shared-pure'
import { zip } from 'lodash'

import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { deduplicateAbi } from './deduplicateAbi'
import { getLegacyDerivedName } from './getDerivedName'
import { processSources } from './processSources'

export interface ContractSources {
  name: string
  isVerified: boolean
  abi: string[]
  abis: Record<string, string[]>
  files: Record<string, string>[]
}

export class SourceCodeService {
  constructor(private readonly provider: DiscoveryProvider) {}

  async getSources(
    address: EthereumAddress,
    implementations?: EthereumAddress[],
  ): Promise<ContractSources> {
    const addresses = [address, ...(implementations ?? [])]
    const metadata = await Promise.all(
      addresses.map((x) => this.provider.getMetadata(x)),
    )

    const name = getLegacyDerivedName(metadata.map((x) => x.name))
    const abi = deduplicateAbi(metadata.flatMap((x) => x.abi))

    const abis: Record<string, string[]> = {}
    const files: Record<string, string>[] = []
    for (const [address, item] of zip(addresses, metadata)) {
      if (!address || !item) {
        continue
      }
      if (item.abi.length !== 0) {
        abis[address.toString()] = item.abi
      }
      files.push(processSources(address, item))
    }

    const isVerified = metadata.every((x) => x.isVerified)
    return { name, isVerified, abi, abis, files }
  }
}
