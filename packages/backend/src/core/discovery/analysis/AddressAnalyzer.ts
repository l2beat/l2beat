import { ContractParameters, EthereumAddress } from '@l2beat/shared'

import { ContractOverrides } from '../config/DiscoveryOverrides'
import { HandlerExecutor } from '../handlers/HandlerExecutor'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { ProxyDetector } from '../proxies/ProxyDetector'
import { ContractSources, SourceCodeService } from '../source/SourceCodeService'
import { DiscoveryLogger } from '../utils/DiscoveryLogger'
import { getCodeLink } from './getCodeLink'
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

export class AddressAnalyzer {
  constructor(
    private readonly provider: DiscoveryProvider,
    private readonly proxyDetector: ProxyDetector,
    private readonly sourceCodeService: SourceCodeService,
    private readonly handlerExecutor: HandlerExecutor,
    private readonly logger: DiscoveryLogger,
  ) {}

  async analyze(
    address: EthereumAddress,
    overrides: ContractOverrides | undefined,
    blockNumber: number,
  ): Promise<{ analysis: Analysis; relatives: EthereumAddress[] }> {
    const code = await this.provider.getCode(address, blockNumber)
    if (code.length === 0) {
      this.logger.logEoa()
      return { analysis: { type: 'EOA', address }, relatives: [] }
    }

    const proxy = await this.proxyDetector.detectProxy(
      address,
      blockNumber,
      overrides?.proxyType,
    )

    const sources = await this.sourceCodeService.getSources(
      address,
      proxy?.implementations,
    )

    this.logger.logName(sources.name)

    const { results, values, errors } = await this.handlerExecutor.execute(
      address,
      sources.abi,
      overrides,
      blockNumber,
    )

    return {
      analysis: {
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
      relatives: getRelatives(
        results,
        overrides?.ignoreRelatives,
        proxy?.relatives,
        proxy?.implementations,
      ),
    }
  }
}
