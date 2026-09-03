import type { Database, TokenDatabase } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { createPublicClient, erc20Abi, formatUnits, http } from 'viem'
import { normalizeTokenAddress } from './model'

export const SUPPLY_CHANGE_EVIDENCE_LIMIT = 25

export interface SupplyChangeEvidenceRequest {
  chain: string
  address: string
}

export interface SupplyChangeEvidence extends SupplyChangeEvidenceRequest {
  from: number
  to: number
  supplyStart: string
  supplyEnd: string
  supplyChange: string
  interopMinted: string
  interopBurned: string
  interopNet: string
  unexplainedChange: string
  bridgeShareOfSupplyChange?: number
  transferCount: number
}

type ReadTotalSupplyAt = (request: {
  chain: string
  address: `0x${string}`
  rpcUrl: string
  blockNumber: number
}) => Promise<bigint | undefined>

interface SupplyChangeEvidenceDependencies {
  now?: UnixTime
  readTotalSupplyAt?: ReadTotalSupplyAt
}

export async function getSupplyChangeEvidence(
  db: Database,
  tokenDb: TokenDatabase,
  requests: SupplyChangeEvidenceRequest[],
  dependencies: SupplyChangeEvidenceDependencies = {},
): Promise<SupplyChangeEvidence[]> {
  const uniqueRequests = Array.from(
    new Map(
      requests.slice(0, SUPPLY_CHANGE_EVIDENCE_LIMIT).map((request) => {
        const normalized = {
          chain: request.chain,
          address: normalizeTokenAddress(request.address),
        }
        return [requestKey(normalized), normalized]
      }),
    ).values(),
  )
  const evmRequests = uniqueRequests.filter(
    (
      request,
    ): request is SupplyChangeEvidenceRequest & { address: `0x${string}` } =>
      /^0x[0-9a-f]{40}$/i.test(request.address),
  )
  if (evmRequests.length === 0) return []

  const { from, to } = supplyChangeWindow(dependencies.now ?? UnixTime.now())
  const [tokens, chains, interopStats] = await Promise.all([
    tokenDb.deployedToken.getByChainAndAddress(evmRequests),
    tokenDb.chain.getAll(),
    db.interopTransfer.getSupplyChangeStatsByRange(evmRequests, from, to),
  ])
  const tokensByKey = new Map(
    tokens.map((token) => [requestKey(token.deployedToken), token]),
  )
  const rpcUrlsByChain = new Map(
    chains.flatMap((chain) => {
      const rpc = chain.apis?.find((api) => api.type === 'rpc')
      return rpc ? [[chain.name, rpc.url] as const] : []
    }),
  )
  const statsByKey = new Map(
    interopStats.map((stats) => [requestKey(stats), stats]),
  )
  const eligibleRequests = evmRequests.filter((request) => {
    const stats = statsByKey.get(requestKey(request))
    return (
      tokensByKey.has(requestKey(request)) &&
      rpcUrlsByChain.has(request.chain) &&
      stats !== undefined &&
      stats.transferCount > 0 &&
      stats.missingAmountCount === 0
    )
  })
  const eligibleChains = Array.from(
    new Set(eligibleRequests.map((request) => request.chain)),
  )
  const blockNumbers = new Map<
    string,
    { from: number | undefined; to: number | undefined }
  >()
  await Promise.all(
    eligibleChains.map(async (chain) => {
      const [fromBlock, toBlock] = await Promise.all([
        db.tvsBlockTimestamp.findBlockNumberByChainAndTimestamp(chain, from),
        db.tvsBlockTimestamp.findBlockNumberByChainAndTimestamp(chain, to),
      ])
      blockNumbers.set(chain, { from: fromBlock, to: toBlock })
    }),
  )

  const readTotalSupplyAt =
    dependencies.readTotalSupplyAt ?? readCachedTotalSupplyAt
  const evidence = await mapConcurrent(
    eligibleRequests,
    5,
    async (request): Promise<SupplyChangeEvidence | undefined> => {
      const token = tokensByKey.get(requestKey(request))
      const stats = statsByKey.get(requestKey(request))
      const rpcUrl = rpcUrlsByChain.get(request.chain)
      const blocks = blockNumbers.get(request.chain)
      if (!token || !stats || !rpcUrl || !blocks?.to) return undefined
      if (
        token.deployedToken.deploymentTimestamp <= from &&
        blocks.from === undefined
      ) {
        return undefined
      }

      const [supplyStart, supplyEnd] = await Promise.all([
        token.deployedToken.deploymentTimestamp > from
          ? Promise.resolve(0n)
          : readTotalSupplyAt({
              ...request,
              rpcUrl,
              blockNumber: blocks.from as number,
            }),
        readTotalSupplyAt({
          ...request,
          rpcUrl,
          blockNumber: blocks.to,
        }),
      ])
      if (supplyStart === undefined || supplyEnd === undefined) return undefined

      const interopMinted = BigInt(stats.mintedRaw)
      const interopBurned = BigInt(stats.burnedRaw)
      const interopNet = interopMinted - interopBurned
      const supplyChange = supplyEnd - supplyStart
      const unexplainedChange = supplyChange - interopNet

      return {
        ...request,
        from,
        to,
        supplyStart: formatUnits(supplyStart, token.deployedToken.decimals),
        supplyEnd: formatUnits(supplyEnd, token.deployedToken.decimals),
        supplyChange: formatUnits(supplyChange, token.deployedToken.decimals),
        interopMinted: formatUnits(interopMinted, token.deployedToken.decimals),
        interopBurned: formatUnits(interopBurned, token.deployedToken.decimals),
        interopNet: formatUnits(interopNet, token.deployedToken.decimals),
        unexplainedChange: formatUnits(
          unexplainedChange,
          token.deployedToken.decimals,
        ),
        bridgeShareOfSupplyChange: percentage(interopNet, supplyChange),
        transferCount: stats.transferCount,
      }
    },
  )

  return evidence.filter((item) => item !== undefined)
}

