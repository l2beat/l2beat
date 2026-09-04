/**
 * Shared JSON-RPC helpers for the ossification backfill and audit tooling.
 *
 * RPC endpoints come from packages/config/.env as <LONGCHAINNAME>_RPC_URL,
 * the same convention the discovery engine uses.
 */
import { getDiscoveryPaths } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { readFileSync } from 'fs'
import path from 'path'

/** Undefined when the chain has no endpoint configured; callers decide
 *  whether that is fatal (a backfill) or a skipped check (an audit). */
export function getRpcUrl(shortChain: string): string | undefined {
  return getRpcUrlForChain(
    ChainSpecificAddress.longChain(
      `${shortChain}:0x0000000000000000000000000000000000000000` as Parameters<
        typeof ChainSpecificAddress.longChain
      >[0],
    ),
  )
}

/** Same lookup keyed by the chain's long name, as carried by chainConfig. */
export function getRpcUrlForChain(longName: string): string | undefined {
  const envName = `${longName.toUpperCase().replace(/-/g, '')}_RPC_URL`
  let fromFile: string | undefined
  try {
    // packages/config/src/projects -> packages/config/.env
    const envFile = readFileSync(
      path.resolve(getDiscoveryPaths().discovery, '../../.env'),
      'utf8',
    )
    fromFile = new RegExp(`^${envName}=(.+)$`, 'm').exec(envFile)?.[1]
  } catch {
    fromFile = undefined
  }
  return (process.env[envName] ?? fromFile)?.trim()
}

let requestId = 0
export async function rpc(
  rpcUrl: string,
  method: string,
  params: unknown[],
): Promise<unknown> {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++requestId, method, params }),
  })
  const body = (await response.json()) as {
    result?: unknown
    error?: { message?: string }
  }
  if (body.error || body.result === undefined) {
    throw new Error(`${method} failed: ${body.error?.message ?? 'no result'}`)
  }
  return body.result
}

/** Block timestamp of each transaction, null when the chain does not know the
 *  hash (a wrong chain guess or a reorged-out anchor). Block lookups are
 *  cached, so a governance batch costs one call per block. */
export async function getTransactionTimestamps(
  rpcUrl: string,
  transactionHashes: string[],
  concurrency = 8,
): Promise<Map<string, number | null>> {
  const timestamps = new Map<string, number | null>()
  const blockTimestamps = new Map<string, number>()
  const queue = [...new Set(transactionHashes)]

  const worker = async () => {
    for (;;) {
      const hash = queue.shift()
      if (hash === undefined) return
      const receipt = (await rpc(rpcUrl, 'eth_getTransactionReceipt', [
        hash,
      ])) as { blockNumber?: string } | null
      const blockNumber = receipt?.blockNumber
      if (blockNumber === undefined) {
        timestamps.set(hash, null)
        continue
      }
      let blockTimestamp = blockTimestamps.get(blockNumber)
      if (blockTimestamp === undefined) {
        const block = (await rpc(rpcUrl, 'eth_getBlockByNumber', [
          blockNumber,
          false,
        ])) as { timestamp: string }
        blockTimestamp = Number(block.timestamp)
        blockTimestamps.set(blockNumber, blockTimestamp)
      }
      timestamps.set(hash, blockTimestamp)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, queue.length) }, worker),
  )
  return timestamps
}
