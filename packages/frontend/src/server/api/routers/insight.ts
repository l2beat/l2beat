import {
  type Layer2,
  type Layer3,
  type StageConfig,
  layer2s,
  layer3s,
} from '@l2beat/config'
import {
  type NetworkRecord,
  type TokenBridgeRecord,
  type TokenMetaRecord,
  type TokenRecord,
} from '@l2beat/database'
import { type InsightBalanceRecord } from '@l2beat/database/dist/insight/balance/entity'
import { notUndefined } from '@l2beat/shared-pure'
import { TRPCError } from '@trpc/server'
import { getAddress } from 'viem'
import { z } from 'zod'
import { getRequiredTokenMeta } from '~/app/insight/_utils/get-required-token-meta'
import { db } from '~/server/database'
import { refreshBalancesOfAddress } from '~/server/features/insight/refresh-balances-of-address'
import { refreshTokensOfAddress } from '~/server/features/insight/refresh-tokens-of-address'
import { procedure, router } from '../trpc'

const projectsByChainId = [...layer2s, ...layer3s].reduce<
  Record<number, Layer2 | Layer3>
>((acc, p) => {
  if (p.chainConfig?.chainId) {
    acc[p.chainConfig.chainId] = p
  }
  return acc
}, {})

export const insightRouter = router({
  refreshTokens: procedure
    .input(
      z.object({
        address: z
          .string()
          .regex(/^0x[a-fA-F0-9]{40}$/)
          .transform((arg) => getAddress(arg)),
      }),
    )
    .mutation(async ({ input }) => {
      return await refreshTokensOfAddress(input.address)
    }),

  refreshBalances: procedure
    .input(
      z.object({
        address: z
          .string()
          .regex(/^0x[a-fA-F0-9]{40}$/)
          .transform((arg) => getAddress(arg)),
      }),
    )
    .mutation(async ({ input }) => {
      return await refreshBalancesOfAddress(input.address)
    }),

  report: procedure
    .input(
      z.object({
        address: z
          .string()
          .regex(/^0x[a-fA-F0-9]{40}$/)
          .transform((arg) => getAddress(arg)),
      }),
    )
    .query(async ({ input }) => {
      await db.insightUser.upsert({
        address: input.address,
      })
      const user = await db.insightUser.findUserByAddress(input.address)
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }
      const [networks, externalBridges, bridges, balances] = await Promise.all([
        db.network.getAll(),
        db.externalBridge.getAll(),
        db.tokenBridge.getAll(),
        db.insightBalance.getAllForUser(user.id),
      ])

      const balancesMap = groupByTokenId(balances)
      const { tokenMap, relations } = await getTokenAndRelationsMap(balancesMap)

      const tokenMeta = await db.tokenMeta.getByTokenIdsAndSource(
        Object.keys(tokenMap),
        'Aggregate',
      )
      const tokenMetaMap = groupByTokenId(tokenMeta)
      const chainMap = getChainMap(networks)
      const tokens = await getTokens(tokenMap, tokenMetaMap, balancesMap)

      return {
        usdValue: tokens.reduce((acc, t) => acc + t.usdValue, 0),
        tokensRefreshedAt: user.tokensRefreshedAt,
        balancesRefreshedAt: user.balancesRefreshedAt,
        chains: chainMap,
        bridges,
        externalBridges,
        relations,
        tokens,
      }
    }),
})

async function getTokenAndRelationsMap(
  balancesMap: Record<string, InsightBalanceRecord>,
) {
  const userTokenIds = Object.keys(balancesMap)

  const tokenMap: Record<string, TokenRecord> = {}
  const relations: Record<string, TokenBridgeRecord> = {}

  let tokensToCheck: string[] = userTokenIds

  while (tokensToCheck.length > 0) {
    const newTokens = await db.token.getByIds(tokensToCheck)
    for (const token of newTokens) {
      tokenMap[token.id] = token
    }
    const newRelations = await db.tokenBridge.getByTargetTokenIds(tokensToCheck)
    tokensToCheck = []
    for (const relation of newRelations) {
      if (relations[relation.id]) continue
      relations[relation.id] = relation
      if (!tokenMap[relation.sourceTokenId]) {
        tokensToCheck.push(relation.sourceTokenId)
      }
    }
  }

  return { tokenMap, relations }
}

function groupByTokenId<T extends { tokenId: string }>(
  arr: T[],
): Record<string, T> {
  return arr.reduce<Record<string, T>>((acc, e) => {
    acc[e.tokenId] = e
    return acc
  }, {})
}

function getChainMap(networks: NetworkRecord[]) {
  return networks.reduce<
    Record<
      string,
      {
        id: string
        name: string
        logoUrl: string | undefined
        risks: {
          text: string
          isCritical?: boolean
        }[]
        stage?: StageConfig['stage']
      }
    >
  >((acc, { id, name, chainId, logoUrl }) => {
    const chain = chainId && projectsByChainId[chainId]

    if (chain) {
      acc[id] = {
        id,
        name: chain.display.name,
        logoUrl: logoUrl ?? `/icons/${chain.display.slug}.png`,
        stage: 'stage' in chain ? chain.stage?.stage : undefined,
        risks: (chain?.technology
          ? [
              chain.technology.stateCorrectness,
              chain.technology.newCryptography,
              chain.technology.dataAvailability,
              chain.technology.operator,
              chain.technology.forceTransactions,
              ...(chain.technology.exitMechanisms ?? []),
              chain.technology.massExit,
              ...(chain.technology.otherConsiderations ?? []),
            ].flatMap((choice) => choice?.risks ?? [])
          : []
        ).map((r) => ({
          text: `${r.category} ${r.text}`,
          isCritical: r.isCritical,
        })),
      }
    } else {
      acc[id] = {
        id,
        name,
        logoUrl: logoUrl ?? undefined,
        risks: [],
      }
    }
    return acc
  }, {})
}

async function getTokens(
  tokenMap: Record<string, TokenRecord>,
  tokenMetaMap: Record<string, TokenMetaRecord>,
  balancesMap: Record<string, InsightBalanceRecord>,
) {
  const coingeckoMeta = await db.tokenMeta.getByTokenIdsAndSource(
    Object.values(tokenMap).map((t) => t.id),
    'CoinGecko',
  )

  const coingeckoIds = coingeckoMeta
    .map((m) => m.externalId ?? undefined)
    .filter(notUndefined)

  const prices = await db.currentPrice.getByCoingeckoIds(coingeckoIds)
  return Object.values(tokenMap)
    .map((token) => {
      const meta = getRequiredTokenMeta(tokenMetaMap[token.id])
      if (!meta) {
        return undefined
      }
      const coingeckoId = coingeckoMeta.find(
        (m) => m.tokenId === token.id,
      )?.externalId
      const price = prices.find((p) => p.coingeckoId === coingeckoId)
      const balance = Number(balancesMap[token.id]?.balance ?? '0')
      const amount = balance / 10 ** meta.decimals
      return {
        token,
        meta,
        usdValue: amount * (price?.priceUsd ?? 0),
        amount,
      }
    })
    .filter(notUndefined)
}
