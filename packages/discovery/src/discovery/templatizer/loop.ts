/**
 * The authoring loop: prompt, check, repair, until a draft passes.
 *
 * The model is the only non-deterministic actor, so everything around it
 * is mechanical: the prompt is a pure function of the contract, the repair
 * message is the findings verbatim, and a draft is accepted as soon as the
 * checks report no error and the dry run on the real provider produces no
 * field error. There is no review turn after that: in the research
 * benchmark a general review found nothing the mechanical checks had not,
 * and an advisory turn about judgment calls made the model drop correct
 * fields to get past it. What the dry run observed goes into the template
 * as notes for the reviewer instead.
 *
 * Every round leaves its prompt, response, findings and dry run in the
 * artifact trail as it happens, so a killed run still shows what the model
 * was told and what it answered.
 */
import type { Logger } from '@l2beat/backend-tools'
import { getErrorMessage } from '../../utils/getErrorMessage'
import type { ArtifactSink } from './artifacts'
import type { Draft } from './draft/Draft'
import type { DryRunRecord } from './draft/dryRun'
import type { Finding } from './draft/Finding'
import {
  type CheckedDraft,
  type ValidationContext,
  validateDraftText,
} from './draft/validateDraft'
import {
  isRetryable,
  type ModelClient,
  type ModelTurn,
  ModelUnavailableError,
  type ModelUsage,
} from './model/ModelClient'
import { draftJsonSchema } from './prompt/draftJsonSchema'

export const DEFAULT_MAX_ROUNDS = 3

export interface LoopDeps {
  model: ModelClient
  artifacts: ArtifactSink
  logger: Logger
  dryRun: (
    draft: CheckedDraft,
  ) => Promise<{ record: DryRunRecord; findings: Finding[] }>
}

export interface LoopInput {
  prompt: string
  /** How log lines name the contract, e.g. `ScrollChain (eth:0xa13B…)`. */
  subject?: string
  validation: ValidationContext
  /** Facts about the run that belong in `summary.json`, e.g. whether the source was cut. */
  trail?: Record<string, unknown>
}

export interface LoopOptions {
  /** Model turns in total, the first one included. */
  maxRounds?: number
}

export interface RoundRecord {
  index: number
  durationMs: number
  /** Why the client refused the turn; such a round has no response. */
  refused?: string
  findings: Finding[]
  /** Present exactly when the static checks passed, since only then the draft runs. */
  dryRun?: DryRunRecord
  usage?: ModelUsage
}

export type LoopResult =
  | {
      status: 'accepted'
      draft: Draft
      /** The round whose draft this is: its dry run's notes go into the template. */
      acceptedRound: RoundRecord
      rounds: RoundRecord[]
      model?: string
    }
  | { status: 'failed'; failure: string; rounds: RoundRecord[]; model?: string }

export async function authorDraft(
  deps: LoopDeps,
  input: LoopInput,
  options: LoopOptions = {},
): Promise<LoopResult> {
  return await new AuthoringLoop(deps, input, options).run()
}

class AuthoringLoop {
  private readonly rounds: RoundRecord[] = []
  private readonly events: unknown[] = []
  private readonly maxRounds: number
  private threadId: string | undefined
  private model: string | undefined

  constructor(
    private readonly deps: LoopDeps,
    private readonly input: LoopInput,
    options: LoopOptions,
  ) {
    this.maxRounds = Math.max(1, options.maxRounds ?? DEFAULT_MAX_ROUNDS)
  }

  async run(): Promise<LoopResult> {
    let message = this.input.prompt
    while (this.rounds.length < this.maxRounds) {
      const index = this.rounds.length + 1
      const outcome = await this.round(index, message)
      this.rounds.push(outcome.record)
      this.writeSummary('running')
      if (outcome.notAnswering !== undefined) {
        throw this.unavailable(outcome.notAnswering)
      }
      if (outcome.draft !== undefined) {
        return this.accepted(outcome.draft, outcome.record)
      }
      // An unusable answer is asked again as it was: it says nothing about
      // the draft, so there is nothing to repair.
      if (outcome.record.refused === undefined) {
        message = repairMessage(outcome.record.findings)
      }
    }
    return this.failed()
  }

  private async round(
    index: number,
    message: string,
  ): Promise<{ record: RoundRecord; draft?: Draft; notAnswering?: unknown }> {
    this.deps.artifacts.write(`round-${index}.prompt.md`, message)
    const started = Date.now()
    let turn: ModelTurn
    try {
      turn = await this.turn(message)
    } catch (error) {
      const record = this.refusedRound(index, error, Date.now() - started)
      return isRetryable(error) ? { record } : { record, notAnswering: error }
    }
    this.remember(turn)
    this.deps.artifacts.write(`round-${index}.response.txt`, turn.text)

    const record: RoundRecord = {
      index,
      durationMs: turn.durationMs,
      findings: [],
      usage: turn.usage,
    }
    const checked = await this.check(index, turn.text, record)
    this.deps.artifacts.write(
      `round-${index}.findings.json`,
      JSON.stringify(record.findings, null, 2),
    )
    this.logRound(record)
    return { record, draft: checked }
  }

