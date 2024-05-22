import { DiscoveryOutput } from '@l2beat/discovery-types'

import { EthereumAddress } from '@l2beat/shared-pure'
import { DiscoveryLogger } from '../DiscoveryLogger'
import {
  AddressAnalyzer,
  AddressesWithTemplates,
  Analysis,
} from '../analysis/AddressAnalyzer'
import { DiscoveryConfig } from '../config/DiscoveryConfig'
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
    const resolved: Analysis[] = []
    let relativesWithTemplates: AddressesWithTemplates = {}
    let depth = 0
    let count = 0

    config.initialAddresses.forEach((address) => {
      relativesWithTemplates[address.toString()] = new Set()
    })

    while (Object.keys(relativesWithTemplates).length > 0) {
      const toAnalyze: AddressesWithTemplates = {}

      for (const [_address, templates] of Object.entries(
        relativesWithTemplates,
      )) {
        const address = EthereumAddress(_address)
        const alreadyAnalyzed = resolved.find((x) => x.address === address)
        if (alreadyAnalyzed === undefined) {
          toAnalyze[_address] = templates
          continue
        }

        // We have already analyzed this address:

        if (templates.size === 0) {
          // We have nothing new to suggest
          continue // don't analyze again
        }
        if (alreadyAnalyzed.type === 'EOA') {
          // Templates suggestions don't make sense for EOAs
          continue // don't analyze again
        }
        if (alreadyAnalyzed.extendedTemplate?.reason === 'byExtends') {
          // if already analyzed template was explicitly set, we always
          // ignore all templates suggested by referrers
          continue // don't analyze again
        }
        const reason = shouldSkip(address, config, depth, count)
        if (reason) {
          this.logger.logSkip(address, reason)
          continue
        }

        // - was it analyzed with exactly the same template?
        if (templates.size === 1) {
          const template = Array.from(templates)[0]
          if (alreadyAnalyzed.extendedTemplate?.template === template) {
            continue // don't analyze again
          }
        }

        if (alreadyAnalyzed.extendedTemplate !== undefined) {
          // There was a different template already used in analysis
          alreadyAnalyzed.errors['@template'] =
            `Additional templates suggested: ${Array.from(templates).join(
              ', ',
            )}`
          continue // don't analyze again
        }

        // We have already analyzed this address without template
        // so let's remove it from resolved and analyze again with
        // suggested templates
        resolved.splice(resolved.indexOf(alreadyAnalyzed), 1)
        toAnalyze[_address] = templates
      }

      relativesWithTemplates = {}

      await Promise.all(
        Object.entries(toAnalyze).map(async ([_address, templates]) => {
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

          count += Object.keys(relatives).length
          for (const [address, suggestedTemplates] of Object.entries(
            relatives,
          )) {
            relativesWithTemplates[address] = new Set([
              ...(relativesWithTemplates[address] ?? []),
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
