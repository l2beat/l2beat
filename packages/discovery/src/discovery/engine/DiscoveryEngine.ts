import { DiscoveryOutput } from '@l2beat/discovery-types'

import { AddressAnalyzer, Analysis } from '../analysis/AddressAnalyzer'
import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { DiscoveryStack } from './DiscoveryStack'
import { shouldSkip } from './shouldSkip'

// Bump this value when the logic of discovery changes,
// causing a difference in discovery output

// Last change: add implementations to the output
export const DISCOVERY_LOGIC_VERSION = 3
export class DiscoveryEngine {
  constructor(
    private readonly addressAnalyzer: AddressAnalyzer,
    private readonly logger: DiscoveryLogger,
  ) {}

  async discover(
    config: DiscoveryConfig,
    blockNumber: number,
  ): Promise<Analysis[]> {
    const resolved: Analysis[] = []
    const stack = new DiscoveryStack()

    stack.push(config.initialAddresses, 0)

    while (!stack.isEmpty()) {
      const items = stack.popAll().filter((item) => {
        const reason = shouldSkip(item, config)
        if (reason) {
          this.logger.logSkip(item.address, reason)
          return false
        }
        return true
      })

      await Promise.all(
        items.map(async (item) => {
          const bufferedLogger = new DiscoveryLogger({
            enabled: false,
            buffered: true,
          })

          bufferedLogger.log(`Analyzing ${item.address.toString()}`)
          const { analysis, relatives } = await this.addressAnalyzer.analyze(
            item.address,
            config.overrides.get(item.address),
            blockNumber,
            bufferedLogger,
          )
          resolved.push(analysis)

          const newRelatives = stack.push(relatives, item.depth + 1)
          bufferedLogger.logRelatives(newRelatives)
          bufferedLogger.flushToLogger(this.logger)
        }),
      )
    }

    this.logger.flushServer(config.name)

    this.checkErrors(resolved)

    this.logger.log(`Address count = ${stack.getAddressCount()}`)

    return resolved
  }

  async hasOutputChanged(
    config: DiscoveryConfig,
    prevOutput: DiscoveryOutput,
    blockNumber: number,
  ): Promise<boolean> {
    const contracts = prevOutput.contracts

    const contractsChanged = await Promise.all(
      contracts.map(async (contract) => {
        const overrides = config.overrides.get(contract.address)

        return await this.addressAnalyzer.hasContractChanged(
          contract,
          overrides,
          blockNumber,
          prevOutput.abis,
        )
      }),
    )

    if (contractsChanged.some((x) => x)) {
      this.logger.log('Some contracts changed')
      return true
    }

    const eoas = prevOutput.eoas
    const eoasChanged = await Promise.all(
      eoas.map(async (eoa) => {
        return await this.addressAnalyzer.hasEoaBecomeContract(eoa, blockNumber)
      }),
    )

    if (eoasChanged.some((x) => x)) {
      this.logger.log('Some EOAs became contracts')
      return true
    }

    return false
  }

  private checkErrors(resolved: Analysis[]): void {
    const errorMsgs = []
    let errorCount = 0
    for (const analysis of resolved) {
      if (
        analysis.type === 'Contract' &&
        Object.keys(analysis.errors).length > 0
      ) {
        const msgStart = `${analysis.name}(${analysis.address.toString()}): {`
        const msgEnd = '\n}'
        const errorMessages = Object.entries(analysis.errors).map(
          ([field, error]) => `\n\t${field}: ${error}`,
        )

        errorCount += errorMessages.length
        errorMsgs.push([msgStart, ...errorMessages, msgEnd].join(''))
      }
    }
    if (errorCount > 0) {
      this.logger.logError(`Errors during discovery: ${errorCount}`)
      for (const error of errorMsgs) {
        this.logger.logError(error)
      }
    }
  }
}
