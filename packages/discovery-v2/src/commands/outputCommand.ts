/**
 * `output <prepared> <baseline> [values] [plan]`: the V1-shaped entry.
 *
 * Without `values.json` the entry holds proxy values and baseline getters
 * only and is marked `missing`, which is what a contract whose shape has no
 * stored plan looks like. The status can be forced for the `failed` case,
 * where a plan existed but never validated and no values were produced.
 */
import path from 'path'
import type { Executed } from '../execute/executePlan'
import {
  type EntryMetaInput,
  type EntryOutput,
  toEntry,
} from '../output/toEntry'
import type { Plan } from '../plan/Plan'
import { decisionHash } from '../plans/decisionHash'
import { planHash } from '../plans/planHash'
import type { Baseline } from '../types/Baseline'
import type { PlanStatus } from '../types/EntryMeta'
import type { Prepared } from '../types/Prepared'
import type { CommandContext } from './context'
import {
  FILE_NAMES,
  readBaseline,
  readExecuted,
  readPlan,
  readPrepared,
  writeJson,
} from './files'

export interface OutputArgs {
  preparedFile: string
  baselineFile: string
  valuesFile?: string
  planFile?: string
  status?: PlanStatus
  out?: string
}

export interface OutputFiles {
  output: EntryOutput
  entryFile: string
  metaFile: string
}

export const EMPTY_EXECUTED: Executed = { fields: {}, raw: {}, status: 'ok' }

export function outputCommand(
  ctx: CommandContext,
  args: OutputArgs,
): OutputFiles {
  const prepared = readPrepared(args.preparedFile)
  const baseline = readBaseline(args.baselineFile)
  const executed =
    args.valuesFile === undefined ? undefined : readExecuted(args.valuesFile)
  const plan = args.planFile === undefined ? undefined : readPlan(args.planFile)
  const outDir = args.out ?? path.dirname(args.preparedFile)
  return writeEntry(
    ctx,
    { prepared, baseline, executed, plan },
    args.status,
    outDir,
  )
}

export function writeEntry(
  ctx: CommandContext,
  input: {
    prepared: Prepared
    baseline: Baseline
    executed?: Executed
    plan?: Plan
    /** The model that authored the plan, for `entry.meta.json`. */
    model?: string
  },
  status: PlanStatus | undefined,
  outDir: string,
): OutputFiles {
  const executed = input.executed ?? EMPTY_EXECUTED
  const meta: EntryMetaInput = {
    planStatus: status ?? defaultStatus(input.executed),
    planHash: input.plan === undefined ? undefined : planHash(input.plan),
    decisionHash:
      input.plan === undefined ? undefined : decisionHash(input.plan),
    model: input.model,
    plan: input.plan,
  }
  const output = toEntry(input.prepared, input.baseline, executed, meta)
  const entryFile = writeJson(path.join(outDir, FILE_NAMES.entry), output.entry)
  const metaFile = writeJson(
    path.join(outDir, FILE_NAMES.entryMeta),
    output.meta,
  )
  ctx.logger.info('Entry written', {
    entryFile,
    metaFile,
    planStatus: output.meta.planStatus,
    values: Object.keys(output.entry.values ?? {}).length,
    errors: Object.keys(output.entry.errors ?? {}).length,
    relatives: output.relatives.length,
  })
  return { output, entryFile, metaFile }
}

function defaultStatus(executed: Executed | undefined): PlanStatus {
  return executed === undefined ? 'missing' : executed.status
}
