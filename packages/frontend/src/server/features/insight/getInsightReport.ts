import type { DeployedTokenRecord, TokenRelationRoute } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import {
  getChainDisplayInfo,
  toInteropProjectIconListItems,
} from '../layer2s/interop/token/getInteropTokenRelationsGraph'
import { createInteropProjectResolver } from '../layer2s/interop/utils/createInteropProjectResolver'
import { getRelationsGraphProjects } from '../layer2s/interop/utils/getRelationsGraphProjects'
import {
  describeBacking,
  groupRoutesByDeployment,
  toDeploymentKey,
} from './describeBacking'
import {
  EthereumHolderRpc,
  HolderIndexNotReadyError,
  NATIVE_TOKEN,
} from './EthereumHolderRpc'
import { getMockInsightReport } from './getMockInsightReport'
import {
  createDatabaseDataSource,
  type InsightDataSource,
  type KnownToken,
} from './InsightDataSource'
import type {
  InsightHolding,
  InsightReport,
  InsightReportResult,
} from './InsightReport'
import type { HolderInput } from './parseHolderInput'
import { resolveEnsName } from './resolveEnsName'

export const INSIGHT_CHAIN = 'ethereum'

export type HolderRpc = Pick<
  EthereumHolderRpc,
  'getHeldTokens' | 'getBlockNumber' | 'getBalances'
>

export type BackingDescriber = (
  token: DeployedTokenRecord,
  routes: TokenRelationRoute[],
) => InsightHolding['backing']

interface HeldToken extends KnownToken {
  balance: bigint
}

export async function getInsightReport(
  input: HolderInput,
): Promise<InsightReportResult> {
  if (env.MOCK) {
    if (input.kind === 'address') {
      return { status: 'ok', report: getMockInsightReport(input.address) }
    }
    const report = getMockInsightReport(`0x${'0'.repeat(40)}`)
    return { status: 'ok', report: { ...report, ensName: input.name } }
  }
  const rpcUrl = env.INSIGHT_ETHEREUM_RPC_URL
  if (!rpcUrl) return { status: 'notConfigured' }

  let holder = input.kind === 'address' ? input.address : undefined
  let ensName: string | null = null
  if (input.kind === 'name') {
    const resolution = await resolveEnsName(rpcUrl, input.name)
    if (resolution.status !== 'resolved') return { status: resolution.status }
    holder = resolution.address
    ensName = resolution.name
  }
  assert(holder !== undefined, 'Every input kind yields a holder')

  try {
    const report = await buildReport(
      {
        rpc: new EthereumHolderRpc(rpcUrl),
        data: createDatabaseDataSource(),
        describe: await createBackingDescriber(),
      },
      holder,
      UnixTime.now(),
    )
    return { status: 'ok', report: { ...report, ensName } }
  } catch (error) {
    if (error instanceof HolderIndexNotReadyError) {
      return { status: 'indexNotReady' }
    }
    throw error
  }
}

export async function buildReport(
  deps: { rpc: HolderRpc; data: InsightDataSource; describe: BackingDescriber },
  holder: string,
  now: UnixTime,
): Promise<Omit<InsightReport, 'ensName'>> {
  assert(/^0x[0-9a-f]{40}$/.test(holder), 'Holder must be parsed')
  const { rpc, data, describe } = deps

  const [candidates, blockNumber, deployedTokens] = await Promise.all([
    rpc.getHeldTokens(holder),
    rpc.getBlockNumber(),
    data.getDeployedTokens(INSIGHT_CHAIN),
  ])
  const { known, untrackedTokenCount } = selectKnownTokens(
    deployedTokens,
    candidates,
  )

  // Prices and routes depend only on the known tokens, so they load while
  // the balances are read rather than after. They are sent first because
  // `getBalances` encodes its calls before its first await.
  const priceTimestamp = UnixTime.toStartOf(now, 'hour')
  const [prices, routes, balances] = await Promise.all([
    data.getPrices(getPricedCoingeckoIds(known), priceTimestamp),
    data.getRoutesForTokens(known.map((token) => token.deployedToken)),
    rpc.getBalances(
      holder,
      known.map((token) => token.deployedToken.address),
      blockNumber,
    ),
  ])
  const { held, emptyTrackedTokenCount, unreadableTokenCount } =
    partitionByBalance(known, balances)

  const routesByDeployment = groupRoutesByDeployment(routes)
  const holdings = held
    .map((token) => {
      const { chain, address } = token.deployedToken
      const ownRoutes =
        routesByDeployment.get(toDeploymentKey(chain, address)) ?? []
      return toHolding(token, prices, describe(token.deployedToken, ownRoutes))
    })
    .sort(compareHoldings)

  return {
    holder,
    blockNumber,
    priceTimestamp,
    holdings,
    totalValueUsd: holdings.reduce((sum, h) => sum + (h.valueUsd ?? 0), 0),
    untrackedTokenCount,
    emptyTrackedTokenCount,
    unreadableTokenCount,
  }
}

