/**
 * `pipeline <chain> <address>`: prepare → baseline → worklist → plan →
 * validate → execute → output, with every intermediate file written.
 *
 * The plan comes from `--plan`, from the store by shape hash, or, with
 * `--author`, from the model when the store has nothing for the shape
 * (`--reauthor` asks the model even when it has). Without any of these an
 * address ends as a `missing` entry that still carries every deterministic
 * value. A plan that fails validation is not executed: the findings are
 * written and the entry is marked `failed`, the same outcome authoring
 * reaches after its repair rounds run out. An authored plan goes through
 * the same validate step as a stored one, so the pipeline has one path.
 */
import path from 'path'
import type { AuthoringResult } from '../author/author'
import { Library } from '../library/Library'
import type { Plan } from '../plan/Plan'
import { validatePlan } from '../plan/validatePlan'
import { PlanStore } from '../plans/PlanStore'
import type { PlanStatus } from '../types/EntryMeta'
import { type AuthorOptions, runAuthor } from './authorCommand'
import { runBaseline } from './baselineCommand'
import type { CommandContext } from './context'
import { runExecute } from './executeCommand'
import { FILE_NAMES, readPlan, writeJson } from './files'
import { type OutputFiles, writeEntry } from './outputCommand'
import { prepareCommand } from './prepareCommand'
import { countErrors } from './validateCommand'
import { writeWorklist } from './worklistCommand'

export interface PipelineArgs extends AuthorOptions {
  chain: string
  address: string
  blockNumber?: number
  timestamp?: number
  planFile?: string
  out?: string
  /** Ask the model when no plan applies. */
  author?: boolean
  /** Ask the model even when a stored plan applies. */
  reauthor?: boolean
}

export type PipelinePlanSource = 'file' | 'store' | 'model'

export interface PipelineResult extends OutputFiles {
  runDir: string
  planStatus: PlanStatus
  planSource?: PipelinePlanSource
  authoring?: AuthoringResult
}

export async function pipelineCommand(
  ctx: CommandContext,
  args: PipelineArgs,
): Promise<PipelineResult> {
  const { prepared, provider, file } = await prepareCommand(ctx, args)
  const runDir = args.out ?? path.dirname(file)
  const { baseline } = await runBaseline(ctx, provider, prepared, runDir)
  const { worklist } = writeWorklist(ctx, prepared.abi, runDir)

  let found = args.reauthor
    ? undefined
    : findPlan(ctx, args, prepared.shapeHash)
  let authoring: AuthoringResult | undefined
  if (found === undefined && (args.author || args.reauthor)) {
    const authored = await runAuthor(
      ctx,
      provider,
      { prepared, baseline, worklist },
      runDir,
      args,
    )
    authoring = authored.result
    if (authoring.status !== 'ok' || authoring.plan === undefined) {
      const files = writeEntry(
        ctx,
        { prepared, baseline, plan: authoring.plan, model: authoring.model },
        'failed',
        runDir,
      )
      return {
        ...files,
        runDir,
        planStatus: 'failed',
        planSource: 'model',
        authoring,
      }
    }
    found = { plan: authoring.plan, source: 'model' }
  }
  if (found === undefined) {
    ctx.logger.info('No plan for this shape; writing entry without plan fields')
    const files = writeEntry(ctx, { prepared, baseline }, 'missing', runDir)
    return { ...files, runDir, planStatus: 'missing' }
  }
  const model = authoring?.model
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
      { prepared, baseline, plan: found.plan, model },
      'failed',
      runDir,
    )
    return {
      ...files,
      runDir,
      planStatus: 'failed',
      planSource: found.source,
      authoring,
    }
  }

  const { executed } = await runExecute(
    ctx,
    provider,
    { prepared, baseline, plan: found.plan },
    runDir,
  )
  const files = writeEntry(
    ctx,
    { prepared, baseline, executed, plan: found.plan, model },
    executed.status,
    runDir,
  )
  return {
    ...files,
    runDir,
    planStatus: executed.status,
    planSource: found.source,
    authoring,
  }
}

function findPlan(
  ctx: CommandContext,
  args: PipelineArgs,
  shapeHash: string | undefined,
): { plan: Plan; source: PipelinePlanSource } | undefined {
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
