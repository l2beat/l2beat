/**
 * The templatizer benchmark: for every suite contract that has a committed
 * template, hide that template, let the templatizer author one, analyse the
 * contract with it at the committed block, and compare the values field by
 * field with the committed `discovered.json`.
 *
 * Contracts run one after another and each is isolated: a throw anywhere in
 * its analysis is recorded on that contract and the run continues, because
 * one explorer hiccup must not cost an hour of model calls on the others.
 * Once the model provider refuses for quota, or stops answering at all,
 * every later contract would author nothing and count as misses, so
 * authoring stops there and the rest is recorded as skipped: the numbers
 * stay honest and the report says why.
 *
 * The report is rewritten after every contract, so a killed run still
 * leaves what it measured. Everything that touches RPC, the model or the
 * templates is behind `BenchmarkDeps`, so a test drives the orchestration
 * with fakes.
 */
import type { Logger } from '@l2beat/backend-tools'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import fs from 'fs'
import path from 'path'
import { getErrorMessage } from '../../../utils/getErrorMessage'
import type { IProvider } from '../../provider/IProvider'
import { TemplatizationFailedError } from '../TemplatizationFailedError'
import type {
  HiddenTemplateResult,
  HiddenTemplateRun,
  UsedTemplate,
} from './analyzeWithHiddenTemplate'
import { attributeV1Field } from './attribution'
import { addCounts, compareValues, countVerdicts, emptyCounts } from './compare'
import {
  type BenchmarkProject,
  missingFromSuite,
  type SuiteProject,
  selectContracts,
  type TemplatedEntry,
} from './loadProject'
import { renderMarkdown } from './render'
import type {
  AuthoringOutcome,
  BenchmarkReport,
  ContractBenchmark,
  ProjectBenchmark,
  ProjectTotals,
  TokenUsage,
} from './types'

export interface BenchmarkDeps {
  logger: Logger
  loadProject(project: SuiteProject): BenchmarkProject
  /** A provider at the committed timestamp, as `discover --dev` builds it. */
  providerFor(project: BenchmarkProject): Promise<IProvider>
  analyzeWithHiddenTemplate(
    run: HiddenTemplateRun,
  ): Promise<HiddenTemplateResult>
  now?: () => Date
}

export interface BenchmarkOptions {
  /** Receives `benchmark.json`, `benchmark.md` and `<project>/templates/<address>.jsonc`. */
  outDir: string
  /** The model as the report names it. */
  model: string
  maxRounds: number
  /** Restricts every project to these addresses, for smoke runs. */
  onlyAddresses?: string[]
  /** First n contracts per project, for smoke runs. */
  limit?: number
  /** Per template, the handler fields the model could not have written, with the reason. */
  unreachable?: Record<string, Record<string, string>>
}

export const REPORT_JSON = 'benchmark.json'
export const REPORT_MARKDOWN = 'benchmark.md'

export async function runBenchmark(
  deps: BenchmarkDeps,
  projects: readonly SuiteProject[],
  options: BenchmarkOptions,
): Promise<BenchmarkReport> {
  const run = new BenchmarkRun(deps, options)
  for (const project of projects) {
    await run.benchmarkProject(project)
  }
  return run.finish()
}

class BenchmarkRun {
  private readonly now: () => Date
  private readonly startedAt: Date
  private readonly projects: ProjectBenchmark[] = []
  /** The first quota refusal or unanswered turn; from then on contracts are skipped, not authored. */
  private quota: string | undefined

  constructor(
    private readonly deps: BenchmarkDeps,
    private readonly options: BenchmarkOptions,
  ) {
    this.now = deps.now ?? (() => new Date())
    this.startedAt = this.now()
  }

  async benchmarkProject(suiteProject: SuiteProject): Promise<void> {
    const report = emptyProject(suiteProject)
    this.projects.push(report)
    this.discardAuthoredTemplates(suiteProject.name)
    let project: BenchmarkProject
    let provider: IProvider
    try {
      project = this.deps.loadProject(suiteProject)
      const missing = missingFromSuite(project, suiteProject)
      if (missing.length > 0) {
        throw new Error(
          `The suite lists ${missing.join(', ')} for ${suiteProject.name}, which its committed discovered.json does not hold as a verified contract with a template; update suite.json`,
        )
      }
      report.blockNumber = project.blockNumber
      report.timestamp = project.timestamp
      provider = await this.providerAtCommittedBlock(project)
    } catch (error) {
      report.failure = getErrorMessage(error)
      this.deps.logger.error('Project not benchmarked', {
        project: suiteProject.name,
        error: report.failure,
      })
      this.persist()
      return
    }
    const entries = selectContracts(project.entries, project.chain, {
      addresses: suiteProject.addresses,
      onlyAddresses: this.options.onlyAddresses,
      limit: this.options.limit,
    })
    for (const [i, entry] of entries.entries()) {
      const index = `${i + 1}/${entries.length}`
      report.contracts.push(
        await this.benchmarkContract(project, provider, entry, index),
      )
      report.totals = totalsOf(report.contracts)
      this.persist()
    }
  }