/**
 * ETH and the candidates token-db knows. ETH has no Transfer event, so the
 * index never lists it. Ignored tokens are spam to token-db, so they count
 * as untracked.
 */
function selectKnownTokens(
  deployedTokens: ReadonlyMap<string, KnownToken>,
  candidates: string[],
) {
  const uniqueCandidates = new Set(candidates)
  assert(!uniqueCandidates.has(NATIVE_TOKEN), 'The index lists contracts')
  const known: KnownToken[] = []
  let knownCandidateCount = 0
  for (const address of [NATIVE_TOKEN, ...uniqueCandidates]) {
    const token = deployedTokens.get(address)
    if (!token || token.deployedToken.ignored) continue
    known.push(token)
    if (address !== NATIVE_TOKEN) knownCandidateCount++
  }
  return {
    known,
    untrackedTokenCount: uniqueCandidates.size - knownCandidateCount,
  }
}

function partitionByBalance(
  known: KnownToken[],
  balances: (bigint | undefined)[],
) {
  assert(known.length === balances.length, 'One balance per token')
  const held: HeldToken[] = []
  let emptyTrackedTokenCount = 0
  let unreadableTokenCount = 0
  for (const [i, token] of known.entries()) {
    const balance = balances[i]
    if (balance === undefined) unreadableTokenCount++
    else if (balance === 0n) emptyTrackedTokenCount++
    else held.push({ ...token, balance })
  }
  return { held, emptyTrackedTokenCount, unreadableTokenCount }
}

/** A price token-db flags unreliable would mislead, so it is not asked for. */
function getPricedCoingeckoIds(tokens: KnownToken[]): string[] {
  const ids = new Set<string>()
  for (const { abstractToken } of tokens) {
    if (!abstractToken?.coingeckoId) continue
    if (abstractToken.isPriceUnreliable) continue
    ids.add(abstractToken.coingeckoId)
  }
  return [...ids]
}

async function createBackingDescriber(): Promise<BackingDescriber> {
  const { projectsWithChains, interopProjects } =
    await getRelationsGraphProjects()
  const resolveProjects = createInteropProjectResolver(interopProjects)

  return (token, routes) =>
    describeBacking(
      { chain: token.chain, address: token.address },
      routes,
      (observation) =>
        toInteropProjectIconListItems(
          resolveProjects({
            ...observation,
            srcAbstractTokenId: token.abstractTokenId ?? undefined,
            dstAbstractTokenId: token.abstractTokenId ?? undefined,
          }),
        ),
      (chainId) => {
        const chain = getChainDisplayInfo(chainId, projectsWithChains)
        return {
          id: chainId,
          name: chain?.name ?? chainId,
          iconUrl: chain?.iconUrl,
        }
      },
    )
}

function toHolding(
  token: HeldToken,
  prices: Map<string, number>,
  backing: InsightHolding['backing'],
): InsightHolding {
  const { deployedToken, abstractToken, balance } = token
  const amount = Number(balance) / 10 ** deployedToken.decimals
  const priceUsd =
    abstractToken?.coingeckoId && !abstractToken.isPriceUnreliable
      ? prices.get(abstractToken.coingeckoId)
      : undefined
  return {
    address: deployedToken.address,
    // The deployment's own symbol: WETH, not the ETH it is an instance of.
    symbol: deployedToken.symbol,
    iconUrl: abstractToken?.iconUrl ?? null,
    issuer: abstractToken?.issuer ?? null,
    category: abstractToken?.category ?? null,
    reviewed: abstractToken?.reviewed ?? false,
    abstractTokenId: abstractToken?.id ?? null,
    balance: balance.toString(),
    decimals: deployedToken.decimals,
    valueUsd: priceUsd === undefined ? null : amount * priceUsd,
    backing,
  }
}

function compareHoldings(a: InsightHolding, b: InsightHolding): number {
  if (a.valueUsd !== null && b.valueUsd !== null) return b.valueUsd - a.valueUsd
  if (a.valueUsd !== null) return -1
  if (b.valueUsd !== null) return 1
  return a.symbol.localeCompare(b.symbol)
}
