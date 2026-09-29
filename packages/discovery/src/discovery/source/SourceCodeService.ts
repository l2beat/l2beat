import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import zip from 'lodash/zip'

import { contractFlatteningHash, sha2_256bit } from '../../flatten/utils'
import type { ContractSource } from '../../utils/IEtherscanClient'
import type { IProvider } from '../provider/IProvider'
import { deduplicateAbi } from './deduplicateAbi'
import { getLegacyDerivedName } from './getDerivedName'
import { skipIgnoredFunctions } from './skipIgnoredFunctions'

export interface PerContractSource {
  hash?: string
  name: string
  address: ChainSpecificAddress
  source: ContractSource
}

export interface ContractSources {
  name: string
  isVerified: boolean
  abi: string[]
  abis: Record<string, string[]>
  sources: PerContractSource[]
}

export class SourceCodeService {
  async getSources(
    provider: IProvider,
    addresses: ChainSpecificAddress[],
    manualSourcePath: Record<string, string>,
  ): Promise<ContractSources> {
    const metadataPerAddress = await Promise.all(
      addresses.map(
        async (x) =>
          [x, await provider.getSource(x)] as [string, ContractSource],
      ),
    )
    const metadata = metadataPerAddress.map(([_, x]) => x)

    const name = getLegacyDerivedName(metadata.map((x) => x.name))
    const abi = deduplicateAbi(metadata.flatMap((x) => x.abi))

    const abis: Record<string, string[]> = {}
    const sources: PerContractSource[] = []
    for (const [address, item] of zip(addresses, metadata)) {
      if (!address || !item) {
        continue
      }
      if (item.abi.length !== 0) {
        abis[address.toString()] = item.abi
      }

      sources.push({
        hash: this.getHash(item, manualSourcePath[address.toString()]),
        name: item.name,
        address: address,
        source: item,
      })
    }

    const isVerified = metadataPerAddress.every(
      ([address, metadata]) =>
        metadata.isVerified ||
        manualSourcePath[address.toString()] !== undefined,
    )

    return { name, isVerified, abi, abis, sources }
  }

  getRelevantAbi(
    abis: Record<string, string[]>,
    address: ChainSpecificAddress,
    implementations?: ChainSpecificAddress[],
    ignoreInWatchMode?: string[],
  ): string[] {
    const addresses = [address, ...(implementations ?? [])]
    const relevantAbis = addresses.flatMap((add) => {
      const abiEntry = Object.entries(abis).find(
        ([key]) => key === add.toString(),
      )
      return abiEntry ? abiEntry[1] : []
    })

    const abi = deduplicateAbi(relevantAbis)
    const relevantAbi = skipIgnoredFunctions(abi, ignoreInWatchMode)

    return relevantAbi
  }

  private getHash(
    item: ContractSource,
    manualSourcePath: string | undefined,
  ): string | undefined {
    const hash = contractFlatteningHash(item)
    if (hash === undefined && manualSourcePath !== undefined) {
      return sha2_256bit(manualSourcePath)
    }

    return hash
  }
}