  /**
   * Committed values were read at `usedBlockNumbers[chain]`; values read at
   * any other block would measure chain activity, not the templatizer.
   */
  private async providerAtCommittedBlock(
    project: BenchmarkProject,
  ): Promise<IProvider> {
    const provider = await this.deps.providerFor(project)
    if (provider.blockNumber !== project.blockNumber) {
      throw new Error(
        `The ${project.chain} provider at the committed timestamp ${project.timestamp} is at block ${provider.blockNumber}, but ${project.name}/discovered.json was read at block ${project.blockNumber}`,
      )
    }
    return provider
  }

  private async benchmarkContract(
    project: BenchmarkProject,
    provider: IProvider,
    entry: TemplatedEntry,
    index: string,
  ): Promise<ContractBenchmark> {
    if (this.quota !== undefined) {
      return skippedContract(entry, `skipped: ${this.quota}`)
    }
    this.deps.logger.info('Benchmarking contract', {
      project: project.name,
      address: entry.address,
      name: entry.name ?? 'unnamed',
      template: entry.template,
      index,
    })
    const started = Date.now()
    try {
      const result = await this.deps.analyzeWithHiddenTemplate({
        provider,
        project,
        entry,
      })
      const elapsed = Date.now() - started
      this.saveAuthoredTemplate(project.name, entry.address, result.template)
      const contract = comparedContract(
        project,
        entry,
        result,
        elapsed,
        this.options.unreachable?.[entry.template] ?? {},
      )
      this.quota = quotaFailure(contract)
      this.logContract(contract)
      return contract
    } catch (error) {
      this.deps.logger.error('Contract failed', {
        address: entry.address,
        error: getErrorMessage(error),
      })
      if (
        error instanceof TemplatizationFailedError &&
        error.failure === 'model-unavailable'
      ) {
        this.quota = error.reason.slice(0, QUOTA_MESSAGE_CHARS)
      }
      return failedContract(entry, getErrorMessage(error), Date.now() - started)
    }
  }

  /** The templatizer wrote into a throwaway copy; this keeps the file for a reviewer. */
  private saveAuthoredTemplate(
    project: string,
    address: ChainSpecificAddress,
    template: UsedTemplate | undefined,
  ): void {
    if (template?.kind !== 'authored') {
      return
    }
    const directory = path.join(this.options.outDir, project, 'templates')
    fs.mkdirSync(directory, { recursive: true })
    fs.writeFileSync(this.authoredTemplatePath(project, address), template.text)
  }

  /**
   * An earlier run into the same `--out` may have authored templates for
   * this project; they go before this run starts on it, so every file there
   * is this run's, whether the project then fails, a contract is skipped or
   * nothing is authored.
   */
  private discardAuthoredTemplates(project: string): void {
    fs.rmSync(path.join(this.options.outDir, project, 'templates'), {
      recursive: true,
      force: true,
    })
  }

  private authoredTemplatePath(
    project: string,
    address: ChainSpecificAddress,
  ): string {
    return path.join(
      this.options.outDir,
      project,
      'templates',
      `${address}.jsonc`,
    )
  }

  private logContract(contract: ContractBenchmark): void {
    this.deps.logger.info('Contract benchmarked', {
      address: contract.address,
      authoring: contract.authoring?.kind ?? 'none',
      rounds: contract.rounds,
      reachable: `${contract.counts.reachableFound}/${contract.counts.reachableFields}`,
      regressions: contract.counts.regressions,
      handlerFields: `${contract.counts.handlerFound}/${contract.counts.handlerFields}`,
    })
  }

  finish(): BenchmarkReport {
    const report = this.snapshot()
    this.write(report)
    return report
  }

  private persist(): void {
    this.write(this.snapshot())
  }

  private snapshot(): BenchmarkReport {
    return {
      model: this.options.model,
      reportedModel: this.projects
        .flatMap((project) => project.contracts)
        .find((contract) => contract.model !== undefined)?.model,
      maxRounds: this.options.maxRounds,
      startedAt: this.startedAt.toISOString(),
      finishedAt: this.now().toISOString(),
      projects: this.projects,
      totals: totalsOf(this.projects.flatMap((project) => project.contracts)),
    }
  }

  private write(report: BenchmarkReport): void {
    fs.mkdirSync(this.options.outDir, { recursive: true })
    fs.writeFileSync(
      path.join(this.options.outDir, REPORT_JSON),
      `${JSON.stringify(report, null, 2)}\n`,
    )
    fs.writeFileSync(
      path.join(this.options.outDir, REPORT_MARKDOWN),
      renderMarkdown(report),
    )
  }
}

