import type {
  BlockRatio,
  CountedBlock,
  CountedOperation,
  CountedTransaction,
  SmartAccountUsage,
  Stats,
  UopsChainInfo,
} from '@l2beat/tools-api/types'

export type {
  BlockRatio,
  CountedBlock,
  CountedOperation,
  CountedTransaction,
  SmartAccountUsage,
  UopsChainInfo,
}

export type StatsBatch = Omit<Stats, 'dateStart' | 'dateEnd'> & {
  dateStart: string
  dateEnd: string
}

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://tools-api.l2beat.com'
    : 'http://localhost:3000'

export async function getChains(): Promise<UopsChainInfo[]> {
  const res = await fetch(`${baseUrl}/api/uops/chains`)
  if (!res.ok) {
    throw new Error('Could not load chains', { cause: { status: res.status } })
  }
  return (await res.json()) as UopsChainInfo[]
}

export async function getLatestBlockNumber(chainId: string): Promise<number> {
  return (await post('/api/uops/latest', { chainId })) as number
}

export async function getBlock(
  chainId: string,
  blockNumber: number,
): Promise<CountedBlock> {
  return (await post('/api/uops/block', {
    chainId,
    blockNumber,
  })) as CountedBlock
}

export async function getStats(
  chainId: string,
  count: number,
  lastFetched: number | undefined,
): Promise<StatsBatch> {
  return (await post('/api/uops/stats', {
    chainId,
    count,
    lastFetched,
  })) as StatsBatch
}

async function post(path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json: unknown = await res.json().catch(() => undefined)
  if (!res.ok) {
    throw new Error(readErrorMessage(json), { cause: { status: res.status } })
  }
  return json
}

function readErrorMessage(json: unknown): string {
  if (
    typeof json === 'object' &&
    json !== null &&
    'message' in json &&
    typeof json.message === 'string'
  ) {
    return json.message
  }
  return 'Request failed'
}
