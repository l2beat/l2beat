import { EthereumAddress } from '@l2beat/types'

import { detectProxy } from './detectProxy'
import { DiscoveryConfig } from './DiscoveryConfig'
import { getMetadata } from './getMetadata'
import { executeHandlers } from './handlers/executeHandlers'
import { getHandlers } from './handlers/getHandlers'
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
  config: DiscoveryConfig,
): Promise<{ analyzed: AnalyzedData; relatives: EthereumAddress[] }> {
  const proxyDetection = await detectProxy(provider, address)

  const metadata = await getMetadata(
    provider,
    address,
    proxyDetection?.implementations ?? [],
  )

  const overrides = config.overrides?.[address.toLowerCase()]
  const handlers = getHandlers(metadata.abi, overrides)
  const parameters = await executeHandlers(provider, address, handlers)

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

  const values: ContractParameters['values'] = {}
  const errors: ContractParameters['errors'] = {}
  for (const parameter of parameters) {
    if (parameter.value !== undefined) {
      values[parameter.field] = parameter.value
    }
    if (parameter.error !== undefined) {
      errors[parameter.field] = parameter.error
    }
  }

  return {
    analyzed: {
      name: metadata.name,
      address,
      upgradeability,
      values: Object.entries(values).length !== 0 ? values : undefined,
      errors: Object.entries(errors).length !== 0 ? errors : undefined,
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
