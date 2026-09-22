/**
 * The authoring loop: prompt, validate, dry-run, repair, store.
 *
 * The model is the only non-deterministic actor, so the loop around it is
 * made as mechanical as possible: the prompt is a pure function of the
 * inputs, the repair message is the validator's findings verbatim, and the
 * plan is accepted only when the static validator reports no error and a
 * dry run on the real provider produces no step error. A plan that never
 * gets there is returned as `failed` with every round on record and is not
 * stored, so a later run for the same shape asks the model again rather than
 * inheriting a broken plan.
 *
 * The model is told the shape hash but may omit it: it is a fact about the
 * prepared code, not a decision, and the plan store keys on it. When the
 * response lacks it the loop fills it from `prepared`; when the response
 * carries a different one the validator rejects the plan.
 */
import { Logger } from '@l2beat/backend-tools'
import type { IProvider } from '@l2beat/discovery'
import { executePlan } from '../execute/executePlan'
import type { Library } from '../library/Library'
import type { Finding } from '../plan/Finding'
import type { Plan, Step } from '../plan/Plan'
import { planSchema } from '../plan/planSchema'
import { validatePlan } from '../plan/validatePlan'
import { decisionHash } from '../plans/decisionHash'
import type { PlanSource, PlanStore } from '../plans/PlanStore'
import type { Baseline } from '../types/Baseline'
import type { Prepared } from '../types/Prepared'
import type { Worklist } from '../types/Worklist'
import type { ArtifactSink } from './ArtifactSink'
import type { ModelClient, ModelTurn, ModelUsage } from './codex/ModelClient'
import { parseModelJson } from './parseModelJson'
import { buildAuthoringPrompt } from './prompt/buildAuthoringPrompt'

export interface AuthorDeps {
  model: ModelClient
  provider: IProvider
  library: Library
  planStore?: PlanStore
  artifacts: ArtifactSink
  logger?: Logger
  now?: () => Date
}

export interface AuthorContext {
  prepared: Prepared
  baseline: Baseline
  worklist: Worklist
}

export interface AuthorOptions {
  /** Repair turns after the first; the model gets `1 + maxRepairRounds` turns in total. */
  maxRepairRounds?: number
  sourceCharCap?: number
  /** Recorded as provenance when the client cannot report the model itself. */
  model?: string
}

export const DEFAULT_MAX_REPAIR_ROUNDS = 2
export const DEFAULT_SOURCE_CHAR_CAP = 400_000

export interface DryRunRecord {
  status: 'ok' | 'partial'
  failedSteps: { id: string; error: string }[]
}

export interface RoundRecord {
  index: number
  prompt: string
  response: string
  parsed?: unknown
  findings: Finding[]
  /** Present exactly when the static validation passed, since only then is the plan run. */
  dryRun?: DryRunRecord
  durationMs: number
  usage?: ModelUsage
}

export interface AuthoringResult {
  status: 'ok' | 'failed'
  plan?: Plan
  rounds: RoundRecord[]
  threadId?: string
  model?: string
  failure?: string
  /** Path the plan store wrote, when it did. */
  storedFile?: string
  promptTruncated: boolean
}

export async function author(
  deps: AuthorDeps,
  ctx: AuthorContext,
  options: AuthorOptions = {},
): Promise<AuthoringResult> {
  const loop = new AuthoringLoop(deps, ctx, options)
  return await loop.run()
}

class AuthoringLoop {
  private readonly logger: Logger
  private readonly maxTurns: number
  private readonly rounds: RoundRecord[] = []
  private readonly events: unknown[] = []
  private threadId: string | undefined
  private model: string | undefined

  constructor(
    private readonly deps: AuthorDeps,
    private readonly ctx: AuthorContext,
    private readonly options: AuthorOptions,
  ) {
    this.logger = deps.logger ?? Logger.SILENT
    this.maxTurns = 1 + (options.maxRepairRounds ?? DEFAULT_MAX_REPAIR_ROUNDS)
    this.model = options.model
  }

  async run(): Promise<AuthoringResult> {
    if (this.ctx.worklist.items.length === 0) {
      return this.acceptedWithoutModel(trivialPlan(this.ctx.prepared))
    }
    const { prompt, truncated } = buildAuthoringPrompt(
      { ...this.ctx, library: this.deps.library },
      { sourceCharCap: this.options.sourceCharCap ?? DEFAULT_SOURCE_CHAR_CAP },
    )
    if (truncated) {
      this.logger.warn('Source truncated in prompt', {
        sourceCharCap: this.options.sourceCharCap ?? DEFAULT_SOURCE_CHAR_CAP,
      })
    }
    let message = prompt
    let candidate: Plan | undefined
    for (let index = 1; index <= this.maxTurns; index++) {
      let round: RoundRecord
      try {
        round = await this.round(index, message)
      } catch (error) {
        return this.failed(truncated, describeError(error), candidate)
      }
      this.rounds.push(round)
      this.writeSummary('running')
      if (round.parsed !== undefined && !hasErrors(round.findings)) {
        return this.accepted(round.parsed as Plan, truncated)
      }
      if (round.dryRun !== undefined) {
        candidate = round.parsed as Plan
      }
      message = repairMessage(round.findings)
    }
    const last = this.rounds[this.rounds.length - 1]
    return this.failed(
      truncated,
      `no acceptable plan after ${this.rounds.length} round(s); last findings: ${summarise(last?.findings ?? [])}`,
      candidate,
    )
  }

