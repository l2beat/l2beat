import { ContractParameters, EthereumAddress } from '@l2beat/shared'

import { ContractOverrides } from '../config/DiscoveryOverrides'
import { executeHandlers } from '../handlers/executeHandlers'
import { getHandlers } from '../handlers/getHandlers'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { ProxyDetector } from '../proxies/ProxyDetector'
import { ContractSources, SourceCodeService } from '../source/SourceCodeService'
import { DiscoveryLogger } from '../utils/DiscoveryLogger'
import { getRelatives } from './getRelatives'

export interface AnalyzedData extends ContractParameters {
  isEOA: boolean
  meta: ContractSources
}

export async function analyzeItem(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  overrides: ContractOverrides | undefined,
  logger: DiscoveryLogger,
): Promise<{ analyzed: AnalyzedData; relatives: EthereumAddress[] }> {
  const code = await provider.getCode(address)
  if (code.length === 0) {
    logger.eoa()
    return eoa(address)
  }

  const proxyDetector = new ProxyDetector(provider)
  const proxy = await proxyDetector.detectProxy(address, overrides?.proxyType)

  if (proxy) {
    logger.proxyDetected(proxy.upgradeability.type)
  } else if (overrides?.proxyType) {
    logger.proxyDetectionFailed(overrides.proxyType)
  }

  const sourceCodeService = new SourceCodeService(provider)
  const meta = await sourceCodeService.getSources(
    address,
    proxy?.implementations,
  )

  logger.name(meta.name)

  const handlers = getHandlers(meta.abi, overrides, logger)
  const parameters = await executeHandlers(provider, address, handlers)

  const relatives = getRelatives(
    parameters,
    overrides?.ignoreRelatives,
    proxy?.relatives,
    proxy?.implementations,
  )

  const upgradeability = proxy?.upgradeability ?? { type: 'immutable' }

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
      isEOA: false,
      unverified: !meta.isVerified ? true : undefined,
      address,
      code: getCodeLink(address, proxy?.implementations),
      upgradeability,
      values: Object.entries(values).length !== 0 ? values : undefined,
      errors: Object.entries(errors).length !== 0 ? errors : undefined,
      meta,
    },
    relatives,
  }
}

function eoa(address: EthereumAddress): {
  analyzed: AnalyzedData
  relatives: EthereumAddress[]
} {
  return {
    analyzed: {
      name: 'EOA',
      isEOA: true,
      unverified: undefined,
      address,
      code: undefined,
      upgradeability: { type: 'immutable' },
      values: undefined,
      errors: undefined,
      meta: {
        name: 'EOA',
        isVerified: true,
        abi: [],
        abis: {},
        files: [],
      },
    },
    relatives: [],
  }
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
