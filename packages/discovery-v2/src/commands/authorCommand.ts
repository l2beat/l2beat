/**
 * `author <prepared> <baseline> <worklist>`: the model step, on its own.
 *
 * Runs the authoring loop against the real provider (the dry run needs it)
 * and writes `plan.json` plus the round-by-round trail under `<out>/author/`.
 * A failed authoring still writes the last statically valid plan, if any,
 * so the run directory shows what the model almost got right; only an
 * accepted plan reaches the store, and only when storing was not disabled.
 */
import type { IProvider } from '@l2beat/discovery'
import path from 'path'
import { FileArtifactSink } from '../author/ArtifactSink'
import { type AuthoringResult, author } from '../author/author'
import { CodexClient, type ReasoningEffort } from '../author/codex/CodexClient'
import type { ModelClient } from '../author/codex/ModelClient'
import { Library } from '../library/Library'
import { PlanStore } from '../plans/PlanStore'
import type { Baseline } from '../types/Baseline'
import type { Prepared } from '../types/Prepared'
import type { Worklist } from '../types/Worklist'
import { providerFor } from './baselineCommand'
import type { CommandContext } from './context'
import {
  FILE_NAMES,
  readBaseline,
  readPrepared,
  readWorklist,
  writeJson,
} from './files'

export const AUTHOR_DIR = 'author'

export interface AuthorOptions {
  model?: string
  reasoning?: ReasoningEffort
  /** Repair rounds after the first turn. */
  maxRounds?: number
  /** `false` keeps an accepted plan out of `plans/`. */
  store?: boolean
  /** Replaces Codex, for tests. */
  modelClient?: ModelClient
  planStore?: PlanStore
}

export interface AuthorArgs extends AuthorOptions {
  preparedFile: string
  baselineFile: string
  worklistFile: string
  out?: string
}

export interface AuthorFiles {
  result: AuthoringResult
  planFile?: string
  artifactsDir: string
}

export async function authorCommand(
  ctx: CommandContext,
  args: AuthorArgs,
): Promise<AuthorFiles> {
  const prepared = readPrepared(args.preparedFile)
  const baseline = readBaseline(args.baselineFile)
  const worklist = readWorklist(args.worklistFile)
  const provider = await providerFor(ctx, prepared)
  const outDir = args.out ?? path.dirname(args.preparedFile)
  return await runAuthor(
    ctx,
    provider,
    { prepared, baseline, worklist },
    outDir,
    args,
  )
}

export async function runAuthor(
  ctx: CommandContext,
  provider: IProvider,
  input: { prepared: Prepared; baseline: Baseline; worklist: Worklist },
  outDir: string,
  options: AuthorOptions,
): Promise<AuthorFiles> {
  const library = Library.load()
  const artifactsDir = path.join(outDir, AUTHOR_DIR)
  try {
    const result = await author(
      {
        model: options.modelClient ?? createCodexClient(options),
        provider,
        library,
        planStore:
          options.store === false
            ? undefined
            : (options.planStore ?? new PlanStore()),
        artifacts: new FileArtifactSink(artifactsDir),
        logger: ctx.logger,
      },
      input,
      {
        maxRepairRounds: options.maxRounds,
        model: options.model,
      },
    )
    const planFile =
      result.plan === undefined
        ? undefined
        : writeJson(path.join(outDir, FILE_NAMES.plan), result.plan)
    const last = result.rounds[result.rounds.length - 1]
    writeJson(path.join(outDir, FILE_NAMES.findings), last?.findings ?? [])
    ctx.logger.info('Authoring finished', {
      status: result.status,
      rounds: result.rounds.length,
      model: result.model ?? 'unknown',
      threadId: result.threadId ?? 'none',
      planFile: planFile ?? 'none',
      stored: result.storedFile ?? 'no',
      artifactsDir,
    })
    return { result, planFile, artifactsDir }
  } finally {
    await library.close()
  }
}

function createCodexClient(options: AuthorOptions): CodexClient {
  return new CodexClient({
    model: options.model,
    reasoningEffort: options.reasoning,
  })
}

/** One line for the terminal: what happened, in numbers. */
export function summariseAuthoring(result: AuthoringResult): string {
  const plan = result.plan
  const usage = result.rounds.reduce(
    (sum, round) => ({
      input: sum.input + (round.usage?.inputTokens ?? 0),
      output: sum.output + (round.usage?.outputTokens ?? 0),
    }),
    { input: 0, output: 0 },
  )
  const durationMs = result.rounds.reduce(
    (sum, round) => sum + round.durationMs,
    0,
  )
  return [
    `status=${result.status}`,
    `rounds=${result.rounds.length}`,
    `steps=${plan?.steps.length ?? 0}`,
    `skips=${plan?.skips.length ?? 0}`,
    `model=${result.model ?? 'unknown'}`,
    `tokens=${usage.input}+${usage.output}`,
    `time=${Math.round(durationMs / 1000)}s`,
    ...(result.failure === undefined
      ? []
      : [`failure=${JSON.stringify(result.failure)}`]),
  ].join(' ')
}
