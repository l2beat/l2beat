import { createClient } from '@clickhouse/client'

type EthRpcError = {
  code: number
  message: string
  data?: unknown
}

type EthLog = {
  address: string
  topics: string[]
  data: string
  blockNumber?: string
  transactionHash?: string
  transactionIndex?: string
  blockHash?: string
  logIndex?: string
  removed?: boolean
  [key: string]: unknown
}

type EthGetBlockReceiptsResult = {
  logs: EthLog[]
  [key: string]: unknown
}[]

type EthRpcResponse =
  | {
      jsonrpc: string
      id: number
      result: EthGetBlockReceiptsResult
      error?: undefined
    }
  | {
      jsonrpc: string
      id: number
      error: EthRpcError
      result?: undefined
    }

const ETH_RPC_URL = 'https://1.rpc.hypersync.xyz'

const LOGS_METHOD = 'eth_getLogs'
type EthGetLogsResponse =
  | {
      jsonrpc: string
      id: number
      result: EthLog[]
      error?: undefined
    }
  | {
      jsonrpc: string
      id: number
      error: EthRpcError
      result?: undefined
    }

function normalizeBlockTag(blockNumber: number | string): string {
  if (typeof blockNumber === 'number') {
    if (!Number.isInteger(blockNumber) || blockNumber < 0) {
      throw new Error('Block number must be a non-negative integer.')
    }
    return `0x${blockNumber.toString(16)}`
  }

  if (!blockNumber.startsWith('0x')) {
    const parsed = Number(blockNumber)
    if (!Number.isFinite(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
      throw new Error(
        'Block number string must be a non-negative integer or hex string.',
      )
    }
    return `0x${parsed.toString(16)}`
  }

  return blockNumber
}

export async function getBlockLogs2(
  fromBlock: number | string,
  toBlock: number | string,
): Promise<EthLog[]> {
  const normalizedFromBlock = normalizeBlockTag(fromBlock)
  const normalizedToBlock = normalizeBlockTag(toBlock)

  const payload = JSON.stringify({
    jsonrpc: '2.0',
    id: Date.now(),
    method: LOGS_METHOD,
    params: [
      {
        fromBlock: normalizedFromBlock,
        toBlock: normalizedToBlock,
      },
    ],
  })

  const response = await fetch(ETH_RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
    signal: AbortSignal.timeout(30_000),
  })

  if (!response.ok) {
    throw new Error(`Ethereum RPC responded with HTTP ${response.status}`)
  }

  let parsed: EthGetLogsResponse
  try {
    parsed = (await response.json()) as EthGetLogsResponse
  } catch (error) {
    throw new Error(`Failed to parse Ethereum node response: ${String(error)}`)
  }

  if ('error' in parsed && parsed.error) {
    throw new Error(
      `Ethereum RPC error ${parsed.error.code}: ${parsed.error.message}`,
    )
  }

  if (!parsed.result) {
    throw new Error('Ethereum RPC response did not include result.')
  }

  return parsed.result.filter((l) => !l.removed)
}

export const ch = createClient({
  host: process.env.CH_HOST ?? 'http://127.0.0.1:8123',
  username: process.env.CH_USER ?? 'default',
  password: process.env.CH_PASS ?? '',
  clickhouse_settings: {
    async_insert: 1,
    wait_for_async_insert: 1,
    async_insert_use_adaptive_busy_timeout: 1,
    date_time_input_format: 'best_effort', // allow JS Date for DateTime64
  },
})

const canon = (hex: string | undefined, width: 40 | 64) => {
  if (!hex) return ''.padStart(width, '0')                 // all zeros
  let h = hex.toLowerCase()
  if (h.startsWith('0x')) h = h.slice(2)
  if (h.length > width) throw new Error(`hex longer than ${width}: ${hex}`)
  return h.padStart(width, '0')
}

function toRows(logs: EthLog[]) {
  return logs.map(l => ({
    address_hex:  canon(l.address, 40),
    topic0_hex:   canon(l.topics?.[0], 64),
    topic1_hex:   canon(l.topics?.[1], 64),
    topic2_hex:   canon(l.topics?.[2], 64),
    topic3_hex:   canon(l.topics?.[3], 64),
    tx_hash_hex:  canon(l.transactionHash, 64),
    data:         l.data ?? '',                          // you can keep hex here too if you want
    block_number: l.blockNumber ? parseInt(l.blockNumber, 16) : 0,
    log_index:    l.logIndex ? parseInt(l.logIndex, 16) : 0,
  }))
}

export async function insertBlockLogs(logs: EthLog[]) {
  const values = toRows(logs)
  await ch.insert({
    table: 'logs_eth',
    values,
    format: 'JSONEachRow',
  })
}

export async function getMaxBlock() {
  const rs = await ch.query({
    query: 'SELECT max(block_number) AS max_bn FROM logs_eth',
    format: 'JSONEachRow',
  });
  const [{ max_bn = 0 }] = await rs.json<{ max_bn: number }>();
  return max_bn
}

const STEP = 100
const MAX_BLOCK = 23611639

function formatElapsed(ms: number) {
  const hours = Math.floor(ms / 3_600_000)
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  const seconds = Math.floor((ms % 60_000) / 1_000)
  const pad = (value: number) => value.toString().padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

async function main() {
  const from = await getMaxBlock()
  const loopStartedAt = Date.now()
  const buffer: EthLog[] = []
  let lastProcessedBlock = from
  for (let bn = from; bn < MAX_BLOCK; bn += STEP) {
    const logs = await getBlockLogs2(bn, bn + STEP - 1)
    lastProcessedBlock = Math.min(bn + STEP - 1, MAX_BLOCK)
    for (const log of logs) {
      buffer.push(log)
    }
    if (buffer.length >= 100_000) {
      const elapsedMs = Date.now() - loopStartedAt
      console.log(buffer.length, lastProcessedBlock / MAX_BLOCK, `${formatElapsed(elapsedMs)} elapsed`)
      console.log('saving...')
      await insertBlockLogs(buffer)
      console.log('done')
      buffer.length = 0
    }
  }
  if (buffer.length > 0) {
    const elapsedMs = Date.now() - loopStartedAt
    console.log(buffer.length, lastProcessedBlock / MAX_BLOCK, `${formatElapsed(elapsedMs)} elapsed`)
    await insertBlockLogs(buffer)
  }
}

main()
