/**
 * `pipeline <chain> <address>`: prepare → baseline → worklist → plan →
 * validate → execute → output, with every intermediate file written.
 *
 * The plan comes from `--plan` or from the store by shape hash; authoring
 * (the model step) is a later milestone and is deliberately absent, so an
 * address whose shape has no stored plan ends as a `missing` entry that
 * still carries every deterministic value. A plan that fails validation is
 * not executed: the findings are written and the entry is marked `failed`,
 * the same outcome authoring reaches after its repair rounds run out.
 */
import path from 'path'
import { Library } from '../library/Library'
import type { Plan } from '../plan/Plan'
import { validatePlan } from '../plan/validatePlan'
import { PlanStore } from '../plans/PlanStore'
import type { PlanStatus } from '../types/EntryMeta'
import { runBaseline } from './baselineCommand'
import type { CommandContext } from './context'
import { runExecute } from './executeCommand'
import { FILE_NAMES, readPlan, writeJson } from './files'
import { type OutputFiles, writeEntry } from './outputCommand'
import { prepareCommand } from './prepareCommand'
import { countErrors } from './validateCommand'
import { writeWorklist } from './worklistCommand'

export interface PipelineArgs {
  chain: string
  address: string
  blockNumber?: number
  timestamp?: number
  planFile?: string
  out?: string
  planStore?: PlanStore
}

export interface PipelineResult extends OutputFiles {
  runDir: string
  planStatus: PlanStatus
  planSource?: 'file' | 'store'
}

export async function pipelineCommand(
  ctx: CommandContext,
  args: PipelineArgs,
): Promise<PipelineResult> {
  const { prepared, provider, file } = await prepareCommand(ctx, args)
  const runDir = args.out ?? path.dirname(file)
  const { baseline } = await runBaseline(ctx, provider, prepared, runDir)
  const { worklist } = writeWorklist(ctx, prepared.abi, runDir)

  const found = findPlan(ctx, args, prepared.shapeHash)
  if (found === undefined) {
    ctx.logger.info('No plan for this shape; writing entry without plan fields')
    const files = writeEntry(ctx, { prepared, baseline }, 'missing', runDir)
    return { ...files, runDir, planStatus: 'missing' }
  }
  writeJson(path.join(runDir, FILE_NAMES.plan), found.plan)

  const findings = await withLibrary((library) =>
    validatePlan(found.plan, { prepared, baseline, worklist, library }),
  )
  writeJson(path.join(runDir, FILE_NAMES.findings), findings)
  const errors = countErrors(findings)
  ctx.logger.info('Plan validated', {
    errors,
    warnings: findings.length - errors,
  })
  if (errors > 0) {
    const files = writeEntry(
      ctx,
      { prepared, baseline, plan: found.plan },
      'failed',
      runDir,
    )
    return { ...files, runDir, planStatus: 'failed', planSource: found.source }
  }

  const { executed } = await runExecute(
    ctx,
    provider,
    { prepared, baseline, plan: found.plan },
    runDir,
  )
  const files = writeEntry(
    ctx,
    { prepared, baseline, executed, plan: found.plan },
    executed.status,
    runDir,
  )
  return {
    ...files,
    runDir,
    planStatus: executed.status,
    planSource: found.source,
  }
}

function findPlan(
  ctx: CommandContext,
  args: PipelineArgs,
  shapeHash: string | undefined,
): { plan: Plan; source: 'file' | 'store' } | undefined {
  if (args.planFile !== undefined) {
    ctx.logger.info('Using plan file', { file: args.planFile })
    return { plan: readPlan(args.planFile), source: 'file' }
  }
  if (shapeHash === undefined) {
    return undefined
  }
  const stored = (args.planStore ?? new PlanStore()).load(shapeHash)
  if (stored === undefined) {
    return undefined
  }
  ctx.logger.info('Using stored plan', { shapeHash, ...stored.provenance })
  return { plan: stored.plan, source: 'store' }
}

async function withLibrary<T>(fn: (library: Library) => T): Promise<T> {
  const library = Library.load()
  try {
    return await fn(library)
  } finally {
    await library.close()
  }
}
