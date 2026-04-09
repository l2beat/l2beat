import type { Logger } from '@l2beat/backend-tools'
import { ChainSpecificAddress, type UnixTime } from '@l2beat/shared-pure'
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
import type { AllProviders } from '../provider/AllProviders'
import {
  type DiscoveryCounter,
  SimpleDiscoveryCounter,
} from './DiscoveryCounter'
import { gatherReachableAddresses } from './gatherReachableAddresses'
import { removeAlreadyAnalyzed } from './removeAlreadyAnalyzed'
import { shouldSkip } from './shouldSkip'

export interface DiscoveryEngineOptions {
  /**
   * Hard timeout per contract analysis, in milliseconds. If a single
   * `addressAnalyzer.analyze()` call doesn't complete within this many ms,
   * it is aborted and the address is marked as errored. This protects the
   * BFS from a single misbehaving RPC call (e.g. a contract that returns
   * "invalid jump destination" and triggers an infinite retry loop).
   *
   * Set to `undefined` (default) to disable.
   */
  analyzeTimeoutMs?: number
}

export class DiscoveryEngine {
  /**
   * Addresses that the BFS wanted to analyze but had to skip because the
   * `maxAddresses` cap was already reached. Populated by `discover()` and
   * read by callers that want to surface a "you may be missing things"
   * warning at the end of a run.
   */
  public skippedDueToCap: ChainSpecificAddress[] = []

  /**
   * Addresses whose analysis was aborted because it exceeded
   * `analyzeTimeoutMs`. Surfaced in the end-of-run summary so the user can
   * see what was lost.
   */
  public timedOut: ChainSpecificAddress[] = []

  constructor(
    private readonly addressAnalyzer: AddressAnalyzer,
    private readonly logger: Logger,
    private readonly options: DiscoveryEngineOptions = {},
  ) {}

  async discover(
    allProviders: AllProviders,
    config: StructureConfig,
    timestamp: UnixTime,
    counter: DiscoveryCounter = new SimpleDiscoveryCounter(),
  ): Promise<Analysis[]> {
    this.timedOut = []
    this.skippedDueToCap = []
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

      const total = counter.getCount() + leftToAnalyze.length

      await Promise.all(
        leftToAnalyze.map(async ({ address, templates }) => {
          const sharedItem = sharedModuleIndex[address]
          if (sharedItem) {
            resolved[address.toString()] = {
              name: sharedItem.name,
              type: 'Reference',
              address: sharedItem.address,
              targetType: sharedItem.type,
              targetProject: sharedItem.project,
            }
            return
          }
          if (config.entrypoints?.[address] !== undefined) {
            const entrypoint = config.entrypoints[address]
            if (entrypoint.project !== config.name) {
              resolved[address] = {
                name: entrypoint.name,
                type: 'Reference',
                address: address,
                targetType: entrypoint.type,
                targetProject: entrypoint.project,
              }
              return
            }
          }
          // Atomically reserve a slot before any work happens. This makes
          // `maxAddresses` a strict cap: only N successful analyses ever
          // start, regardless of parallel overshoot. Pre-cap skip reasons
          // (depth, ignored, sharedModule) still consume a slot for X/Y
          // display continuity.
          const slot = counter.increment()
          const skipReason = shouldSkip(
            address,
            config,
            sharedModuleIndex,
            depth,
            slot,
          )
          if (skipReason !== undefined) {
            if (skipReason.startsWith('total ')) {
              this.skippedDueToCap.push(address)
            }
            const info = `${slot}/${total}`
            const entries = [
              chalk.gray(info),
              chalk.gray(address),
              chalk.yellowBright('SKIP'),
              chalk.gray(skipReason),
            ]
            this.logger.info(entries.join(' '))
            return
          }

          const chain = ChainSpecificAddress.longChain(address)
          const provider = await allProviders.get(chain, timestamp)
          try {
            const analysis = await this.runAnalyzeWithTimeout(
              provider,
              address,
              makeEntryStructureConfig(config, address),
              templates,
            )
            if (analysis === 'TIMED_OUT') {
              this.timedOut.push(address)
              const info = `${slot}/${total}`
              const entries = [
                chalk.gray(info),
                chalk.gray(address),
                chalk.redBright('TIMEOUT'),
                chalk.gray(`> ${this.options.analyzeTimeoutMs}ms`),
              ]
              this.logger.info(entries.join(' '))
              return
            }
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

            // counter was already incremented above; do not double-count
            this.logObject(analysis, total, counter)
          } catch (error) {
            this.logAnalysisError(address, error)
            throw error
          }
        }),
      )

      depth++
    }

    const result = Object.values(resolved)
    this.checkErrors(result)

    return result
  }

  /**
   * Wraps `addressAnalyzer.analyze()` in a hard timeout. Returns
   * `'TIMED_OUT'` instead of throwing so the BFS can record the address and
   * continue with the rest of the queue. The unresolved analyze promise is
   * left to detach (we cannot reliably cancel an in-flight RPC call), but
   * the BFS no longer waits for it.
   */
  private async runAnalyzeWithTimeout(
    provider: import('../provider/IProvider').IProvider,
    address: ChainSpecificAddress,
    structureConfig: ReturnType<typeof makeEntryStructureConfig>,
    templates: Set<string>,
  ): Promise<Analysis | 'TIMED_OUT'> {
    const analyzePromise = this.addressAnalyzer.analyze(
      provider,
      address,
      structureConfig,
      templates,
    )

    const timeoutMs = this.options.analyzeTimeoutMs
    if (timeoutMs === undefined) {
      return analyzePromise
    }

    let timeoutHandle: NodeJS.Timeout | undefined
    const timeoutPromise = new Promise<'TIMED_OUT'>((resolve) => {
      timeoutHandle = setTimeout(() => resolve('TIMED_OUT'), timeoutMs)
    })

    try {
      return await Promise.race([analyzePromise, timeoutPromise])
    } finally {
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle)
      }
    }
  }

  private logObject(
    analysis: Analysis,
    total: number,
    counter: DiscoveryCounter,
  ) {
    const info = `${counter.getCount()}/${total}`
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

  private logAnalysisError(
    address: ChainSpecificAddress,
    error: unknown,
  ): void {
    this.logger.error(`Error during entry analysis - ${address}`, {
      address,
      error,
    })
  }
}
