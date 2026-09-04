/**
 * Onchain backfill fetcher for the ossification factor.
 *
 * Discovery diff history only covers changes since a project was first
 * watched. For state changes that predate coverage (or fields discovery
 * cannot diff), this tool fetches the complete onchain log history of a
 * field's mutation event and prints ready-to-review `criticalEvents` entries
 * with exact transaction timestamps. The reviewer fills in the reason and
 * drops confirmed entries into the project's ossification.json.
 *
 * RPC endpoints come from packages/config/.env as <LONGCHAINNAME>_RPC_URL.
 * The event signature is hashed with `cast keccak` (foundry required) unless
 * a 32-byte topic0 is passed directly.
 */
import { execFileSync } from 'child_process'
import { getRpcUrl, rpc } from './rpc'

interface Log {
  transactionHash: string
  blockNumber: string
  logIndex: string
  topics: string[]
}

export interface FetchEventsOptions {
  target: string
  event: string
  from?: number
  to?: number
  type: string
  historical: boolean
  reason?: string
}

export async function runFetchEvents(options: FetchEventsOptions) {
  const { target, event } = options
  if (!target.includes(':')) {
    throw new Error('target must be <chain:address>')
  }
  const [shortChain, address] = target.split(':') as [string, string]
  const rpcUrl = getRpcUrl(shortChain)
  if (!rpcUrl) {
    throw new Error(
      `no RPC url for ${shortChain} in packages/config/.env or environment`,
    )
  }
  const topic0 = /^0x[0-9a-fA-F]{64}$/.test(event)
    ? event.toLowerCase()
    : execFileSync('cast', ['keccak', event], { encoding: 'utf8' }).trim()

  const latest = Number(await rpc(rpcUrl, 'eth_blockNumber', []))
  const fromBlock = options.from ?? 0
  const toBlock = options.to ?? latest

  console.error(
    `fetching ${event} (${topic0}) on ${target}, blocks ${fromBlock}..${toBlock}`,
  )
  const logs = await getLogsChunked(rpcUrl, address, topic0, fromBlock, toBlock)
  console.error(`${logs.length} log(s) found`)

  // one event per transaction: several logs in one tx are one decision
  const byTransaction = new Map<string, Log>()
  for (const log of logs) {
    if (!byTransaction.has(log.transactionHash)) {
      byTransaction.set(log.transactionHash, log)
    }
  }

  const blockNumbers = [
    ...new Set([...byTransaction.values()].map((log) => log.blockNumber)),
  ]
  const timestamps = new Map<string, number>()
  for (const blockNumber of blockNumbers) {
    const block = (await rpc(rpcUrl, 'eth_getBlockByNumber', [
      blockNumber,
      false,
    ])) as { timestamp: string }
    timestamps.set(blockNumber, Number(block.timestamp))
  }

  const entries = [...byTransaction.values()]
    .map((log) => ({
      timestamp: timestamps.get(log.blockNumber) ?? 0,
      type: options.type,
      contract: target,
      source: `tx:${log.transactionHash}`,
      reason: options.reason ?? `TODO: security consequence of ${event}`,
      ...(options.historical ? { historical: true } : {}),
    }))
    .sort((a, b) => a.timestamp - b.timestamp)

  console.log(JSON.stringify(entries, null, 2))
}

/** eth_getLogs with recursive range splitting on provider limits. */
async function getLogsChunked(
  rpcUrl: string,
  address: string,
  topic0: string,
  fromBlock: number,
  toBlock: number,
): Promise<Log[]> {
  try {
    return (await rpc(rpcUrl, 'eth_getLogs', [
      {
        address,
        topics: [topic0],
        fromBlock: `0x${fromBlock.toString(16)}`,
        toBlock: `0x${toBlock.toString(16)}`,
      },
    ])) as Log[]
  } catch (error) {
    if (fromBlock >= toBlock) throw error
    const middle = Math.floor((fromBlock + toBlock) / 2)
    return [
      ...(await getLogsChunked(rpcUrl, address, topic0, fromBlock, middle)),
      ...(await getLogsChunked(rpcUrl, address, topic0, middle + 1, toBlock)),
    ]
  }
}
