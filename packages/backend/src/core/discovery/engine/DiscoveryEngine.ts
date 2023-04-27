import { AddressAnalyzer, Analysis } from '../analysis/AddressAnalyzer'
import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { DiscoveryLogger } from '../utils/DiscoveryLogger'
import { DiscoveryStack } from './DiscoveryStack'
import { shouldSkip } from './shouldSkip'

export class DiscoveryEngine {
  constructor(
    private readonly addressAnalyzer: AddressAnalyzer,
    private readonly logger: DiscoveryLogger,
  ) {}

  async discover(config: DiscoveryConfig) {
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
      )
      resolved.push(analysis)

      const newRelatives = stack.push(relatives, item.depth + 1)
      this.logger.logRelatives(newRelatives)
    }

    return resolved
  }
}
