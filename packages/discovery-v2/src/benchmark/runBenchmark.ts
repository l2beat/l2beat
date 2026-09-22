/**
 * Runs the pipeline over every selected contract of a V1 project and
 * compares each entry with the committed one.
 *
 * The pipeline is called as a function (`pipelineCommand`), not as a
 * process, so one run shares the provider cache and the logger, and so a
 * test can replace it. Each contract is isolated: a throw anywhere in
 * prepare, authoring or execution is recorded on that contract and the run
 * continues, because one explorer hiccup must not cost an hour of model
 * calls on the other contracts.
 *
 * `--repeat N` re-authors N more times with the store bypassed and nothing
 * saved, so the stored plan stays the one the pipeline compared, and reports
 * how many distinct decision hashes the N+1 plans have. That is the
 * consistency requirement as a number, and it costs N model calls per
 * contract, which is why it is opt-in and only meaningful with `--author`.
 */
import type { EntryParameters } from '@l2beat/discovery'
import path from 'path'
import type { AuthoringResult, RoundRecord } from '../author/author'
import type { ReasoningEffort } from '../author/codex/CodexClient'
import { type AuthorFiles, runAuthor } from '../commands/authorCommand'
import { providerFor } from '../commands/baselineCommand'
import type { CommandContext } from '../commands/context'
import {
  FILE_NAMES,
  readBaseline,
  readPrepared,
  readWorklist,
} from '../commands/files'
import {
  type PipelineResult,
  pipelineCommand,
} from '../commands/pipelineCommand'
import { decisionHash } from '../plans/decisionHash'
import type { PlanStore } from '../plans/PlanStore'
import { attributeV1Field } from './attribution'
import {
  addCounts,
  compareFacts,
  compareValues,
  countVerdicts,
  emptyCounts,
} from './compare'
import type { BenchmarkProject } from './loadProject'
import type {
  ContractBenchmark,
  ContractPlanSource,
  ProjectBenchmark,
  ProjectTotals,
  RepeatAttempt,
  RepeatResult,
  TokenUsage,
} from './types'

export interface BenchmarkOptions {
  /** Ask the model when the store has no plan for a shape. */
  author: boolean
  /** Extra authoring runs per contract, store bypassed; needs `author`. */
  repeat: number
  /** Empty plan for every contract: the no-decision floor. */
  noPlan?: boolean
  /** Where per-contract run directories go (`<outDir>/contracts/<address>`). */
  outDir: string
  model?: string
  reasoning?: ReasoningEffort
  maxRounds?: number
  planStore?: PlanStore
}

export interface BenchmarkDeps {
  ctx: CommandContext
  runPipeline?: typeof pipelineCommand
  runAuthor?: typeof runAuthor
  now?: () => Date
  /** Shape hashes the store held before the run, for the report's setup section. */
  planStoreBefore?: string[]
}

export const CONTRACTS_DIR = 'contracts'

export async function runBenchmark(
  deps: BenchmarkDeps,
  project: BenchmarkProject,
  options: BenchmarkOptions,
): Promise<ProjectBenchmark> {
  const now = deps.now ?? (() => new Date())
  const startedAt = now()
  const contracts: ContractBenchmark[] = []
  for (const entry of project.entries) {
    deps.ctx.logger.info('Benchmarking contract', {
      address: entry.address,
      name: entry.name ?? 'unnamed',
      template: entry.template ?? 'none',
      index: `${contracts.length + 1}/${project.entries.length}`,
    })
    contracts.push(await benchmarkContract(deps, project, entry, options))
  }
  const finishedAt = now()
  return {
    project: project.name,
    chain: project.chain,
    blockNumber: project.blockNumber,
    model: modelOf(contracts) ?? options.model,
    reasoning: options.reasoning,
    author: options.author,
    noPlan: options.noPlan ?? false,
    repeat: options.repeat,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    planStoreBefore: deps.planStoreBefore ?? [],
    contracts,
    totals: totalsOf(contracts),
  }
}

