import { assert, type UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { Chain } from '../../chains/Chain'
import { CoingeckoClient } from '../../chains/clients/coingecko/CoingeckoClient'
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
      const chainRecord = await db.chain.findByName(input.chain)
      assert(chainRecord, 'Chain not found')

      const chain = new Chain(chainRecord, {
        etherscanApiKey: config.etherscanApiKey,
      })

      let decimals: number | undefined
      if (chain.rpc) {
        try {
          decimals = await chain.rpc.getDecimals(input.address)
        } catch (error) {
          console.error(error)
          return {
            type: 'not-found-on-rpc' as const,
          }
        }
      }

      let deploymentTimestamp: UnixTime | undefined
      if (chain.etherscan) {
        try {
          const contractCreation = await chain.etherscan.getContractCreation(
            input.address,
          )
          deploymentTimestamp = contractCreation[0].timestamp
        } catch (error) {
          console.error(error)
        }
      }

      if (deploymentTimestamp === undefined && chain.blockscout) {
        try {
          const contractCreation = await chain.blockscout.getContractCreation(
            input.address,
          )
          deploymentTimestamp = contractCreation[0].timestamp
        } catch (error) {
          console.error(error)
        }
      }

      const coin = await getCoinByChainAndAddress(input.chain, input.address)
      if (coin === null) {
        return {
          type: 'not-found-on-coingecko' as const,
          data: {
            decimals,
            deploymentTimestamp,
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
          deploymentTimestamp,
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
