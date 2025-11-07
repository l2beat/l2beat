import type { TokenDatabase } from '@l2beat/database'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { Chain } from '../../chains/Chain'
import type { CoingeckoClient } from '../../chains/clients/coingecko/CoingeckoClient'
import { CoingeckoClient as CoingeckoClientImpl } from '../../chains/clients/coingecko/CoingeckoClient'
import { config } from '../../config'
import { db } from '../../database/db'
import { readOnlyProcedure, router } from '../trpc'

const coingeckoClient = new CoingeckoClientImpl({
  apiKey: config.coingeckoApiKey,
})

export interface DeployedTokensRouterDeps {
  db: TokenDatabase
  coingeckoClient: CoingeckoClient
  etherscanApiKey: string | undefined
}

export function createDeployedTokensRouter(deps: DeployedTokensRouterDeps) {
  const { db, coingeckoClient, etherscanApiKey } = deps

  async function getCoinByChainAndAddress(chain: string, address: string) {
    const data = await coingeckoClient.getCoinList({ includePlatform: true })
    const chains = await db.chain.getAll()
    const chainToAliases = new Map(
      chains.map((chain) => [
        chain.name,
        [chain.name, ...(chain.aliases ?? [])],
      ]),
    )

    const aliases = chainToAliases.get(chain)
    if (!aliases) return null

    const coin = data.find((coin) =>
      aliases.some(
        (alias) =>
          coin.platforms[alias]?.toLowerCase() === address.toLowerCase(),
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

  return router({
    findByChainAndAddress: readOnlyProcedure
      .input(v.object({ chain: v.string(), address: v.string() }))
      .query(async ({ input }) => {
        const result = await db.deployedToken.findByChainAndAddress({
          chain: input.chain,
          address: input.address,
        })
        return result ?? null
      }),

    checkIfExists: readOnlyProcedure
      .input(v.object({ chain: v.string(), address: v.string() }))
      .query(async ({ input }) => {
        const result = await db.deployedToken.findByChainAndAddress({
          chain: input.chain,
          address: input.address,
        })
        return result !== undefined
      }),

    getByChainAndAddress: readOnlyProcedure
      .input(v.array(v.object({ chain: v.string(), address: v.string() })))
      .query(async ({ input }) => db.deployedToken.getByChainAndAddress(input)),

    checks: readOnlyProcedure
      .input(v.object({ chain: v.string(), address: v.string() }))
      .query(async ({ input }) => {
        const result = await db.deployedToken.findByChainAndAddress({
          chain: input.chain,
          address: input.address,
        })
        if (result !== undefined) {
          return {
            error: {
              type: 'already-exists' as const,
              message:
                'Deployed token with given address and chain already exists',
            },
            data: undefined,
          }
        }
        if (!input.address.startsWith('0x')) {
          return {
            error: undefined,
            data: undefined,
          }
        }

        const chainRecord = await db.chain.findByName(input.chain)
        assert(chainRecord, 'Chain not found')

        const chain = new Chain(chainRecord, {
          etherscanApiKey,
        })

        let decimals: number | undefined
        if (chain.rpc) {
          try {
            decimals = await chain.rpc.getDecimals(input.address)
          } catch (error) {
            console.error(error)
            return {
              error: {
                type: 'not-found-on-chain' as const,
                message: 'Token not found on chain',
              },
              data: {
                symbol: undefined,
                otherChains: undefined,
                decimals: undefined,
                deploymentTimestamp: undefined,
                abstractTokenId: undefined,
              },
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
            error: {
              type: 'not-found-on-coingecko' as const,
              message: 'Coin not found on Coingecko',
            },
            data: {
              symbol: undefined,
              otherChains: undefined,
              decimals,
              deploymentTimestamp,
              abstractTokenId: undefined,
            },
          }
        }

        const abstractToken = coin.id
          ? await db.abstractToken.findByCoingeckoId(coin.id)
          : undefined

        return {
          error: undefined,
          data: {
            symbol: coin.symbol,
            decimals,
            deploymentTimestamp,
            abstractTokenId: abstractToken?.id,
            otherChains: coin.otherChains,
          },
        }
      }),
  })
}

export const deployedTokensRouter = createDeployedTokensRouter({
  db,
  coingeckoClient,
  etherscanApiKey: config.etherscanApiKey,
})
