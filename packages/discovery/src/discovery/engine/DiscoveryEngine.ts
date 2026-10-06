import type { Logger } from '@l2beat/backend-tools'
import {
  assert,
  ChainSpecificAddress,
  type UnixTime,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import type {
  AddressAnalyzer,
  AddressesWithTemplates,
  Analysis,
} from '../analysis/AddressAnalyzer'
import type { StructureConfig } from '../config/StructureConfig'
import { makeEntryStructureConfig } from '../config/structureUtils'
import type { AllProviders } from '../provider/AllProviders'
import {
  type DiscoveryCounter,
  SimpleDiscoveryCounter,
} from './DiscoveryCounter'
import { gatherReachableAddresses } from './gatherReachableAddresses'
import { removeAlreadyAnalyzed } from './removeAlreadyAnalyzed'
import { shouldSkip } from './shouldSkip'

export interface AddressStats {
  discovered: number
  skipped: number
}

/**
 * Runs between two levels of discovery: every analysis of a level has
 * finished and none of the next level has started. It gets every analysis
 * so far and may write template files. The engine then reads the templates
 * again, analyzes again each address whose template changed under it and
 * calls it again, until it changes nothing; only then does it follow the
 * level's relatives, as the templates now make them. `l2b discover --ai`
 * templatizes here.
 */
export type BetweenLevels = (analyses: readonly Analysis[]) => Promise<void>

export class DiscoveryEngine {
  constructor(
    private readonly addressAnalyzer: AddressAnalyzer,
    private readonly logger: Logger,
  ) {}

  async discover(
    allProviders: AllProviders,
    config: StructureConfig,
    timestamp: UnixTime,
    counter: DiscoveryCounter = new SimpleDiscoveryCounter(),
    betweenLevels?: BetweenLevels,
  ): Promise<{ analyses: Analysis[]; stats: AddressStats }> {
    const resolved: Record<string, Analysis> = {}
    // The templates each address was analyzed with, to analyze it again alike.
    const suggested: Record<string, Set<string>> = {}
    let toAnalyze: AddressesWithTemplates = {}
    let depth = 0
    let skipped = 0

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

      const reachableAddresses = pruneUnreachable(
        resolved,
        config.initialAddresses,
      )

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
      // The addresses analyzed in this level, whose relatives are the next one.
      const analyzed: ChainSpecificAddress[] = []

      await Promise.all(
        leftToAnalyze.map(async ({ address, templates }) => {
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
          const skipReason = shouldSkip(
            address,
            config,
            depth,
            counter.getCount(),
          )
          if (skipReason !== undefined) {
            if (skipReason.startsWith('total ')) {
              skipped++
            }
            const info = `↓${depth} ${counter.increment()}/${total}`
            const entries = [
              chalk.gray(info),
              chalk.gray(address),
              chalk.yellowBright('SKIP'),
              chalk.gray(skipReason),
            ]
            this.logger.info(entries.join(' '))
            return
          }

          const analysis = await this.analyze(
            allProviders,
            config,
            timestamp,
            address,
            templates,
          )
          resolved[address.toString()] = analysis
          suggested[address.toString()] = templates
          analyzed.push(address)
          counter.increment()
          this.logObject(analysis, `↓${depth} ${counter.getCount()}/${total}`)
        }),
      )

      // The relatives an address of an earlier level, analyzed again, had
      // already followed: following them again would only skip again what
      // was skipped, and count it again.
      const followed: Record<string, AddressesWithTemplates> = {}
      if (betweenLevels !== undefined) {
        const replaced = await this.settleTemplates(
          betweenLevels,
          resolved,
          (address) =>
            this.analyze(
              allProviders,
              config,
              timestamp,
              address,
              suggested[address.toString()] ?? new Set(),
            ),
          `↓${depth} again`,
        )
        for (const [address, before] of Object.entries(replaced)) {
          if (!analyzed.includes(before.address)) {
            analyzed.push(before.address)
            if (before.type === 'Contract') {
              followed[address] = before.relatives
            }
          }
        }
      }

      for (const address of analyzed) {
        const analysis = resolved[address.toString()]
        if (analysis?.type !== 'Contract') {
          continue
        }
        const before = followed[address.toString()] ?? {}
        for (const [address, suggestedTemplates] of Object.entries(
          analysis.relatives,
        )) {
          if (sameTemplates(before[address], suggestedTemplates)) {
            continue
          }
          toAnalyze[address] = new Set([
            ...(toAnalyze[address] ?? []),
            ...suggestedTemplates,
          ])
        }
      }

      depth++
    }

    // An analysis made again between levels may have dropped relatives that
    // no level after it pruned.
    pruneUnreachable(resolved, config.initialAddresses)

    const analyses = Object.values(resolved)
    this.checkErrors(analyses)

    return {
      analyses,
      stats: { discovered: analyses.length, skipped },
    }
  }

  private async analyze(
    allProviders: AllProviders,
    config: StructureConfig,
    timestamp: UnixTime,
    address: ChainSpecificAddress,
    templates: Set<string>,
  ): Promise<Analysis> {
    const chain = ChainSpecificAddress.longChain(address)
    const provider = await allProviders.get(chain, timestamp)
    try {
      return await this.addressAnalyzer.analyze(
        provider,
        address,
        makeEntryStructureConfig(config, address),
        templates,
      )
    } catch (error) {
      this.logAnalysisError(address, error)
      throw error
    }
  }

  /**
   * Calls `betweenLevels` and analyzes again every address whose template
   * changed under it, until a call changes none. An address keeps its place
   * in `resolved`, and it counts against neither `maxAddresses` nor
   * `maxDepth` again. Returns, for each address analyzed again, the
   * analysis it had before this level's calls.
   */
  private async settleTemplates(
    betweenLevels: BetweenLevels,
    resolved: Record<string, Analysis>,
    analyze: (address: ChainSpecificAddress) => Promise<Analysis>,
    info: string,
  ): Promise<Record<string, Analysis>> {
    const replaced: Record<string, Analysis> = {}
    for (;;) {
      await betweenLevels(Object.values(resolved))
      this.addressAnalyzer.reloadTemplates()
      const changed = Object.values(resolved).filter(
        (analysis) =>
          analysis.type !== 'Reference' &&
          this.addressAnalyzer.templateChanged(analysis),
      )
      if (changed.length === 0) {
        return replaced
      }
      for (const analysis of changed) {
        replaced[analysis.address.toString()] ??= analysis
      }
      await Promise.all(
        changed.map(async ({ address }) => {
          const analysis = await analyze(address)
          // Without this, a disagreement between `analyze` and
          // `templateChanged` would analyze the address forever.
          assert(
            analysis.type === 'Reference' ||
              !this.addressAnalyzer.templateChanged(analysis),
            `${address} was analyzed again and its template still changed`,
          )
          resolved[address.toString()] = analysis
          this.logObject(analysis, info)
        }),
      )
    }
  }

  private logObject(analysis: Analysis, info: string) {
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

/** Drops from `resolved` what the initial addresses no longer reach, and returns what they reach. */
function pruneUnreachable(
  resolved: Record<string, Analysis>,
  initialAddresses: ChainSpecificAddress[],
): Set<ChainSpecificAddress> {
  const relativesGraph = Object.fromEntries(
    Object.entries(resolved).map(([address, analysis]) =>
      analysis.type === 'Contract'
        ? [address, Object.keys(analysis.relatives).map(ChainSpecificAddress)]
        : [address, undefined],
    ),
  )
  const reachable = gatherReachableAddresses(initialAddresses, relativesGraph)
  for (const address of Object.keys(resolved)) {
    if (!reachable.has(ChainSpecificAddress(address))) {
      delete resolved[address]
    }
  }
  return reachable
}

function sameTemplates(
  before: Set<string> | undefined,
  now: Set<string>,
): boolean {
  return (
    before !== undefined &&
    before.size === now.size &&
    [...now].every((template) => before.has(template))
  )
}
