import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ContractSources } from '../source/SourceCodeService'

interface BlockchainReader {}

interface SourceCodeProvider {
  getSourceCode(address: ChainSpecificAddress): ContractSources
}

interface FieldHandler {}

interface Config {
  timestamp: number
  initialAddresses: ChainSpecificAddress[]
}

interface TemplateService { 
  findMatchingTemplate(address: ChainSpecificAddress, sources: string): Config
}

interface ProxyDetector {}

export class DiscoveryEngineV2 {
  constructor(
    public readonly blockchainReader: BlockchainReader,
    public readonly sourceCodeProvider: SourceCodeProvider,
    public readonly templateManager: TemplateService,
    public readonly fieldHandlers?: FieldHandler[],
    public readonly proxyDetectors?: ProxyDetector[]
  ) {}

  discover(config: Config) {
    const toDiscover = [...config.initialAddresses]
    for (const address of toDiscover) {
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
      // toDiscover.concat(references)
    }
  }
}
