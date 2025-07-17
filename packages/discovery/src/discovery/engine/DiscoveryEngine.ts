import type { Logger } from '@l2beat/backend-tools'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import chalk from 'chalk'
import type {
  AddressAnalyzer,
  AddressesWithTemplates,
  Analysis,
} from '../analysis/AddressAnalyzer'
import type { StructureConfig } from '../config/StructureConfig'
import {
  buildSharedModuleIndex,
  makeEntryStructureConfig,
} from '../config/structureUtils'
import type { IProvider } from '../provider/IProvider'
import { gatherReachableAddresses } from './gatherReachableAddresses'
import { removeAlreadyAnalyzed } from './removeAlreadyAnalyzed'
import { shouldSkip } from './shouldSkip'

export class DiscoveryEngine {
  private objectCount = 0

  constructor(
    private readonly addressAnalyzer: AddressAnalyzer,
    private readonly logger: Logger,
  ) {}

  reset() {
    this.objectCount = 0
  }

  async discover(
    provider: IProvider,
    config: StructureConfig,
  ): Promise<Analysis[]> {
    const sharedModuleIndex = buildSharedModuleIndex(config)
    const resolved: Record<string, Analysis> = {}
    let toAnalyze: AddressesWithTemplates = {}
    let depth = 0

    config.initialAddresses.forEach((address) => {
      toAnalyze[address.toString()] = new Set()
    })

    while (Object.keys(toAnalyze).length > 0) {
      removeAlreadyAnalyzed(toAnalyze, Object.values(resolved))

      // remove resolved addresses that need to be analyzed again
      for (const address of Object.keys(resolved)) {
        if (address in toAnalyze) {
          delete resolved[address]
        }
      }

      const relativesGraph = Object.fromEntries(
        Object.entries(resolved).map(([address, analysis]) =>
          analysis.type === 'Contract'
            ? [
                address,
                Object.keys(analysis.relatives).map(ChainSpecificAddress),
              ]
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
        if (!reachableAddresses.has(ChainSpecificAddress(address))) {
          delete resolved[address]
        }
      }

      // filter out addresses from `toAnalyze` that are no longer reachable from initial
      const leftToAnalyze = Object.entries(toAnalyze)
        .filter(([address]) =>
          reachableAddresses.has(ChainSpecificAddress(address)),
        )
        .map(([address, templates]) => ({
          address: ChainSpecificAddress(address),
          templates,
        }))
      toAnalyze = {}

      const total = this.objectCount + leftToAnalyze.length
      await Promise.all(
        leftToAnalyze.map(async ({ address, templates }) => {
          const skipReason = shouldSkip(
            address,
            config,
            sharedModuleIndex,
            depth,
            this.objectCount,
          )
          if (skipReason !== undefined) {
            const info = `${++this.objectCount}/${total}`
            const entries = [
              chalk.gray(info),
              chalk.gray(address),
              chalk.yellowBright('SKIP'),
              chalk.gray(skipReason),
            ]
            this.logger.info(entries.join(' '))
            return
          }

          const analysis = await this.addressAnalyzer.analyze(
            provider,
            address,
            makeEntryStructureConfig(config, address),
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

          this.objectCount += 1
          this.logObject(analysis, total)
        }),
      )

      depth++
    }

    const result = Object.values(resolved)
    this.checkErrors(result)
    this.reset()

    return result
  }

  private logObject(analysis: Analysis, total: number) {
    const info = `${this.objectCount}/${total}`
    if (analysis.type === 'EOA') {
      const entries = [chalk.gray(info), analysis.address, chalk.blue('EOA')]
      this.logger.info(entries.join(' '))
    } else if (analysis.type === 'Contract') {
      const entries = [
        chalk.gray(info),
        analysis.address,
        chalk.blue(analysis.name || '???'),
      ]
      this.logger.info(entries.join(' '))

      const logs: string[] = []
      if (analysis.proxyType) {
        logs.push(chalk.cyan(`P ${analysis.proxyType}`))
      }
      if (analysis.extendedTemplate) {
        logs.push(
          chalk.green(
            `T ${analysis.extendedTemplate.template} (${analysis.extendedTemplate.reason})`,
          ),
        )
      }
      for (const relative of Object.keys(analysis.relatives)) {
        logs.push(chalk.gray(`R ${relative}`))
      }
      for (const [key, value] of Object.entries(analysis.errors)) {
        logs.push(chalk.red(`E ${key} - ${value}`))
      }
      for (const [i, log] of logs.entries()) {
        const prefix = i === logs.length - 1 ? '└─' : '├─'
        const indent = ' '.repeat(6)
        this.logger.info(`${indent}${chalk.gray(prefix)} ${log}`)
      }
    }
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
      this.logger.info('')
      this.logger.error(`Errors during discovery: ${errorCount}`)
      for (const error of errorMsgs) {
        this.logger.error(error)
      }
    }
  }
}
