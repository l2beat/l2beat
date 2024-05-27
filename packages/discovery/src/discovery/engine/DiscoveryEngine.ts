import { DiscoveryOutput } from '@l2beat/discovery-types'

import { EthereumAddress } from '@l2beat/shared-pure'
import { DiscoveryLogger } from '../DiscoveryLogger'
import {
  AddressAnalyzer,
  AddressesWithTemplates,
  Analysis,
} from '../analysis/AddressAnalyzer'
import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { gatherReachableAddresses } from './gatherReachableAddresses'
import { removeAlreadyAnalyzed } from './removeAlreadyAnalyzed'
import { shouldSkip } from './shouldSkip'

// Bump this value when the logic of discovery changes,
// causing a difference in discovery output

// Last change: add implementations to the output
export const DISCOVERY_LOGIC_VERSION = 4
export class DiscoveryEngine {
  constructor(
    private readonly addressAnalyzer: AddressAnalyzer,
    private readonly logger: DiscoveryLogger,
  ) {}

  async discover(
    config: DiscoveryConfig,
    blockNumber: number,
  ): Promise<Analysis[]> {
    let resolved: Analysis[] = []
    let toAnalyze: AddressesWithTemplates = {}
    const addressRelatives: Record<string, EthereumAddress[]> = {}
    let depth = 0
    let count = 0

    config.initialAddresses.forEach((address) => {
      toAnalyze[address.toString()] = new Set()
    })

    while (Object.keys(toAnalyze).length > 0) {
      removeAlreadyAnalyzed(toAnalyze, resolved)

      for (const address of Object.keys(toAnalyze)) {
        const skipReason = shouldSkip(
          EthereumAddress(address),
          config,
          depth,
          count,
        )
        if (skipReason !== undefined) {
          this.logger.log(skipReason)
          delete toAnalyze[address]
        } else {
          count++
        }
      }

      // remove resolved addresses that need to be analyzed again
      resolved = resolved.filter((x) => !(x.address.toString() in toAnalyze))
      for (const address of Object.keys(addressRelatives)) {
        const inResolved =
          resolved.find((x) => x.address.toString() === address) !== undefined
        if (!inResolved) {
          delete addressRelatives[address]
        }
      }

      // remove addresses to analyze that are no longer reachable from initial
      const reachableAddresses = gatherReachableAddresses(
        config.initialAddresses,
        addressRelatives,
      )
      const leftToAnalyze = Object.entries(toAnalyze).filter(([address]) =>
        reachableAddresses.has(EthereumAddress(address)),
      )
      toAnalyze = {}

      await Promise.all(
        leftToAnalyze.map(async ([_address, templates]) => {
          const address = EthereumAddress(_address)
          const bufferedLogger = new DiscoveryLogger({
            enabled: false,
            buffered: true,
          })

          bufferedLogger.log(`Analyzing ${address.toString()}`)
          const { analysis, relatives } = await this.addressAnalyzer.analyze(
            address,
            config.overrides.get(address),
            blockNumber,
            bufferedLogger,
            templates,
          )
          resolved.push(analysis)
          addressRelatives[address.toString()] = Object.keys(relatives).map(
            (v) => EthereumAddress(v),
          )

          for (const [address, suggestedTemplates] of Object.entries(
            relatives,
          )) {
            toAnalyze[address] = new Set([
              ...(toAnalyze[address] ?? []),
              ...suggestedTemplates,
            ])
          }

          bufferedLogger.flushToLogger(this.logger)
        }),
      )

      depth++
    }

    this.logger.flushServer(config.name)
    this.checkErrors(resolved)
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
