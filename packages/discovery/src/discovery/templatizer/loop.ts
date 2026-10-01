/**
 * The authoring loop: prompt, check, repair, until a draft passes.
 *
 * The model is the only non-deterministic actor, so everything around it
 * is mechanical: the prompt is a pure function of the contract, the repair
 * message is the findings verbatim, and a draft is accepted only when the
 * validator reports no error and the dry run on the real provider produces
 * no field error. There is no general review turn after acceptance: in the
 * research benchmark it found nothing the mechanical checks had not. The
 * one extra turn is for advisories (see `Finding`): a draft with no error
 * but with advisories is shown them once, and whatever comes back without
 * an error is accepted. That turn can only help: if its reply cannot be
 * repaired, the draft it was asked about is accepted instead.
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
import {
  advisoriesOf,
  countErrors,
  type Finding,
  hasErrors,
} from './draft/Finding'
import {
  type ValidationContext,
  validateDraftText,
} from './draft/validateDraft'
import type { ModelClient, ModelTurn, ModelUsage } from './model/ModelClient'
import { draftJsonSchema } from './prompt/draftJsonSchema'

export const DEFAULT_MAX_ROUNDS = 3

export interface LoopDeps {
  model: ModelClient
  artifacts: ArtifactSink
  logger: Logger
  dryRun: (
    draft: Draft,
  ) => Promise<{ record: DryRunRecord; findings: Finding[] }>
}

export interface LoopInput {
  prompt: string
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
      /** The round whose draft this is: its dry run and advisories go into the template. */
      acceptedRound: RoundRecord
      rounds: RoundRecord[]
      model?: string
    }
  | { status: 'failed'; failure: string; rounds: RoundRecord[]; model?: string }

interface Candidate {
  draft: Draft
  round: RoundRecord
}

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
    let askedAbout: Candidate | undefined
    while (this.rounds.length < this.maxRounds) {
      const index = this.rounds.length + 1
      const outcome = await this.round(index, message)
      this.rounds.push(outcome.record)
      this.writeSummary('running')
      if (outcome.draft !== undefined) {
        const candidate = { draft: outcome.draft, round: outcome.record }
        if (askedAbout !== undefined || !this.worthAsking(candidate)) {
          return this.accepted(candidate)
        }
        askedAbout = candidate
        message = advisoryMessage(advisoriesOf(outcome.record.findings))
        continue
      }
      // A refused turn is asked again as it was: the refusal says nothing
      // about the draft, so there is nothing to repair.
      if (outcome.record.refused === undefined) {
        message = repairMessage(outcome.record.findings)
      }
    }
    return askedAbout !== undefined ? this.accepted(askedAbout) : this.failed()
  }

  /** Advisories are asked about only while a round is left to answer them. */
  private worthAsking(candidate: Candidate): boolean {
    return (
      advisoriesOf(candidate.round.findings).length > 0 &&
      this.rounds.length < this.maxRounds
    )
  }

  private async round(
    index: number,
    message: string,
  ): Promise<{ record: RoundRecord; draft?: Draft }> {
    this.deps.artifacts.write(`round-${index}.prompt.md`, message)
    const started = Date.now()
    let turn: ModelTurn
    try {
      turn = await this.turn(message)
    } catch (error) {
      return { record: this.refusedRound(index, error, Date.now() - started) }
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
    if (validated.draft === undefined || hasErrors(record.findings)) {
      return undefined
    }
    const dry = await this.deps.dryRun(validated.draft)
    record.dryRun = dry.record
    record.findings.push(...dry.findings)
    this.deps.artifacts.write(
      `round-${index}.dryrun.json`,
      JSON.stringify(dry.record, null, 2),
    )
    return hasErrors(record.findings) ? undefined : validated.draft
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

  /** A refused turn still happened; its events are the evidence for why. */
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
    this.deps.logger.warn('Templatizer model turn refused', {
      round: index,
      reason: refused.slice(0, 300),
    })
    return { index, durationMs, refused, findings: [] }
  }

  private logRound(record: RoundRecord): void {
    const errors = countErrors(record.findings)
    const advisories = advisoriesOf(record.findings).length
    this.deps.logger.info('Templatizer round', {
      round: record.index,
      errors,
      advisories,
      warnings: record.findings.length - errors - advisories,
      durationMs: record.durationMs,
      inputTokens: record.usage?.inputTokens ?? 0,
      outputTokens: record.usage?.outputTokens ?? 0,
    })
  }

  private accepted({ draft, round }: Candidate): LoopResult {
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

/** Errors first, then advisories, then warnings, numbered, so the model can answer point by point. */
export function repairMessage(findings: readonly Finding[]): string {
  const errors = countErrors(findings)
  const advisories = advisoriesOf(findings).length
  const intro =
    advisories === 0
      ? `The draft has ${errors} error(s) and ${findings.length - errors} warning(s). Fix every error; treat warnings as hints to check.`
      : `The draft has ${errors} error(s), ${advisories} advisory point(s) and ${findings.length - errors - advisories} warning(s). Fix every error; reconsider each advisory point, which may be right as it is; treat warnings as hints to check.`
  return [
    intro,
    '',
    ...numbered(bySeverity(findings)),
    '',
    'Return the whole corrected draft as one JSON object and nothing else.',
  ].join('\n')
}

/** The one turn a draft without errors gets for its advisories. */
export function advisoryMessage(advisories: readonly Finding[]): string {
  return [
    `The draft passes every check. The ${advisories.length} point(s) below are judgments, not errors: each names something that is usually a mistake. Change the draft where one applies; where the draft is right as it is, leave that part unchanged. Your reply is accepted unless it has errors, and the points that still apply are written into the template for the reviewer.`,
    '',
    ...numbered(advisories),
    '',
    'Return the whole draft as one JSON object and nothing else, changed or not.',
  ].join('\n')
}

const SEVERITY_ORDER: Finding['severity'][] = ['error', 'advisory', 'warning']

function bySeverity(findings: readonly Finding[]): Finding[] {
  return SEVERITY_ORDER.flatMap((severity) =>
    findings.filter((finding) => finding.severity === severity),
  )
}

function numbered(findings: readonly Finding[]): string[] {
  return findings.map(
    (finding, i) =>
      `${i + 1}. ${finding.severity} at ${finding.path}: ${finding.message}`,
  )
}

function describeFailure(rounds: readonly RoundRecord[]): string {
  const last = rounds.at(-1)
  if (last?.refused !== undefined) {
    return `no acceptable draft after ${rounds.length} round(s); the last turn was refused: ${last.refused}`
  }
  const errors = (last?.findings ?? []).filter(
    (finding) => finding.severity === 'error',
  )
  const summary = errors
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

function toJsonl(events: readonly unknown[]): string {
  return `${events.map((event) => JSON.stringify(event)).join('\n')}\n`
}
