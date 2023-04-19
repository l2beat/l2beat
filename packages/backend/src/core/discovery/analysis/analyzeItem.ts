import { ContractParameters, EthereumAddress } from '@l2beat/shared'

import { ContractOverrides } from '../config/DiscoveryOverrides'
import { HandlerExecutor } from '../handlers/HandlerExecutor'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { ProxyDetector } from '../proxies/ProxyDetector'
import { ContractSources, SourceCodeService } from '../source/SourceCodeService'
import { DiscoveryLogger } from '../utils/DiscoveryLogger'
import { getRelatives } from './getRelatives'

export interface AnalyzedContract extends ContractParameters {
  type: 'Contract'
  sources: ContractSources
}

export interface AnalyzedEOA {
  type: 'EOA'
  address: EthereumAddress
}

export type Analysis = AnalyzedContract | AnalyzedEOA

export async function analyzeItem(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  overrides: ContractOverrides | undefined,
  logger: DiscoveryLogger,
): Promise<{ analyzed: Analysis; relatives: EthereumAddress[] }> {
  const code = await provider.getCode(address)
  if (code.length === 0) {
    logger.eoa()
    return { analyzed: { type: 'EOA', address }, relatives: [] }
  }

  const proxyDetector = new ProxyDetector(provider, logger)
  const proxy = await proxyDetector.detectProxy(address, overrides?.proxyType)

  const sourceCodeService = new SourceCodeService(provider)
  const sources = await sourceCodeService.getSources(
    address,
    proxy?.implementations,
  )

  logger.name(sources.name)

  const handlerExecutor = new HandlerExecutor(provider, logger)
  const { results, values, errors } = await handlerExecutor.execute(
    address,
    sources.abi,
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
      type: 'Contract',
      name: sources.name,
      unverified: !sources.isVerified ? true : undefined,
      address,
      code: getCodeLink(address, proxy?.implementations),
      upgradeability: proxy?.upgradeability ?? { type: 'immutable' },
      values,
      errors,
      sources,
    },
    relatives,
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
