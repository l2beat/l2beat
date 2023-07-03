import { AddressAnalyzer, Analysis } from '../analysis/AddressAnalyzer'
import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { DiscoveryStack } from './DiscoveryStack'
import { shouldSkip } from './shouldSkip'

// Bump this value when the logic of discovery changes,
// causing a difference in discovery output
export const DISCOVERY_LOGIC_VERSION = 1
export class DiscoveryEngine {
  constructor(
    private readonly addressAnalyzer: AddressAnalyzer,
    private readonly logger: DiscoveryLogger,
  ) {}

  async discover(config: DiscoveryConfig, blockNumber: number) {
    const resolved: Analysis[] = []
    const stack = new DiscoveryStack()
    stack.push(config.initialAddresses, 0)

    while (!stack.isEmpty()) {
      const item = stack.pop()

      const reason = shouldSkip(item, config)
      if (reason) {
        this.logger.logSkip(item.address, reason)
        continue
      }

      this.logger.log(`Analyzing ${item.address.toString()}`)
      const { analysis, relatives } = await this.addressAnalyzer.analyze(
        item.address,
        config.overrides.get(item.address),
        blockNumber,
      )
      resolved.push(analysis)

      const newRelatives = stack.push(relatives, item.depth + 1)
      this.logger.logRelatives(newRelatives)
    }

    this.logger.flush(config.name)

    this.checkErrors(resolved)

    return resolved
  }

  private checkErrors(resolved: Analysis[]) {
    let errors = 0
    for (const analysis of resolved) {
      if (analysis.type === 'Contract') {
        errors += Object.keys(analysis.errors).length
      }
    }
    if (errors > 0) {
      this.logger.logError(`Errors during discovery: ${errors}`)
    }
  }
}
