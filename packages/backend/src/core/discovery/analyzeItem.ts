import {
  ContractParameters,
  ContractValue,
  EthereumAddress,
} from '@l2beat/shared'

import { ContractOverrides } from './config/DiscoveryOverrides'
import { executeHandlers } from './handlers/executeHandlers'
import { getHandlers } from './handlers/getHandlers'
import { DiscoveryProvider } from './provider/DiscoveryProvider'
import { detectProxy } from './proxies'
import { DiscoveryLogger } from './utils/DiscoveryLogger'
import { ContractMetadata, getMetadata } from './utils/getMetadata'

export interface AnalyzedData extends ContractParameters {
  meta: ContractMetadata
}

export async function analyzeItem(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  overrides: ContractOverrides | undefined,
  logger: DiscoveryLogger,
): Promise<{ analyzed: AnalyzedData; relatives: EthereumAddress[] }> {
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

  const meta = await getMetadata(
    provider,
    address,
    proxyDetection?.implementations ?? [],
  )

  if (meta.isEOA) {
    logger.eoa()
  } else {
    logger.name(meta.name)
  }

  const handlers = getHandlers(meta.abi, overrides, logger)
  const parameters = await executeHandlers(provider, address, handlers)

  const relatives = parameters
    .filter((x) => !x.ignoreRelative)
    .filter((x) => !overrides?.ignoreRelatives?.includes(x.field))
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
      name: meta.name,
      unverified:
        !meta.isVerified || !meta.implementationVerified ? true : undefined,
      address,
      code: !meta.isEOA
        ? getCodeLink(address, proxyDetection?.implementations)
        : undefined,
      upgradeability,
      values: Object.entries(values).length !== 0 ? values : undefined,
      errors: Object.entries(errors).length !== 0 ? errors : undefined,
      meta,
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
