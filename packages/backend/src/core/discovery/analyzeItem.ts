import { EthereumAddress } from '@l2beat/types'

import { detectProxy } from './detectProxy'
import { DiscoveryOptions } from './DiscoveryOptions'
import { getMetadata } from './getMetadata'
import { getParameters } from './getParameters'
import { DiscoveryProvider } from './provider/DiscoveryProvider'
import { ContractParameters } from './types'

export interface AnalyzedData extends ContractParameters {
  meta: {
    isEOA: boolean
    verified: boolean
    implementationVerified: boolean
    abi: string[]
  }
}

export async function analyzeItem(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  options: DiscoveryOptions,
): Promise<{ analyzed: AnalyzedData; relatives: EthereumAddress[] }> {
  const proxyDetection = await detectProxy(provider, address)

  const metadata = await getMetadata(
    provider,
    options.addAbis[address.toString()] ?? [],
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
    .flatMap((x) => {
      if (typeof x === 'string') {
        try {
          return [EthereumAddress(x)]
          // eslint-disable-next-line no-empty
        } catch {}
      }
      return []
    })
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