async function benchmarkContract(
  deps: BenchmarkDeps,
  project: BenchmarkProject,
  entry: EntryParameters,
  options: BenchmarkOptions,
): Promise<ContractBenchmark> {
  const runDir = path.join(
    options.outDir,
    CONTRACTS_DIR,
    addressOf(entry.address),
  )
  const started = Date.now()
  let result: PipelineResult
  try {
    result = await (deps.runPipeline ?? pipelineCommand)(deps.ctx, {
      chain: project.chain,
      address: entry.address,
      blockNumber: project.blockNumber,
      author: options.author,
      noPlan: options.noPlan,
      out: runDir,
      model: options.model,
      reasoning: options.reasoning,
      maxRounds: options.maxRounds,
      planStore: options.planStore,
    })
  } catch (error) {
    deps.ctx.logger.error('Contract failed', {
      address: entry.address,
      error: describeError(error),
    })
    return failedContract(entry, describeError(error), Date.now() - started)
  }
  const wallMs = Date.now() - started
  const config = project.effectiveConfig(entry)
  const proxyNames = new Set(
    Object.keys(result.output.entry.values ?? {}).filter((name) =>
      name.startsWith('$'),
    ),
  )
  for (const name of proxyValueNames(runDir)) {
    proxyNames.add(name)
  }
  const fields = compareValues(
    entry.values ?? {},
    result.output.entry.values ?? {},
    {
      attribute: (name) => attributeV1Field(name, config, proxyNames),
      ignoreMethods: config.ignoreMethods,
    },
  )
  const authored = result.authoring
  const contract: ContractBenchmark = {
    address: entry.address,
    name: entry.name,
    template: entry.template,
    status: 'compared',
    planStatus: result.planStatus,
    planSource: planSourceOf(result),
    planHash: result.output.meta.planHash,
    decisionHash: result.output.meta.decisionHash,
    model: result.output.meta.model,
    rounds: authored?.rounds.length ?? 0,
    tokens: tokensOf(authored?.rounds ?? []),
    wallMs,
    modelMs: modelMsOf(authored?.rounds ?? []),
    authoringFailure: authored?.failure,
    fields,
    facts: compareFacts(entry, result.output.entry),
    counts: countVerdicts(fields),
  }
  if (options.repeat > 0 && options.author && result.planStatus !== 'missing') {
    contract.repeats = await repeatAuthoring(deps, runDir, contract, options)
  }
  return contract
}

/**
 * The store is bypassed on purpose: a repeat must ask the model, and its
 * plan must not replace the one the pipeline just compared. Inputs are read
 * back from the run directory, the same files `author` takes on the CLI.
 */
async function repeatAuthoring(
  deps: BenchmarkDeps,
  runDir: string,
  contract: ContractBenchmark,
  options: BenchmarkOptions,
): Promise<RepeatResult> {
  const prepared = readPrepared(path.join(runDir, FILE_NAMES.prepared))
  const baseline = readBaseline(path.join(runDir, FILE_NAMES.baseline))
  const worklist = readWorklist(path.join(runDir, FILE_NAMES.worklist))
  const provider = await providerFor(deps.ctx, prepared)
  const attempts: RepeatAttempt[] = []
  for (let i = 1; i <= options.repeat; i++) {
    deps.ctx.logger.info('Repeat authoring', {
      address: contract.address,
      attempt: `${i}/${options.repeat}`,
    })
    let authored: AuthorFiles
    const started = Date.now()
    try {
      authored = await (deps.runAuthor ?? runAuthor)(
        deps.ctx,
        provider,
        { prepared, baseline, worklist },
        path.join(runDir, `repeat-${i}`),
        {
          model: options.model,
          reasoning: options.reasoning,
          maxRounds: options.maxRounds,
          store: false,
        },
      )
    } catch (error) {
      attempts.push({
        status: 'failed',
        rounds: 0,
        tokens: tokensOf([]),
        durationMs: Date.now() - started,
        failure: describeError(error),
      })
      continue
    }
    attempts.push(toAttempt(authored.result, Date.now() - started))
  }
  const hashes = [
    contract.decisionHash,
    ...attempts.map((attempt) => attempt.decisionHash),
  ].filter((hash): hash is string => hash !== undefined)
  return {
    plans: hashes.length,
    distinctDecisionHashes: new Set(hashes).size,
    attempts,
  }
}

