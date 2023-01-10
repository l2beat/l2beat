import { EthereumAddress } from '@l2beat/types'

import { DiscoveryConfig } from './DiscoveryConfig'
import { DiscoveryLogger } from './DiscoveryLogger'
import { getMetadata } from './getMetadata'
import { executeHandlers } from './handlers/executeHandlers'
import { getHandlers } from './handlers/getHandlers'
import { DiscoveryProvider } from './provider/DiscoveryProvider'
import { detectProxy } from './proxies'
import { ContractParameters, ContractValue } from './types'

export interface AnalyzedData extends ContractParameters {
  meta: {
    isEOA: boolean
    verified: boolean
    implementationVerified: boolean
    abi: string[]
    abis: Record<string, string[]>
  }
}

export async function analyzeItem(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  config: DiscoveryConfig,
  logger: DiscoveryLogger,
): Promise<{ analyzed: AnalyzedData; relatives: EthereumAddress[] }> {
  const overrides = config.overrides?.[address.toString()]

  const proxyDetection = await detectProxy(
    provider,
    address,
    overrides?.proxyType,
  )

  if (proxyDetection) {
    logger.proxyDetected(proxyDetection.upgradeability.type)
  } else if (overrides?.proxyType) {
    logger.proxyDetectionFailed(overrides.proxyType)
  }

  const metadata = await getMetadata(
    provider,
    address,
    proxyDetection?.implementations ?? [],
  )

  if (metadata.isEOA) {
    logger.eoa()
  } else {
    logger.name(metadata.name)
  }

  const handlers = getHandlers(metadata.abi, overrides, logger)
  const parameters = await executeHandlers(provider, address, handlers)

  const relatives = parameters
    .flatMap((x) => getRelatives(x.value))
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
      unverified:
        !metadata.isVerified || !metadata.implementationVerified
          ? true
          : undefined,
      address,
      code: !metadata.isEOA
        ? getCodeLink(address, proxyDetection?.implementations)
        : undefined,
      upgradeability,
      values: Object.entries(values).length !== 0 ? values : undefined,
      errors: Object.entries(errors).length !== 0 ? errors : undefined,
      meta: {
        isEOA: metadata.isEOA,
        verified: metadata.isVerified,
        implementationVerified: metadata.implementationVerified,
        abi: metadata.abi,
        abis: metadata.abis,
      },
    },
    relatives,
  }
}

function getRelatives(value: ContractValue | undefined): EthereumAddress[] {
  if (Array.isArray(value)) {
    return value.flatMap(getRelatives)
  } else if (typeof value === 'object') {
    return Object.values(value).flatMap(getRelatives)
  } else if (typeof value === 'string') {
    try {
      return [EthereumAddress(value)]
    } catch {
      return []
    }
  }
  return []
}

function getCodeLink(
  address: EthereumAddress,
  implementations: EthereumAddress[] | undefined,
) {
  const addresses = [address]
  if (implementations) {
    addresses.push(...implementations)
  }
  return `https://etherscan.deth.net/address/${addresses.join(',')}`
}
