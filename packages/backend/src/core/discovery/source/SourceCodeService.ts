import { EthereumAddress } from '@l2beat/shared'
import { zip } from 'lodash'

import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { deduplicateAbi } from './deduplicateAbi'
import { getDerivedName } from './getDerivedName'
import { processSources } from './processSources'

interface SourceCode {
  address: EthereumAddress
  contract: string
  files: Record<string, string>
}

export interface ContractSources {
  name: string
  isVerified: boolean
  abi: string[]
  abis: Record<string, string[]>
  sourceCodes: SourceCode[]
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

    const name = getDerivedName(metadata.map((x) => x.name))
    const abi = deduplicateAbi(metadata.flatMap((x) => x.abi))

    const abis: Record<string, string[]> = {}
    const sourceCodes: SourceCode[] = []
    for (const [address, item] of zip(addresses, metadata)) {
      if (!address || !item) {
        continue
      }
      if (item.abi.length !== 0) {
        abis[address.toString()] = item.abi
      }
      sourceCodes.push({
        address,
        contract: item.name,
        files: item.isVerified
          ? processSources(item.source, address, item.name)
          : {},
      })
    }

    const isVerified = metadata.every((x) => x.isVerified)
    return { name, isVerified, abi, abis, sourceCodes }
  }
}
