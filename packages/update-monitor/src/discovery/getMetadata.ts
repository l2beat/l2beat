import { AddressAnalyzer } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'

import { getAbi, JsonFragment } from './getAbi'

export interface ContractMetadata {
  name: string
  isEOA: boolean
  isVerified: boolean
  implementationVerified: boolean
  abi: JsonFragment[]
}

export async function getMetadata(
  addressAnalyzer: AddressAnalyzer,
  additionalAbiEntries: JsonFragment[],
  address: string,
  implementations: string[],
): Promise<ContractMetadata> {
  const [analysis, ...implementationAnalyses] = await Promise.all([
    addressAnalyzer.analyze(EthereumAddress(address)),
    ...implementations.map((address) =>
      addressAnalyzer.analyze(EthereumAddress(address)),
    ),
  ])

  if (analysis.type === 'EOA') {
    return {
      name: analysis.name,
      isEOA: true,
      isVerified: true,
      implementationVerified: true,
      abi: [],
    }
  } else {
    const name =
      implementationAnalyses.length === 1
        ? implementationAnalyses[0].name
        : analysis.name
    const abi = getAbi(
      analysis,
      ...implementationAnalyses,
      additionalAbiEntries,
    )
    return {
      name,
      isEOA: false,
      isVerified: analysis.verified,
      implementationVerified: implementationAnalyses.every(
        (x) => x.type === 'Contract' && x.verified,
      ),
      abi,
    }
  }
}
