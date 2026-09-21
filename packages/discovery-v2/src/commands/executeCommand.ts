/**
 * `execute <prepared> <baseline> <plan>`: run a plan, write `values.json`.
 *
 * The plan is schema-checked on read but not validated against the worklist
 * here; that is `validate`'s job and `pipeline` runs both. Running an
 * unvalidated plan is allowed on purpose so a step can be tried in
 * isolation while a plan is being written.
 */
import type { IProvider } from '@l2beat/discovery'
import path from 'path'
import { type Executed, executePlan } from '../execute/executePlan'
import { Library } from '../library/Library'
import type { Plan } from '../plan/Plan'
import type { Baseline } from '../types/Baseline'
import type { Prepared } from '../types/Prepared'
import { providerFor } from './baselineCommand'
import type { CommandContext } from './context'
import {
  FILE_NAMES,
  readBaseline,
  readPlan,
  readPrepared,
  writeJson,
} from './files'

export interface ExecuteArgs {
  preparedFile: string
  baselineFile: string
  planFile: string
  out?: string
}

export async function executeCommand(
  ctx: CommandContext,
  args: ExecuteArgs,
): Promise<{ executed: Executed; file: string }> {
  const prepared = readPrepared(args.preparedFile)
  const baseline = readBaseline(args.baselineFile)
  const plan = readPlan(args.planFile)
  const provider = await providerFor(ctx, prepared)
  const outDir = args.out ?? path.dirname(args.preparedFile)
  return await runExecute(ctx, provider, { prepared, baseline, plan }, outDir)
}

export async function runExecute(
  ctx: CommandContext,
  provider: IProvider,
  input: { prepared: Prepared; baseline: Baseline; plan: Plan },
  outDir: string,
): Promise<{ executed: Executed; file: string }> {
  const library = Library.load()
  try {
    const executed = await executePlan(provider, { ...input, library })
    const file = writeJson(path.join(outDir, FILE_NAMES.values), executed)
    ctx.logger.info('Executed', {
      file,
      status: executed.status,
      steps: input.plan.steps.length,
      failed: Object.values(executed.fields).filter((f) => f.error).length,
    })
    return { executed, file }
  } finally {
    await library.close()
  }
}