  /** Static checks, then the dry run when they pass; the draft only when both are clean. */
  private async check(
    index: number,
    text: string,
    record: RoundRecord,
  ): Promise<Draft | undefined> {
    const validated = validateDraftText(text, this.input.validation)
    record.findings.push(...validated.findings)
    if (validated.checked === undefined) {
      return undefined
    }
    const dry = await this.deps.dryRun(validated.checked)
    record.dryRun = dry.record
    record.findings.push(...dry.findings)
    this.deps.artifacts.write(
      `round-${index}.dryrun.json`,
      JSON.stringify(dry.record, null, 2),
    )
    return record.findings.length > 0 ? undefined : validated.checked.draft
  }

  private turn(message: string): Promise<ModelTurn> {
    const schema = draftJsonSchema()
    if (this.threadId === undefined) {
      return this.deps.model.start({ prompt: message, schema })
    }
    return this.deps.model.resume({
      threadId: this.threadId,
      prompt: message,
      schema,
    })
  }

  private remember(turn: ModelTurn): void {
    this.threadId = turn.threadId
    this.model = turn.model ?? this.model
    this.events.push(...turn.events)
    this.deps.artifacts.write('events.jsonl', toJsonl(this.events))
  }

  /** A refused turn still happened: its events are the evidence for why, and its tokens were spent. */
  private refusedRound(
    index: number,
    error: unknown,
    durationMs: number,
  ): RoundRecord {
    const events = eventsOf(error)
    if (events.length > 0) {
      this.deps.artifacts.write(
        `round-${index}.refused-events.jsonl`,
        toJsonl(events),
      )
    }
    const refused = getErrorMessage(error)
    const what = isRetryable(error)
      ? 'gave an unusable answer, asking again'
      : 'did not answer'
    this.deps.logger.warn(
      `Templatizer model ${what}${this.forSubject()}, round ${index}`,
      { reason: refused.slice(0, 300) },
    )
    const usage = usageOf(error)
    return {
      index,
      durationMs,
      refused,
      findings: [],
      ...(usage === undefined ? {} : { usage }),
    }
  }

  /** The trail says why the loop ended before the error leaves it. */
  private unavailable(error: unknown): ModelUnavailableError {
    const failure = `the model did not answer: ${getErrorMessage(error)}`
    this.writeSummary('failed', failure)
    return new ModelUnavailableError(failure, { cause: error })
  }

  private logRound(record: RoundRecord): void {
    this.deps.logger.info(
      `Templatizer round ${record.index} done${this.forSubject()}`,
      {
        errors: record.findings.length,
        durationMs: record.durationMs,
        inputTokens: record.usage?.inputTokens ?? 0,
        outputTokens: record.usage?.outputTokens ?? 0,
      },
    )
  }

  private forSubject(): string {
    return this.input.subject === undefined ? '' : ` for ${this.input.subject}`
  }

  private accepted(draft: Draft, round: RoundRecord): LoopResult {
    this.deps.artifacts.write('draft.json', JSON.stringify(draft, null, 2))
    this.writeSummary('accepted', undefined, round.index)
    return {
      status: 'accepted',
      draft,
      acceptedRound: round,
      rounds: this.rounds,
      model: this.model,
    }
  }

  private failed(): LoopResult {
    const failure = describeFailure(this.rounds)
    this.writeSummary('failed', failure)
    return { status: 'failed', failure, rounds: this.rounds, model: this.model }
  }

  private writeSummary(
    status: 'running' | 'accepted' | 'failed',
    failure?: string,
    acceptedRound?: number,
  ): void {
    this.deps.artifacts.write(
      'summary.json',
      JSON.stringify(
        {
          ...this.input.trail,
          status,
          failure,
          acceptedRound,
          threadId: this.threadId,
          model: this.model,
          rounds: this.rounds,
        },
        null,
        2,
      ),
    )
  }
}

/**
 * The findings, numbered with their paths, so the model can answer point by
 * point. The no-tools reminder is repeated here because a reported failure is
 * what tempts a model to go and investigate: DeepSeek answered the repair
 * message with shell commands (refused turns) although the system prompt
 * already forbids tools, and a refused repair round is not retried.
 */
export function repairMessage(findings: readonly Finding[]): string {
  return [
    `The draft has ${findings.length} error(s). Fix every one of them.`,
    '',
    ...findings.map(
      (finding, i) => `${i + 1}. at ${finding.path}: ${finding.message}`,
    ),
    '',
    'You have no tools: do not try to read files or run commands, fix the draft from the messages above alone.',
    'Return the whole corrected reply as one JSON object and nothing else.',
  ].join('\n')
}

function describeFailure(rounds: readonly RoundRecord[]): string {
  const last = rounds.at(-1)
  if (last?.refused !== undefined) {
    return `no acceptable draft after ${rounds.length} round(s); the last turn was refused: ${last.refused}`
  }
  const summary = (last?.findings ?? [])
    .map((finding) => `${finding.path}: ${finding.message}`)
    .join('; ')
  return `no acceptable draft after ${rounds.length} round(s); last errors: ${summary || '(none)'}`
}

function eventsOf(error: unknown): unknown[] {
  if (typeof error === 'object' && error !== null && 'events' in error) {
    const events = (error as { events: unknown }).events
    return Array.isArray(events) ? events : []
  }
  return []
}

/** What a refused turn cost, when the client could tell. */
function usageOf(error: unknown): ModelUsage | undefined {
  if (typeof error === 'object' && error !== null && 'usage' in error) {
    const usage = (error as { usage: unknown }).usage
    return typeof usage === 'object' && usage !== null
      ? (usage as ModelUsage)
      : undefined
  }
  return undefined
}

function toJsonl(events: readonly unknown[]): string {
  return `${events.map((event) => JSON.stringify(event)).join('\n')}\n`
}
