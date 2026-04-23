import type { Database, InteropMissingTokenInfo } from '@l2beat/database'
import type { TokenDbClient } from '@l2beat/token-backend'
import { DeployedTokenId } from '../../financials/DeployedTokenId'
import { toDeployedId } from '../../financials/InteropFinancialsLoop'

export type MissingTokenDbStatus =
  | 'missing'
  | 'incomplete'
  | 'ready'
  | 'unsupported'

export interface MissingTokenRecord extends InteropMissingTokenInfo {
  tokenDbStatus: MissingTokenDbStatus
}

export interface MissingTokenSelection {
  chain: string
  tokenAddress: string
}

interface MissingTokensDeps {
  chains: readonly { id: string; type: 'evm' }[]
  tokenDbClient: TokenDbClient
}

export function getMissingTokenKey(token: MissingTokenSelection) {
  return `${token.chain}:${token.tokenAddress}`
}

export function dedupeMissingTokens<T extends MissingTokenSelection>(
  tokens: T[],
): T[] {
  return Array.from(
    new Map(tokens.map((token) => [getMissingTokenKey(token), token])).values(),
  )
}

export async function getMissingTokens(
  db: Database,
  deps: MissingTokensDeps,
): Promise<MissingTokenRecord[]> {
  const rows = await db.interopTransfer.getMissingTokensInfo()
  return mapMissingTokensWithStatus(rows, deps)
}

export async function mapMissingTokensWithStatus<
  T extends MissingTokenSelection,
>(
  tokens: T[],
  deps: MissingTokensDeps,
): Promise<(T & { tokenDbStatus: MissingTokenDbStatus })[]> {
  const statuses = await getMissingTokenStatuses(tokens, deps)

  return tokens.map((token) => ({
    ...token,
    tokenDbStatus: statuses.get(getMissingTokenKey(token)) ?? 'unsupported',
  }))
}

export async function getMissingTokenStatuses(
  tokens: MissingTokenSelection[],
  deps: MissingTokensDeps,
): Promise<Map<string, MissingTokenDbStatus>> {
  const statuses = new Map<string, MissingTokenDbStatus>()
  const deployedTokenIdsByKey = new Map<string, DeployedTokenId>()

  for (const token of tokens) {
    const key = getMissingTokenKey(token)

    if (statuses.has(key) || deployedTokenIdsByKey.has(key)) {
      continue
    }

    const deployedTokenId = toDeployedId(
      deps.chains,
      token.chain,
      token.tokenAddress,
    )

    if (!deployedTokenId) {
      statuses.set(key, 'unsupported')
      continue
    }

    deployedTokenIdsByKey.set(key, deployedTokenId)
  }

  if (deployedTokenIdsByKey.size === 0) {
    return statuses
  }

  const tokenInfos =
    await deps.tokenDbClient.deployedTokens.getByChainAndAddress.query(
      Array.from(new Set(deployedTokenIdsByKey.values())).map(
        (deployedTokenId) => ({
          chain: DeployedTokenId.chain(deployedTokenId),
          address: DeployedTokenId.address(deployedTokenId),
        }),
      ),
    )

  const tokenInfoById = new Map(
    tokenInfos.map((tokenInfo) => [
      DeployedTokenId.from(
        tokenInfo.deployedToken.chain,
        tokenInfo.deployedToken.address,
      ),
      tokenInfo,
    ]),
  )

  for (const [key, deployedTokenId] of deployedTokenIdsByKey) {
    const tokenInfo = tokenInfoById.get(deployedTokenId)

    if (!tokenInfo) {
      statuses.set(key, 'missing')
      continue
    }

    if (!tokenInfo.abstractToken || !tokenInfo.abstractToken.coingeckoId) {
      statuses.set(key, 'incomplete')
      continue
    }

    statuses.set(key, 'ready')
  }

  return statuses
}
