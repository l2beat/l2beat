/**
 * `baseline <preparedFile>`: every 0-arg getter at the prepared block.
 *
 * The provider is re-created at `prepared.blockNumber` rather than taken
 * from the caller, so a baseline built in a separate process from `prepare`
 * still reads state at the same block.
 */
import type { IProvider } from '@l2beat/discovery'
import path from 'path'
import { buildBaseline } from '../baseline/buildBaseline'
import { getProvider } from '../env/providers'
import type { Baseline } from '../types/Baseline'
import type { Prepared } from '../types/Prepared'
import type { CommandContext } from './context'
import { FILE_NAMES, readPrepared, writeJson } from './files'

export interface BaselineArgs {
  preparedFile: string
  out?: string
}

export async function baselineCommand(
  ctx: CommandContext,
  args: BaselineArgs,
): Promise<{ baseline: Baseline; file: string }> {
  const prepared = readPrepared(args.preparedFile)
  const provider = await providerFor(ctx, prepared)
  const outDir = args.out ?? path.dirname(args.preparedFile)
  return await runBaseline(ctx, provider, prepared, outDir)
}

export async function runBaseline(
  ctx: CommandContext,
  provider: IProvider,
  prepared: Prepared,
  outDir: string,
): Promise<{ baseline: Baseline; file: string }> {
  const baseline = await buildBaseline(provider, prepared)
  const file = writeJson(path.join(outDir, FILE_NAMES.baseline), baseline)
  const fields = Object.values(baseline.fields)
  ctx.logger.info('Baseline built', {
    file,
    getters: fields.length,
    errors: fields.filter((field) => field.error !== undefined).length,
  })
  return { baseline, file }
}

export function providerFor(
  ctx: CommandContext,
  prepared: Pick<Prepared, 'chain' | 'blockNumber'>,
): Promise<IProvider> {
  return getProvider(ctx.providers(), prepared.chain, {
    blockNumber: prepared.blockNumber,
  })
}
