/**
 * `prepare <chain> <address>`: the RPC-facing start of the pipeline.
 *
 * The block is pinned when given, because benchmarks compare against a V1
 * entry at a known block and the provider must be at exactly that block,
 * not at the block V1 would resolve from its timestamp.
 */
import type { IProvider } from '@l2beat/discovery'
import { UnixTime } from '@l2beat/shared-pure'
import path from 'path'
import { getProvider, type ProviderTarget } from '../env/providers'
import { defaultPrepareDeps, prepare } from '../prepare/prepare'
import type { Prepared } from '../types/Prepared'
import type { CommandContext } from './context'
import { defaultRunDir, FILE_NAMES, parseAddress, writeJson } from './files'

export interface PrepareArgs {
  chain: string
  address: string
  blockNumber?: number
  timestamp?: number
  out?: string
}

export interface PrepareResult {
  prepared: Prepared
  provider: IProvider
  file: string
}

export async function prepareCommand(
  ctx: CommandContext,
  args: PrepareArgs,
): Promise<PrepareResult> {
  const address = parseAddress(args.chain, args.address)
  const provider = await getProvider(
    ctx.providers(),
    args.chain,
    providerTarget(args),
  )
  ctx.logger.info('Preparing', {
    chain: args.chain,
    address: address.toString(),
    blockNumber: provider.blockNumber,
  })
  const prepared = await prepare(defaultPrepareDeps(provider), address)
  for (const warning of prepared.warnings) {
    ctx.logger.warn(warning)
  }
  const outDir = args.out ?? defaultRunDir(args.chain, address)
  const file = writeJson(path.join(outDir, FILE_NAMES.prepared), prepared)
  ctx.logger.info('Prepared', {
    file,
    name: prepared.name,
    proxyType: prepared.proxy.type,
    shapeHash: prepared.shapeHash,
  })
  return { prepared, provider, file }
}

/** Block wins over timestamp; with neither, "now" as V1's discover does. */
export function providerTarget(args: {
  blockNumber?: number
  timestamp?: number
}): ProviderTarget {
  if (args.blockNumber !== undefined) {
    return { blockNumber: args.blockNumber }
  }
  return { timestamp: args.timestamp ?? UnixTime.now() }
}