  private async round(index: number, message: string): Promise<RoundRecord> {
    this.deps.artifacts.write(`round-${index}.prompt.md`, message)
    this.logger.info('Model turn', { round: index, chars: message.length })
    const turn = await this.turn(message)
    this.threadId = turn.threadId
    this.model = turn.model ?? this.model
    this.events.push(...turn.events)
    this.deps.artifacts.write(`round-${index}.response.txt`, turn.text)
    this.deps.artifacts.write('codex-events.jsonl', toJsonl(this.events))

    const round: RoundRecord = {
      index,
      prompt: message,
      response: turn.text,
      findings: [],
      durationMs: turn.durationMs,
      usage: turn.usage,
    }
    const parsed = parseModelJson(turn.text)
    if (parsed.error !== undefined) {
      round.findings.push({
        severity: 'error',
        path: 'plan',
        message: `the response is not valid JSON (${parsed.error}); reply with exactly one JSON object matching the plan schema and nothing else`,
      })
    } else {
      round.parsed = withShapeHash(parsed.value, this.ctx.prepared.shapeHash)
      round.findings = validatePlan(round.parsed, {
        ...this.ctx,
        library: this.deps.library,
      })
      if (!hasErrors(round.findings)) {
        const dry = await this.dryRun(round.parsed as Plan)
        round.dryRun = dry.record
        round.findings.push(...dry.findings)
        this.deps.artifacts.write(
          `round-${index}.dryrun.json`,
          JSON.stringify(dry.record, null, 2),
        )
      }
    }
    this.deps.artifacts.write(
      `round-${index}.findings.json`,
      JSON.stringify(round.findings, null, 2),
    )
    this.logger.info('Round done', {
      round: index,
      errors: countErrors(round.findings),
      warnings: round.findings.length - countErrors(round.findings),
      durationMs: turn.durationMs,
    })
    return round
  }

  private turn(message: string): Promise<ModelTurn> {
    if (this.threadId === undefined) {
      return this.deps.model.start({ prompt: message, schema: planSchema })
    }
    return this.deps.model.resume({
      threadId: this.threadId,
      prompt: message,
      schema: planSchema,
    })
  }

  /**
   * Runs the plan for real. Step errors become findings the model must fix;
   * an event set that matched nothing is only a warning, because an empty
   * set can be the truth (nobody was ever granted the role).
   */
  private async dryRun(
    plan: Plan,
  ): Promise<{ record: DryRunRecord; findings: Finding[] }> {
    const executed = await executePlan(this.deps.provider, {
      ...this.ctx,
      plan,
      library: this.deps.library,
    })
    const findings: Finding[] = []
    const failedSteps: DryRunRecord['failedSteps'] = []
    plan.steps.forEach((step, i) => {
      const field = executed.fields[step.id]
      if (field?.error !== undefined) {
        failedSteps.push({ id: step.id, error: field.error })
        findings.push({
          severity: 'error',
          path: `steps[${i}]`,
          message: `dry run at block ${this.ctx.prepared.blockNumber} failed: ${field.error}; fix the fetch (method, args, keys, at) or skip the item`,
        })
      }
      const raw = executed.raw[step.id]
      if (
        step.fetch.kind === 'logs' &&
        Array.isArray(raw) &&
        raw.length === 0
      ) {
        findings.push(this.zeroLogsFinding(step, i))
      }
    })
    return { record: { status: executed.status, failedSteps }, findings }
  }

  /**
   * A fold over events nobody emitted is the truth for an event-only step,
   * but for a step that claims to answer a getter it is more likely the
   * wrong event: the benchmark caught an `isBatchPoster = []` accepted this
   * way while the getter returned true for five addresses. So the finding
   * is an error whenever `covers` is non-empty, and the model must probe
   * the getter or skip the item.
   */
  private zeroLogsFinding(step: Step, index: number): Finding {
    const events = step.fetch.kind === 'logs' ? step.fetch.events : []
    const where = `no logs found for events ${events.join(', ')} up to block ${this.ctx.prepared.blockNumber}`
    if ((step.covers ?? []).length === 0) {
      return {
        severity: 'warning',
        path: `steps[${index}].fetch.events`,
        message: `${where}; confirm the event names and that this contract emits them`,
      }
    }
    return {
      severity: 'error',
      path: `steps[${index}].fetch.events`,
      message: `${where}, yet the step covers ${step.covers?.join(', ')}; this contract does not emit these events, so find the events its setters actually emit (check the flattened source, including inherited contracts), enumerate the getter another way, or skip the item with a reason`,
    }
  }

