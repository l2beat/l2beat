import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { CoingeckoClient } from '../../clients/coingecko/CoingeckoClient'
import { RpcClient } from '../../clients/rpc/RpcClient'
import { config } from '../../config'
import { db } from '../../database/db'
import { protectedProcedure, router } from '../trpc'

const coingeckoClient = new CoingeckoClient({
  apiKey: config.coingeckoApiKey,
})

export const deployedTokensRouter = router({
  getByChainAndAddress: protectedProcedure
    .input(v.object({ chain: v.string(), address: v.string() }))
    .query(async ({ input }) => {
      const result = await db.deployedToken.findByChainAndAddress({
        chain: input.chain,
        address: input.address,
      })
      return result ?? null
    }),

  checkIfExists: protectedProcedure
    .input(v.object({ chain: v.string(), address: v.string() }))
    .query(async ({ input }) => {
      const result = await db.deployedToken.findByChainAndAddress({
        chain: input.chain,
        address: input.address,
      })
      return result !== undefined
    }),

  checks: protectedProcedure
    .input(v.object({ chain: v.string(), address: v.string() }))
    .query(async ({ input }) => {
      const result = await db.deployedToken.findByChainAndAddress({
        chain: input.chain,
        address: input.address,
      })
      if (result !== undefined) {
        return {
          type: 'already-exists' as const,
        }
      }
      const chain = await db.chain.findByName(input.chain)
      assert(chain, 'Chain not found')

      const rpcApi = chain.apis?.find((api) => api.type === 'rpc')
      let decimals: number | undefined
      if (rpcApi) {
        const rpcClient = new RpcClient(rpcApi, chain.name)

        try {
          decimals = await rpcClient.getDecimals(input.address)
        } catch {
          return {
            type: 'not-found-on-rpc' as const,
          }
        }
      }

      const coin = await getCoinByChainAndAddress(input.chain, input.address)
      if (coin === null) {
        return {
          type: 'not-found-on-coingecko' as const,
          data: {
            decimals,
          },
        }
      }

      const abstractToken = coin.id
        ? await db.abstractToken.findByCoingeckoId(coin.id)
        : undefined

      return {
        type: 'success' as const,
        data: {
          ...coin,
          decimals,
          deploymentTimestamp: 1714732800,
          abstractToken,
        },
      }
    }),
})

async function getCoinByChainAndAddress(chain: string, address: string) {
  const data = await coingeckoClient.getCoinList({ includePlatform: true })
  const chains = await db.chain.getAll()
  const chainToAliases = new Map(
    chains.map((chain) => [chain.name, [chain.name, ...(chain.aliases ?? [])]]),
  )

  const aliases = chainToAliases.get(chain)
  if (!aliases) return null

  const coin = data.find((coin) =>
    aliases.some(
      (alias) => coin.platforms[alias]?.toLowerCase() === address.toLowerCase(),
    ),
  )
  if (!coin) return null

  const aliasToChain = new Map(
    chains.flatMap(
      (chain) => chain.aliases?.map((alias) => [alias, chain.name]) ?? [],
    ),
  )

  const otherChains = (
    await Promise.all(
      Object.entries(coin.platforms).map(async ([platform, address]) => {
        const platformChain = aliasToChain.get(platform)
        if (!platformChain || !address || platformChain === chain)
          return undefined

        const record = await db.deployedToken.findByChainAndAddress({
          chain: platformChain,
          address,
        })

        return {
          chain: platformChain,
          address,
          exists: !!record,
        }
      }),
    )
  ).filter((x) => x !== undefined)

  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    otherChains,
  }
}