export function supplyChangeWindow(now: UnixTime): {
  from: UnixTime
  to: UnixTime
} {
  return {
    from: UnixTime(
      UnixTime.toStartOf(now - 7 * UnixTime.DAY, 'hour') + UnixTime.HOUR,
    ),
    to: UnixTime(UnixTime.toStartOf(now, 'hour') - UnixTime.HOUR),
  }
}

function percentage(numerator: bigint, denominator: bigint) {
  if (denominator === 0n) return undefined
  return Number((numerator * 10_000n) / denominator) / 100
}

interface CachedSupply {
  value: bigint | undefined
  expiresAt: number
}

const supplyCache = new Map<string, CachedSupply>()
const inFlightSupplies = new Map<string, Promise<bigint | undefined>>()

async function readCachedTotalSupplyAt(request: {
  chain: string
  address: `0x${string}`
  rpcUrl: string
  blockNumber: number
}): Promise<bigint | undefined> {
  const key = `${requestKey(request)}:${request.blockNumber}`
  const cached = supplyCache.get(key)
  if (cached && cached.expiresAt > Date.now()) return cached.value

  const inFlight = inFlightSupplies.get(key)
  if (inFlight) return await inFlight

  const promise = readTotalSupplyAt(request)
  inFlightSupplies.set(key, promise)

  try {
    const value = await promise
    supplyCache.set(key, {
      value,
      expiresAt: Date.now() + (value === undefined ? 30_000 : 10 * 60_000),
    })
    return value
  } finally {
    inFlightSupplies.delete(key)
  }
}

async function readTotalSupplyAt(request: {
  address: `0x${string}`
  rpcUrl: string
  blockNumber: number
}): Promise<bigint | undefined> {
  try {
    const client = createPublicClient({
      transport: http(request.rpcUrl, {
        retryCount: 0,
        timeout: 5_000,
      }),
    })
    return await client.readContract({
      address: request.address,
      abi: erc20Abi,
      functionName: 'totalSupply',
      blockNumber: BigInt(request.blockNumber),
    })
  } catch {
    return undefined
  }
}

async function mapConcurrent<T, R>(
  values: T[],
  concurrency: number,
  fn: (value: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(values.length)
  let next = 0

  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, async () => {
      while (next < values.length) {
        const index = next++
        results[index] = await fn(values[index])
      }
    }),
  )

  return results
}

function requestKey(request: SupplyChangeEvidenceRequest): string {
  return `${request.chain}:${normalizeTokenAddress(request.address)}`
}
