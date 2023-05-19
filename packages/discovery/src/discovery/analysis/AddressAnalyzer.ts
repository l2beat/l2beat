import {
  ContractValue,
  EthereumAddress,
  UpgradeabilityParameters,
} from '@l2beat/shared'

import { ContractOverrides } from '../config/DiscoveryOverrides'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { HandlerExecutor } from '../handlers/HandlerExecutor'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { ProxyDetector } from '../proxies/ProxyDetector'
import { SourceCodeService } from '../source/SourceCodeService'
import { getCodeLink } from './getCodeLink'
import { getRelatives } from './getRelatives'

export type Analysis = AnalyzedContract | AnalyzedEOA

export interface AnalyzedContract {
  type: 'Contract'
  address: EthereumAddress
  name: string
  derivedName: string | undefined
  isVerified: boolean
  codeLink: string
  upgradeability: UpgradeabilityParameters
  values: Record<string, ContractValue>
  errors: Record<string, string>
  abis: Record<string, string[]>
  sources: Record<string, string>[]
}

export interface AnalyzedEOA {
  type: 'EOA'
  address: EthereumAddress
}

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
        name: overrides?.name ?? sources.name,
        derivedName: overrides?.name !== undefined ? sources.name : undefined,
        isVerified: sources.isVerified,
        address,
        codeLink: getCodeLink(address, proxy?.implementations),
        upgradeability: proxy?.upgradeability ?? { type: 'immutable' },
        values,
        errors,
        abis: sources.abis,
        sources: sources.files,
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