  /**
   * Nothing to rule on means nothing for the model to decide: the plan is
   * empty by construction. Skipping the turn saved about a tenth of all
   * tokens in the first benchmark, where 16 of 69 calls returned `[]`.
   */
  private acceptedWithoutModel(plan: Plan): AuthoringResult {
    const result: AuthoringResult = {
      status: 'ok',
      plan,
      rounds: [],
      promptTruncated: false,
    }
    result.storedFile = this.store(plan, 'trivial')
    this.writeSummary('ok', result)
    this.logger.info('Plan accepted without a model turn: empty worklist')
    return result
  }

  private accepted(plan: Plan, truncated: boolean): AuthoringResult {
    const result: AuthoringResult = {
      status: 'ok',
      plan,
      rounds: this.rounds,
      threadId: this.threadId,
      model: this.model,
      promptTruncated: truncated,
    }
    result.storedFile = this.store(plan, 'model')
    this.writeSummary('ok', result)
    this.logger.info('Plan accepted', {
      rounds: this.rounds.length,
      steps: plan.steps.length,
      skips: plan.skips.length,
      stored: result.storedFile ?? 'no',
    })
    return result
  }

  private store(plan: Plan, source: PlanSource): string | undefined {
    if (this.deps.planStore === undefined) {
      return undefined
    }
    if (plan.shapeHash === undefined) {
      this.logger.warn('Plan not stored: prepared.json has no shape hash')
      return undefined
    }
    return this.deps.planStore.save(plan, {
      source,
      createdAt: (this.deps.now ?? (() => new Date()))().toISOString(),
      model: this.model,
      rounds: this.rounds.length,
      decisionHash: decisionHash(plan),
    })
  }

  private failed(
    truncated: boolean,
    failure: string,
    candidate: Plan | undefined,
  ): AuthoringResult {
    const result: AuthoringResult = {
      status: 'failed',
      plan: candidate,
      rounds: this.rounds,
      threadId: this.threadId,
      model: this.model,
      failure,
      promptTruncated: truncated,
    }
    this.writeSummary('failed', result)
    this.logger.error('Authoring failed', {
      failure,
      rounds: this.rounds.length,
    })
    return result
  }

  /** Everything but prompts and responses, which have their own files. */
  private writeSummary(
    status: 'running' | 'ok' | 'failed',
    result?: AuthoringResult,
  ): void {
    this.deps.artifacts.write(
      'summary.json',
      JSON.stringify(
        {
          status,
          threadId: this.threadId,
          model: this.model,
          failure: result?.failure,
          storedFile: result?.storedFile,
          promptTruncated: result?.promptTruncated,
          rounds: this.rounds.map(({ prompt: _p, response: _r, ...rest }) => ({
            ...rest,
            parsed: rest.parsed !== undefined,
          })),
        },
        null,
        2,
      ),
    )
  }
}

function withShapeHash(value: unknown, shapeHash: string | undefined): unknown {
  if (
    shapeHash === undefined ||
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value) ||
    'shapeHash' in value
  ) {
    return value
  }
  return { ...value, shapeHash }
}

/** Errors first, then warnings, numbered, so the model can answer point by point. */
export function repairMessage(findings: Finding[]): string {
  const ordered = [
    ...findings.filter((finding) => finding.severity === 'error'),
    ...findings.filter((finding) => finding.severity === 'warning'),
  ]
  const errors = countErrors(findings)
  return [
    `The plan has ${errors} error(s) and ${findings.length - errors} warning(s). Fix every error; treat warnings as hints to check.`,
    '',
    ...ordered.map(
      (finding, i) =>
        `${i + 1}. ${finding.severity} at ${finding.path}: ${finding.message}`,
    ),
    '',
    'Return the whole corrected plan as one JSON object and nothing else.',
  ].join('\n')
}

function hasErrors(findings: Finding[]): boolean {
  return findings.some((finding) => finding.severity === 'error')
}

function countErrors(findings: Finding[]): number {
  return findings.filter((finding) => finding.severity === 'error').length
}

function summarise(findings: Finding[]): string {
  const errors = findings.filter((finding) => finding.severity === 'error')
  return errors.length === 0
    ? '(none)'
    : errors.map((finding) => `${finding.path}: ${finding.message}`).join('; ')
}

function toJsonl(events: unknown[]): string {
  return events.map((event) => JSON.stringify(event)).join('\n') + '\n'
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function trivialPlan(prepared: Prepared): Plan {
  return {
    version: 1,
    contract: prepared.name,
    shapeHash: prepared.shapeHash,
    steps: [],
    skips: [],
  }
}
