import { EthereumAddress } from '@l2beat/shared-pure'
import { DiscoveryLogger } from '../DiscoveryLogger'
import {
  AddressAnalyzer,
  AddressesWithTemplates,
  Analysis,
  AnalyzedContract,
} from '../analysis/AddressAnalyzer'
import { invertMeta, mergeContractMeta } from '../analysis/metaUtils'
import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { IProvider } from '../provider/IProvider'
import { gatherReachableAddresses } from './gatherReachableAddresses'
import { removeAlreadyAnalyzed } from './removeAlreadyAnalyzed'
import { shouldSkip } from './shouldSkip'

export class DiscoveryEngine {
  constructor(
    private readonly addressAnalyzer: AddressAnalyzer,
    private readonly logger: DiscoveryLogger,
  ) {}

  async discover(
    provider: IProvider,
    config: DiscoveryConfig,
  ): Promise<Analysis[]> {
    const resolved: Record<string, Analysis> = {}
    let toAnalyze: AddressesWithTemplates = {}
    let depth = 0
    let count = 0

    config.initialAddresses.forEach((address) => {
      toAnalyze[address.toString()] = new Set()
    })

    while (Object.keys(toAnalyze).length > 0) {
      removeAlreadyAnalyzed(toAnalyze, Object.values(resolved))

      for (const address of Object.keys(toAnalyze)) {
        const total = count + Object.keys(toAnalyze).length - 1
        const info = `${count}/${total}`

        const skipReason = shouldSkip(
          EthereumAddress(address),
          config,
          depth,
          count,
        )
        if (skipReason !== undefined) {
          this.logger.log(`${address} | ${info} | skipped: ${skipReason}`)
          delete toAnalyze[address]
        } else {
          count++
        }
      }

      // remove resolved addresses that need to be analyzed again
      for (const address of Object.keys(resolved)) {
        if (address in toAnalyze) {
          delete resolved[address]
        }
      }

      const relativesGraph = Object.fromEntries(
        Object.entries(resolved).map(([address, analysis]) =>
          analysis.type === 'Contract'
            ? [address, Object.keys(analysis.relatives).map(EthereumAddress)]
            : [address, undefined],
        ),
      )

      // find addresses that are still reachable from initial addresses
      const reachableAddresses = gatherReachableAddresses(
        config.initialAddresses,
        relativesGraph,
      )
      // remove addresses from `resolved` that are no longer reachable from initial
      for (const address of Object.keys(resolved)) {
        if (!reachableAddresses.has(EthereumAddress(address))) {
          delete resolved[address]
        }
      }
      // filter out addresses from `toAnalyze` that are no longer reachable from initial
      const leftToAnalyze = Object.entries(toAnalyze).filter(([address]) =>
        reachableAddresses.has(EthereumAddress(address)),
      )
      toAnalyze = {}

      await Promise.all(
        leftToAnalyze.map(async ([_address, templates]) => {
          const address = EthereumAddress(_address)
          const analysis = await this.addressAnalyzer.analyze(
            provider,
            address,
            config.overrides.get(address),
            config.typesFor(address.toString()),
            DiscoveryLogger.SILENT,
            templates,
          )
          resolved[address.toString()] = analysis
          if (analysis.type === 'Contract') {
            for (const [address, suggestedTemplates] of Object.entries(
              analysis.relatives,
            )) {
              toAnalyze[address] = new Set([
                ...(toAnalyze[address] ?? []),
                ...suggestedTemplates,
              ])
            }
          }

          const total = count + Object.keys(toAnalyze).length
          const info = `${count}/${total}`

          if (analysis.type === 'EOA') {
            this.logger.log(`${address} | ${info} | EOA`)
          } else if (analysis.type === 'Contract') {
            this.logger.log([address, info, analysis.name || '???'].join(' | '))
            if (analysis.proxyType) {
              this.logger.log(`  P ${analysis.proxyType})`)
            }
            if (analysis.extendedTemplate) {
              this.logger.log(
                `  T ${analysis.extendedTemplate.template} (${analysis.extendedTemplate.reason})`,
              )
            }
            for (const relative of Object.keys(analysis.relatives)) {
              this.logger.log(`  R ${relative}`)
            }
            for (const [key, value] of Object.entries(analysis.errors)) {
              this.logger.logError(`  E ${key} - ${value}`)
            }
          }
        }),
      )

      depth++
    }

    const analyzedContracts = Object.values(resolved).filter(
      (a): a is AnalyzedContract => a.type === 'Contract',
    )
    const inverted = invertMeta(analyzedContracts.map((c) => c.targetsMeta))
    Object.values(resolved).forEach((a) => {
      a.combinedMeta = mergeContractMeta(
        a.type === 'Contract' ? a.selfMeta : undefined,
        inverted[a.address.toString()],
      )
    })

    this.checkErrors(Object.values(resolved))
    return Object.values(resolved)
  }

  private checkErrors(resolved: Analysis[]): void {
    const errorMsgs = []
    let errorCount = 0
    for (const analysis of resolved) {
      if (
        analysis.type === 'Contract' &&
        Object.keys(analysis.errors).length > 0
      ) {
        const msgStart = `${analysis.address}`
        const errorMessages = Object.entries(analysis.errors).map(
          ([field, error]) => `  E ${field} - ${error}`,
        )

        errorCount += errorMessages.length
        errorMsgs.push([msgStart, ...errorMessages].join('\n'))
      }
    }
    if (errorCount > 0) {
      this.logger.log('')
      this.logger.logError(`Errors during discovery: ${errorCount}`)
      for (const error of errorMsgs) {
        this.logger.logError(error)
      }
    }
  }
}
