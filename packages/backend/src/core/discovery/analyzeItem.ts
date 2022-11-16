import { AddressAnalyzer } from '@l2beat/common'
import { providers, utils } from 'ethers'

import { detectProxy } from './detectProxy'
import { DiscoveryOptions } from './DiscoveryOptions'
import { JsonFragment } from './getAbi'
import { getMetadata } from './getMetadata'
import { getParameters } from './getParameters'
import { ContractParameters } from './types'

export interface AnalyzedData extends ContractParameters {
  meta: {
    isEOA: boolean
    verified: boolean
    implementationVerified: boolean
    abi: JsonFragment[]
  }
}

export async function analyzeItem(
  provider: providers.Provider,
  addressAnalyzer: AddressAnalyzer,
  address: string,
  options: DiscoveryOptions,
): Promise<{ analyzed: AnalyzedData; relatives: string[] }> {
  const proxyDetection = await detectProxy(provider, address, options)

  const metadata = await getMetadata(
    addressAnalyzer,
    options.addAbis[address] ?? [],
    address,
    proxyDetection?.implementations ?? [],
  )

  const parameters = await getParameters(
    metadata.abi,
    address,
    provider,
    options,
  )

  const relatives = parameters
    .flatMap((x) =>
      Array.isArray(x.value) ? (x.value as unknown[]) : [x.value],
    )
    .filter((x): x is string => typeof x === 'string' && utils.isAddress(x))
    .concat(proxyDetection?.relatives ?? [])
    .filter((x) => !proxyDetection?.implementations.includes(x))
    .filter((x, i, a) => a.indexOf(x) === i)

  const upgradeability = proxyDetection?.upgradeability ?? { type: 'immutable' }

  return {
    analyzed: {
      name: metadata.name,
      address,
      upgradeability,
      values: Object.fromEntries(parameters.map((x) => [x.name, x.value])),
      meta: {
        isEOA: metadata.isEOA,
        verified: metadata.isVerified,
        implementationVerified: metadata.implementationVerified,
        abi: metadata.abi,
      },
    },
    relatives,
  }
}