function toAttempt(result: AuthoringResult, durationMs: number): RepeatAttempt {
  return {
    status: result.status,
    rounds: result.rounds.length,
    tokens: tokensOf(result.rounds),
    durationMs,
    decisionHash:
      result.status === 'ok' && result.plan !== undefined
        ? decisionHash(result.plan)
        : undefined,
    failure: result.failure,
  }
}

function failedContract(
  entry: EntryParameters,
  error: string,
  wallMs: number,
): ContractBenchmark {
  return {
    address: entry.address,
    name: entry.name,
    template: entry.template,
    status: 'failed',
    error,
    planSource: 'none',
    rounds: 0,
    tokens: tokensOf([]),
    wallMs,
    modelMs: 0,
    fields: [],
    facts: [],
    counts: emptyCounts(),
  }
}

function proxyValueNames(runDir: string): string[] {
  try {
    const prepared = readPrepared(path.join(runDir, FILE_NAMES.prepared))
    return Object.keys(prepared.proxy.values)
  } catch {
    return []
  }
}

function planSourceOf(result: PipelineResult): ContractPlanSource {
  if (result.planSource === undefined || result.planSource === 'file') {
    return 'none'
  }
  return result.planSource
}

export function tokensOf(rounds: readonly RoundRecord[]): TokenUsage {
  return rounds.reduce<TokenUsage>(
    (sum, round) => ({
      input: sum.input + (round.usage?.inputTokens ?? 0),
      cached: sum.cached + (round.usage?.cachedInputTokens ?? 0),
      output: sum.output + (round.usage?.outputTokens ?? 0),
      reasoning: sum.reasoning + (round.usage?.reasoningOutputTokens ?? 0),
    }),
    { input: 0, cached: 0, output: 0, reasoning: 0 },
  )
}

function addTokens(into: TokenUsage, more: TokenUsage): void {
  into.input += more.input
  into.cached += more.cached
  into.output += more.output
  into.reasoning += more.reasoning
}

function modelMsOf(rounds: readonly RoundRecord[]): number {
  return rounds.reduce((sum, round) => sum + round.durationMs, 0)
}

/** The model name comes from Codex's rollout per turn; the first contract that reports one names the run. */
function modelOf(contracts: ContractBenchmark[]): string | undefined {
  return contracts.find((contract) => contract.model !== undefined)?.model
}

export function totalsOf(contracts: ContractBenchmark[]): ProjectTotals {
  const totals: ProjectTotals = {
    ...emptyCounts(),
    contracts: contracts.length,
    compared: 0,
    failed: 0,
    tokens: tokensOf([]),
    wallMs: 0,
    modelMs: 0,
    roundsDistribution: {},
  }
  for (const contract of contracts) {
    if (contract.status === 'failed') {
      totals.failed++
    } else {
      totals.compared++
    }
    addCounts(totals, contract.counts)
    addTokens(totals.tokens, contract.tokens)
    totals.wallMs += contract.wallMs
    totals.modelMs += contract.modelMs
    if (contract.rounds > 0) {
      const key = String(contract.rounds)
      totals.roundsDistribution[key] = (totals.roundsDistribution[key] ?? 0) + 1
    }
    for (const attempt of contract.repeats?.attempts ?? []) {
      addTokens(totals.tokens, attempt.tokens)
      totals.modelMs += attempt.durationMs
    }
  }
  return totals
}

function addressOf(address: string): string {
  const colon = address.indexOf(':')
  return colon === -1 ? address : address.slice(colon + 1)
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