function comparedContract(
  project: BenchmarkProject,
  entry: TemplatedEntry,
  result: HiddenTemplateResult,
  wallMs: number,
  unreachable: Record<string, string>,
): ContractBenchmark {
  const config = project.committedConfig(entry)
  const proxyNames = new Set(result.proxyValueNames)
  const fields = compareValues(entry.values ?? {}, result.values, {
    attribute: (name) =>
      attributeV1Field(name, config, proxyNames, unreachable),
    ignoreMethods: config.ignoreMethods,
  })
  return {
    address: entry.address,
    name: entry.name,
    committedTemplate: entry.template,
    status: 'compared',
    authoring: authoringOutcome(result),
    model: result.trail?.model,
    rounds: result.trail?.rounds ?? 0,
    refusal: result.trail?.lastRefusal,
    tokens: result.trail?.tokens ?? noTokens(),
    wallMs,
    modelMs: result.trail?.modelMs ?? 0,
    fields,
    counts: countVerdicts(fields),
  }
}

function authoringOutcome(result: HiddenTemplateResult): AuthoringOutcome {
  if (result.template !== undefined) {
    return { kind: result.template.kind, template: result.template.id }
  }
  return { kind: 'failed', failure: describeMissingTemplate(result) }
}

/** The loop's own failure when there is one; otherwise what the trail allows to say. */
function describeMissingTemplate({ trail }: HiddenTemplateResult): string {
  if (trail === undefined) {
    return 'no template and no model call: the templatizer declined the contract or threw before its first turn (see the log)'
  }
  if (trail.failure !== undefined) {
    return trail.failure
  }
  return `no template although the loop ended ${trail.status}: writing the template threw (see the log)`
}

const QUOTA_FAILURE = /out of credits|usage limit|rate limit|quota/i
const QUOTA_MESSAGE_CHARS = 120

/**
 * Only the client's refusal is searched, not the whole authoring failure:
 * that also carries validator findings, which quote field names like
 * `withdrawalQuota` and would stop a healthy run.
 */
export function quotaFailure(contract: ContractBenchmark): string | undefined {
  const refusal = contract.refusal
  return refusal !== undefined && QUOTA_FAILURE.test(refusal)
    ? refusal.slice(0, QUOTA_MESSAGE_CHARS)
    : undefined
}

function emptyProject(suiteProject: SuiteProject): ProjectBenchmark {
  return {
    project: suiteProject.name,
    chain: suiteProject.chain,
    contracts: [],
    totals: totalsOf([]),
  }
}

function failedContract(
  entry: TemplatedEntry,
  error: string,
  wallMs: number,
): ContractBenchmark {
  return { ...notCompared(entry, 'failed', error), wallMs }
}

function skippedContract(
  entry: TemplatedEntry,
  reason: string,
): ContractBenchmark {
  return notCompared(entry, 'skipped', reason)
}

function notCompared(
  entry: TemplatedEntry,
  status: 'failed' | 'skipped',
  error: string,
): ContractBenchmark {
  return {
    address: entry.address,
    name: entry.name,
    committedTemplate: entry.template,
    status,
    error,
    rounds: 0,
    tokens: noTokens(),
    wallMs: 0,
    modelMs: 0,
    fields: [],
    counts: emptyCounts(),
  }
}

function noTokens(): TokenUsage {
  return { input: 0, cached: 0, output: 0, reasoning: 0 }
}

export function totalsOf(
  contracts: readonly ContractBenchmark[],
): ProjectTotals {
  const totals: ProjectTotals = {
    ...emptyCounts(),
    contracts: contracts.length,
    compared: 0,
    failed: 0,
    skipped: 0,
    authored: 0,
    matched: 0,
    authoringFailed: 0,
    tokens: noTokens(),
    wallMs: 0,
    modelMs: 0,
    roundsDistribution: {},
  }
  for (const contract of contracts) {
    countStatus(totals, contract)
    addCounts(totals, contract.counts)
    addTokens(totals.tokens, contract.tokens)
    totals.wallMs += contract.wallMs
    totals.modelMs += contract.modelMs
    if (contract.rounds > 0) {
      const key = String(contract.rounds)
      totals.roundsDistribution[key] = (totals.roundsDistribution[key] ?? 0) + 1
    }
  }
  return totals
}

function countStatus(totals: ProjectTotals, contract: ContractBenchmark): void {
  if (contract.status === 'failed') totals.failed++
  if (contract.status === 'skipped') totals.skipped++
  if (contract.status === 'compared') totals.compared++
  if (contract.authoring?.kind === 'authored') totals.authored++
  if (contract.authoring?.kind === 'matched') totals.matched++
  if (contract.authoring?.kind === 'failed') totals.authoringFailed++
}

function addTokens(into: TokenUsage, more: TokenUsage): void {
  into.input += more.input
  into.cached += more.cached
  into.output += more.output
  into.reasoning += more.reasoning
}
