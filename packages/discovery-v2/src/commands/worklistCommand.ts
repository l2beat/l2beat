/**
 * `worklist <preparedFile>`: the closed list of items the model must rule on.
 * Pure: a function of the prepared ABI only.
 */
import path from 'path'
import { buildWorklist, type Worklist } from '../types/Worklist'
import type { CommandContext } from './context'
import { FILE_NAMES, readPrepared, writeJson } from './files'

export interface WorklistArgs {
  preparedFile: string
  out?: string
}

export function worklistCommand(
  ctx: CommandContext,
  args: WorklistArgs,
): { worklist: Worklist; file: string } {
  const prepared = readPrepared(args.preparedFile)
  const outDir = args.out ?? path.dirname(args.preparedFile)
  return writeWorklist(ctx, prepared.abi, outDir)
}

export function writeWorklist(
  ctx: CommandContext,
  abi: string[],
  outDir: string,
): { worklist: Worklist; file: string } {
  const worklist = buildWorklist(abi)
  const file = writeJson(path.join(outDir, FILE_NAMES.worklist), worklist)
  ctx.logger.info('Worklist built', {
    file,
    items: worklist.items.length,
    events: worklist.events.length,
  })
  return { worklist, file }
}
