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
 * Usage:
 *   npx tsx scripts/ossification-fetch-events.ts <chain:address> <eventSigOrTopic0> \
 *     [--from <block>] [--to <block>] [--type state|code] [--historical] \
 *     [--reason "<security consequence>"]
 *
 * Examples:
 *   npx tsx scripts/ossification-fetch-events.ts \
 *     eth:0xc4448b71118c9071Bcb9734A0EAc55D18A153949 'ProgramHashChanged(address,uint256,uint256)'
 *   npx tsx scripts/ossification-fetch-events.ts \
 *     eth:0x... 0x8b0e... --from 15000000 --type state
 *
 * RPC endpoints come from packages/config/.env as <LONGCHAINNAME>_RPC_URL.
 * The event signature is hashed with `cast keccak` (foundry required) unless
 * a 32-byte topic0 is passed directly.
 */
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { execFileSync } from 'child_process'
import { readFileSync } from 'fs'
import path from 'path'

interface Log {
  transactionHash: string
  blockNumber: string
  logIndex: string
  topics: string[]
}

async function main() {
  const args = process.argv.slice(2)
  const positional = args.filter((arg) => !arg.startsWith('--'))
  const option = (name: string) => {
    const index = args.indexOf(`--${name}`)
    return index >= 0 ? args[index + 1] : undefined
  }
  const flag = (name: string) => args.includes(`--${name}`)

  const [target, event] = positional
  if (!target || !event || !target.includes(':')) {
    console.error(
      'usage: ossification-fetch-events.ts <chain:address> <eventSigOrTopic0> [--from N] [--to N] [--type state|code] [--historical] [--reason "..."]',
    )
    process.exit(1)
  }

  const [shortChain, address] = target.split(':') as [string, string]
  const rpcUrl = getRpcUrl(shortChain)
  const topic0 = /^0x[0-9a-fA-F]{64}$/.test(event)
    ? event.toLowerCase()
    : execFileSync('cast', ['keccak', event], { encoding: 'utf8' }).trim()

  const latest = Number(await rpc(rpcUrl, 'eth_blockNumber', []))
  const fromBlock = Number(option('from') ?? 0)
  const toBlock = Number(option('to') ?? latest)

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
      type: option('type') ?? 'state',
      contract: target,
      source: `tx:${log.transactionHash}`,
      reason: option('reason') ?? `TODO: security consequence of ${event}`,
      ...(flag('historical') ? { historical: true } : {}),
    }))
    .sort((a, b) => a.timestamp - b.timestamp)

  console.log(JSON.stringify(entries, null, 2))
}

function getRpcUrl(shortChain: string): string {
  const longName = ChainSpecificAddress.longChain(
    `${shortChain}:0x0000000000000000000000000000000000000000` as Parameters<
      typeof ChainSpecificAddress.longChain
    >[0],
  )
  const envName = `${longName.toUpperCase().replace(/-/g, '')}_RPC_URL`
  const envFile = readFileSync(
    path.join(process.cwd(), '../config/.env'),
    'utf8',
  )
  const match = new RegExp(`^${envName}=(.+)$`, 'm').exec(envFile)
  const url = process.env[envName] ?? match?.[1]
  if (!url) {
    throw new Error(`no ${envName} in packages/config/.env or environment`)
  }
  return url.trim()
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

let requestId = 0
async function rpc(
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

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
