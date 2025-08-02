import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ContractSources } from '../source/SourceCodeService'

interface BlockchainReader {}

interface SourceCodeProvider {
  getSourceCode(address: ChainSpecificAddress): ContractSources
}

interface FieldHandler {}

interface AddressAnalysisV2 {
  references: ChainSpecificAddress[]
}

interface Config {
  timestamp: number
  initialAddresses: ChainSpecificAddress[]
}

interface TemplateService {
  findMatchingTemplate(address: ChainSpecificAddress, sources: string): Config
}

interface ProxyDetector {}

export class AddressAnalyzerV2 {
  constructor(
    public readonly sourceCodeProvider: SourceCodeProvider,
    public readonly templateManager: TemplateService,
    public readonly fieldHandlers?: FieldHandler[],
    public readonly proxyDetectors?: ProxyDetector[],
  ) {}

  analyze(address: ChainSpecificAddress): AddressAnalysisV2 {
    // TODO: detect proxy
    const sources = this.sourceCodeProvider.getSourceCode(address)
    const template = this.templateManager.findMatchingTemplate(address, sources)
    // TODO: Execute handlers
    // const functions = [] //sources.abi.functions
    // for (const function of functions) {
    //   for (const handler of this.fieldHandlers) {
    //     ...
    //   }
    // }

    // gather references
    return { references: [] }
  }
}
export class DiscoveryEngineV2 {
  constructor(
    public readonly blockchainReader: BlockchainReader,
    public readonly addressAnalyzer: AddressAnalyzerV2,
  ) {}

  async discover(config: Config) {
    const pending = new Set(config.initialAddresses)
    const analyzed = new Set<ChainSpecificAddress>()
    while (toAnalyze.size > 0) {
      const toAnalyze = Array.from(pending)
      pending.clear()
      await Promise.all(
        toAnalyze.map(async (address) => {
          const analysis = await this.addressAnalyzer.analyze(address)
          const newAddresses = analysis.references.filter(
            (a) => !toAnalyze.has(a) && !analyzed.has(a),
          )
          pending.add(...newAddresses)
        }),
      )
      const analysis = this.addressAnalyzer.analyze(address)
      analysis.references.filter((a) => !analyzed.has(a))
    }
  }
}
