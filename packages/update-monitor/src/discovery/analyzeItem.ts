import { AddressAnalyzer } from '@l2beat/common'
import { providers, utils } from 'ethers'

import { ProxyDetection } from '../common/proxies/types'
import { ContractParameters } from '../types'
import { detectProxy } from './detectProxy'
import { DiscoveryOptions } from './DiscoveryOptions'
import { JsonFragment } from './getAbi'
import { getMetadata } from './getMetadata'
import { getParameters } from './getParameters'

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
  const overrideImplementations = options.overrideImplementations[address]
  const overrideDetection: ProxyDetection | undefined =
    overrideImplementations && {
      implementations: overrideImplementations,
      relatives: [],
      upgradeability: {
        type: 'custom proxy',
        implementations: overrideImplementations,
      },
    }
  const proxyDetection =
    overrideDetection ?? (await detectProxy(provider, address))

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
