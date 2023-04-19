import { ContractParameters, EthereumAddress } from '@l2beat/shared'

import { ContractOverrides } from '../config/DiscoveryOverrides'
import { HandlerExecutor } from '../handlers/HandlerExecutor'
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

  const proxyDetector = new ProxyDetector(provider, logger)
  const proxy = await proxyDetector.detectProxy(address, overrides?.proxyType)

  const sourceCodeService = new SourceCodeService(provider)
  const meta = await sourceCodeService.getSources(
    address,
    proxy?.implementations,
  )

  logger.name(meta.name)

  const handlerExecutor = new HandlerExecutor(provider, logger)
  const { results, values, errors } = await handlerExecutor.execute(
    address,
    meta.abi,
    overrides,
  )

  const relatives = getRelatives(
    results,
    overrides?.ignoreRelatives,
    proxy?.relatives,
    proxy?.implementations,
  )

  return {
    analyzed: {
      name: meta.name,
      isEOA: false,
      unverified: !meta.isVerified ? true : undefined,
      address,
      code: getCodeLink(address, proxy?.implementations),
      upgradeability: proxy?.upgradeability ?? { type: 'immutable' },
      values,
      errors,
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
