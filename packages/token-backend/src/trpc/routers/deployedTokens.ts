import type { TokenDatabase } from '@l2beat/database'
import type { ChainRecord } from '@l2beat/database/dist/repositories/ChainRepository'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import fuzzysort from 'fuzzysort'
import { Chain } from '../../chains/Chain'
import type { CoingeckoClient } from '../../chains/clients/coingecko/CoingeckoClient'
import type { AbstractTokenRecord } from '../../schemas/AbstractToken'
import { readOnlyProcedure } from '../procedures'
import { router } from '../trpc'

export interface DeployedTokensRouterDeps {
  coingeckoClient: CoingeckoClient
  etherscanApiKey: string | undefined
  createChain?: (chainRecord: ChainRecord) => Chain
}

export const deployedTokensRouter = (deps: DeployedTokensRouterDeps) => {
  const {
    coingeckoClient,
    etherscanApiKey,
    createChain = (chainRecord) =>
      new Chain(chainRecord, {
        etherscanApiKey,
      }),
  } = deps

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

        const chain = createChain(chainRecord)

        let decimals: number | undefined
        let symbol: string | undefined
        let symbolSource: 'rpc' | undefined
        if (chain.rpc) {
          try {
            const [rpcDecimals, rpcSymbol] = await Promise.all([
              chain.rpc.getDecimals(input.address),
              chain.rpc.getSymbol(input.address),
            ])
            decimals = rpcDecimals
            symbol = rpcSymbol
            symbolSource = 'rpc'
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
          let abstractTokenSuggestions: AbstractTokenSuggestion[] | undefined
          if (symbol) {
            const allAbstractTokens = await ctx.db.abstractToken.getAll()
            abstractTokenSuggestions = findSimilarAbstractTokens(
              symbol,
              allAbstractTokens,
              5,
            )
          }

          return {
            error: {
              type: 'not-found-on-coingecko' as const,
              message: 'Coin not found on Coingecko',
            },
            data: {
              symbol,
              symbolSource,
              suggestions: undefined,
              decimals,
              deploymentTimestamp,
              abstractTokenId: undefined,
              coingeckoId: undefined,
              abstractTokenSuggestions,
            },
          }
        }

        const abstractToken = coin.id
          ? await ctx.db.abstractToken.findByCoingeckoId(coin.id)
          : undefined

        return {
          error: undefined,
          data: {
            symbol: symbol ?? coin.symbol,
            symbolSource: symbolSource ?? 'coingecko',
            decimals,
            deploymentTimestamp,
            abstractTokenId: abstractToken?.id,
            suggestions: coin.suggestions,
            coingeckoId: coin.id,
            abstractTokenSuggestions: undefined,
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

type AbstractTokenSuggestion = Pick<
  AbstractTokenRecord,
  'id' | 'symbol' | 'issuer'
>

function findSimilarAbstractTokens(
  deployedSymbol: string,
  abstractTokens: AbstractTokenRecord[],
  limit: number,
): AbstractTokenSuggestion[] {
  // Forward: deployed symbol as query against abstract token symbols
  // Handles exact matches and when deployed symbol is shorter
  const forward = fuzzysort.go(deployedSymbol, abstractTokens, {
    key: (e) => e.symbol,
    limit,
  })

  // Reverse: each abstract symbol as query against deployed symbol
  // Handles cases like USDC.e -> USDC where deployed symbol has a suffix
  // or WETH -> ETH where deployed symbol has a prefix
  const reverse = abstractTokens
    .map((t) => {
      const result = fuzzysort.single(t.symbol, deployedSymbol)
      if (result === null) return undefined
      return {
        token: t,
        result,
      }
    })
    .filter((x) => x !== undefined)
    .sort((a, b) => b.result.score - a.result.score)
    .slice(0, limit)

  // Merge and deduplicate, preferring higher scores
  const seen = new Map<
    string,
    { token: (typeof abstractTokens)[number]; score: number }
  >()
  for (const r of forward) {
    seen.set(r.obj.id, { token: r.obj, score: r.score })
  }
  for (const r of reverse) {
    const existing = seen.get(r.token.id)
    if (!existing || r.result.score > existing.score) {
      seen.set(r.token.id, { token: r.token, score: r.result.score })
    }
  }

  return [...seen.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => ({
      id: r.token.id,
      symbol: r.token.symbol,
      issuer: r.token.issuer,
    }))
}
