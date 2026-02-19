import type { TokenDatabase } from '@l2beat/database'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { Chain } from '../../chains/Chain'
import type { CoingeckoClient } from '../../chains/clients/coingecko/CoingeckoClient'
import { readOnlyProcedure } from '../procedures'
import { router } from '../trpc'

export interface DeployedTokensRouterDeps {
  coingeckoClient: CoingeckoClient
  etherscanApiKey: string | undefined
}

export const deployedTokensRouter = (deps: DeployedTokensRouterDeps) => {
  const { coingeckoClient, etherscanApiKey } = deps

  async function getCoinByChainAndAddress(
    db: TokenDatabase,
    chain: string,
    address: string,
  ) {
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

    const aliasToChain = new Map([
      ...chains.map((chain) => [chain.name, chain.name] as const),
      ...chains.flatMap(
        (chain) =>
          chain.aliases?.map((alias) => [alias, chain.name] as const) ?? [],
      ),
    ])

    const deployedTokens = await db.deployedToken.getByChainsAndAddresses(
      Object.entries(coin.platforms)
        .map(([platform, address]) => {
          const platformChain = aliasToChain.get(platform)
          if (!platformChain || !address) return undefined
          return {
            chain: platformChain,
            address,
          }
        })
        .filter((x) => x !== undefined),
    )

    const suggestions = Object.entries(coin.platforms)
      .map(([platform, address]) => {
        const platformChain = aliasToChain.get(platform)
        if (!platformChain || !address || platformChain === chain)
          return undefined

        const record = deployedTokens.find(
          (x) =>
            x.chain === platformChain &&
            x.address.toLowerCase() === address.toLowerCase(),
        )

        if (record) {
          return undefined
        }

        return {
          chain: platformChain,
          address,
        }
      })
      .filter((x) => x !== undefined)

    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      suggestions,
    }
  }

  return router({
    findByChainAndAddress: readOnlyProcedure
      .input(v.object({ chain: v.string(), address: v.string() }))
      .query(async ({ ctx, input }) => {
        const result = await ctx.db.deployedToken.findByChainAndAddress({
          chain: input.chain,
          address: input.address,
        })
        return result ?? null
      }),

    checkIfExists: readOnlyProcedure
      .input(v.object({ chain: v.string(), address: v.string() }))
      .query(async ({ ctx, input }) => {
        const result = await ctx.db.deployedToken.findByChainAndAddress({
          chain: input.chain,
          address: input.address,
        })
        return result !== undefined
      }),

    getByChainAndAddress: readOnlyProcedure
      .input(v.array(v.object({ chain: v.string(), address: v.string() })))
      .query(async ({ ctx, input }) =>
        ctx.db.deployedToken.getByChainAndAddress(input),
      ),

    checks: readOnlyProcedure
      .input(v.object({ chain: v.string(), address: v.string() }))
      .query(async ({ ctx, input }) => {
        const result = await ctx.db.deployedToken.findByChainAndAddress({
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

        const chainRecord = await ctx.db.chain.findByName(input.chain)
        assert(chainRecord, 'Chain not found')

        const chain = new Chain(chainRecord, {
          etherscanApiKey,
        })

        let decimals: number | undefined
        let symbolFromChain: string | undefined
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

          try {
            symbolFromChain = await chain.rpc.getSymbol(input.address)
          } catch (error) {
            console.error(error)
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
            const txHash = contractCreation[0].txHash
            const txInfo = await chain.blockscout.getTransactionInfo(txHash)
            deploymentTimestamp = txInfo.timeStamp
          } catch (error) {
            console.error(error)
          }
        }

        const coin = await getCoinByChainAndAddress(
          ctx.db,
          input.chain,
          input.address,
        )
        if (coin === null) {
          return {
            error: {
              type: 'not-found-on-coingecko' as const,
              message: 'Coin not found on Coingecko',
            },
            data: {
              symbol: symbolFromChain,
              suggestions: undefined,
              decimals,
              deploymentTimestamp,
              abstractTokenId: undefined,
              coingeckoId: undefined,
            },
          }
        }

        const abstractToken = coin.id
          ? await ctx.db.abstractToken.findByCoingeckoId(coin.id)
          : undefined

        return {
          error: undefined,
          data: {
            symbol: symbolFromChain ?? coin.symbol,
            decimals,
            deploymentTimestamp,
            abstractTokenId: abstractToken?.id,
            suggestions: coin.suggestions,
            coingeckoId: coin.id,
          },
        }
      }),

    getSuggestionsByCoingeckoId: readOnlyProcedure
      .input(v.string())
      .query(async ({ input, ctx }) => {
        const coin = await coingeckoClient.getCoinDataById(input)

        if (!coin) {
          return []
        }
        const chains = await ctx.db.chain.getAll()

        const aliasToChain = new Map([
          ...chains.map((chain) => [chain.name, chain.name] as const),
          ...chains.flatMap(
            (chain) =>
              chain.aliases?.map((alias) => [alias, chain.name] as const) ?? [],
          ),
        ])

        const deployedTokens =
          await ctx.db.deployedToken.getByChainsAndAddresses(
            Object.entries(coin.platforms)
              .map(([platform, address]) => {
                const chain = aliasToChain.get(platform)
                if (!chain || !address) return undefined
                return {
                  chain,
                  address,
                }
              })
              .filter((x) => x !== undefined),
          )

        const suggestions = Object.entries(coin.platforms)
          .map(([platform, address]) => {
            const chain = aliasToChain.get(platform)

            if (!chain || !address) return undefined

            const record = deployedTokens.find(
              (x) =>
                x.chain === chain &&
                x.address.toLowerCase() === address.toLowerCase(),
            )

            if (record) {
              return undefined
            }

            return {
              chain: chain,
              address,
            }
          })
          .filter((x) => x !== undefined)

        return suggestions
      }),
  })
}
