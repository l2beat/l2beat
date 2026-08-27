import type { TokenRelationRoute } from '@l2beat/database'
import { v } from '@l2beat/validate'
import { TokenRelationPrimaryKey } from '../../../schemas/TokenRelation'
import { readOnlyProcedure } from '../../procedures'
import { router } from '../../trpc'
import { checkDeployedToken } from './checkDeployedToken'
import { getCoingeckoSuggestions } from './getCoingeckoSuggestions'
import { getSuggestionsByCoingeckoId } from './getSuggestionsByCoingeckoId'
import { getSuggestionsByPartialTransfers } from './getSuggestionsByPartialTransfers'
import type { DeployedTokensRouterDeps } from './types'

export type { DeployedTokensRouterDeps } from './types'

export const deployedTokensRouter = (deps: DeployedTokensRouterDeps) =>
  router({
    findByChainAndAddress: readOnlyProcedure
      .input(v.object({ chain: v.string(), address: v.string() }))
      .query(async ({ ctx, input }) => {
        const r = await ctx.tokenDb.deployedToken.findByChainAndAddress(input)
        return r ?? null
      }),

    checkIfExists: readOnlyProcedure
      .input(v.object({ chain: v.string(), address: v.string() }))
      .query(async ({ ctx, input }) => {
        const r = await ctx.tokenDb.deployedToken.findByChainAndAddress(input)
        return r !== undefined
      }),

    getByChainAndAddress: readOnlyProcedure
      .input(v.array(v.object({ chain: v.string(), address: v.string() })))
      .query(({ ctx, input }) =>
        ctx.tokenDb.deployedToken.getByChainAndAddress(input),
      ),

    getRelations: readOnlyProcedure
      .input(v.object({ chain: v.string(), address: v.string() }))
      .query(async ({ ctx, input }) => {
        // One list, not an inbound/outbound split: endpoint order is not a
        // direction. What differs between relations is this token's role, which
        // `lockedToken` answers.
        const relations = sortRelations(
          await ctx.tokenDb.tokenRelation.getRelationsFor(input),
        )
        const otherTokenKeys = uniqueTokenKeys(
          relations.map((relation) => otherEndpoint(relation, input)),
        )
        const otherTokens =
          await ctx.tokenDb.deployedToken.getByPrimaryKeys(otherTokenKeys)
        const otherTokenMap = new Map(
          otherTokens.map((token) => [tokenKey(token), token]),
        )

        return relations.map((relation) => {
          const other = otherEndpoint(relation, input)
          return {
            relation,
            role: tokenRelationRole(relation, input),
            otherEndpoint: other,
            otherToken: otherTokenMap.get(tokenKey(other)) ?? null,
          }
        })
      }),

    // The same answer the Relations tab's role column gives, summarized: the
    // distinct plugins of the relations whose role for this token is `minted`.
    getMintingPlugins: readOnlyProcedure
      .input(v.object({ chain: v.string(), address: v.string() }))
      .query(({ ctx, input }) =>
        ctx.tokenDb.tokenRelation.getMintingPluginsFor(input),
      ),

    getRelationsGraphNodeDetails: readOnlyProcedure
      .input(v.object({ chain: v.string(), address: v.string() }))
      .query(async ({ ctx, input }) => {
        const deployedToken =
          await ctx.tokenDb.deployedToken.findByChainAndAddress(input)
        if (deployedToken === undefined) {
          return { deployedToken: null, abstractToken: null }
        }
        if (deployedToken.abstractTokenId === null) {
          return { deployedToken, abstractToken: null }
        }

        const abstractToken = await ctx.tokenDb.abstractToken.findById(
          deployedToken.abstractTokenId,
        )
        if (abstractToken === undefined) {
          throw new Error(
            `Missing abstract token ${deployedToken.abstractTokenId} assigned to ${deployedToken.chain}:${deployedToken.address}`,
          )
        }
        return { deployedToken, abstractToken }
      }),

    getRelationsGraphRelationDetails: readOnlyProcedure
      .input(TokenRelationPrimaryKey)
      .query(async ({ ctx, input }) => {
        const relation = await ctx.tokenDb.tokenRelation.findByPrimaryKey(input)
        if (relation === undefined) {
          throw new Error(
            `Token relation ${formatTokenRelationPrimaryKey(input)} no longer exists`,
          )
        }
        return relation
      }),

    getRelationsGraph: readOnlyProcedure.query(async ({ ctx }) => {
      const relations = sortRelations(
        (await ctx.tokenDb.tokenRelation.getAllRoutes()).filter(
          isGraphRelation,
        ),
      )
      const allTokenKeys = uniqueTokenKeys(
        relations.flatMap((relation) => [
          {
            chain: relation.tokenAChain,
            address: relation.tokenAAddress,
          },
          {
            chain: relation.tokenBChain,
            address: relation.tokenBAddress,
          },
        ]),
      )
      const tokens =
        await ctx.tokenDb.deployedToken.getByPrimaryKeys(allTokenKeys)
      const ignoredTokenKeys = new Set(
        tokens.filter((token) => token.ignored).map(tokenKey),
      )
      const visibleRelations = relations.filter(
        (relation) =>
          !ignoredTokenKeys.has(
            tokenKey({
              chain: relation.tokenAChain,
              address: relation.tokenAAddress,
            }),
          ) &&
          !ignoredTokenKeys.has(
            tokenKey({
              chain: relation.tokenBChain,
              address: relation.tokenBAddress,
            }),
          ),
      )
      const tokenKeys = uniqueTokenKeys(
        visibleRelations.flatMap((relation) => [
          { chain: relation.tokenAChain, address: relation.tokenAAddress },
          { chain: relation.tokenBChain, address: relation.tokenBAddress },
        ]),
      )
      const tokenMap = new Map(tokens.map((token) => [tokenKey(token), token]))
      const graphRelations = visibleRelations.map((relation) => {
        const tokenA = tokenMap.get(
          tokenKey({
            chain: relation.tokenAChain,
            address: relation.tokenAAddress,
          }),
        )
        const tokenB = tokenMap.get(
          tokenKey({
            chain: relation.tokenBChain,
            address: relation.tokenBAddress,
          }),
        )

        return {
          ...relation,
          isConflict:
            tokenA?.abstractTokenId != null &&
            tokenB?.abstractTokenId != null &&
            tokenA.abstractTokenId !== tokenB.abstractTokenId,
        }
      })

      return {
        nodes: tokenKeys.map((key) => {
          const token = tokenMap.get(tokenKey(key))
          return {
            id: tokenKey(key),
            chain: key.chain,
            address: key.address,
            symbol: token?.symbol ?? null,
            isDeployed: token !== undefined,
          }
        }),
        relations: graphRelations,
      }
    }),

    checks: readOnlyProcedure
      .input(v.object({ chain: v.string(), address: v.string() }))
      .query(({ ctx, input }) =>
        checkDeployedToken(deps, ctx.db, ctx.tokenDb, input),
      ),

    getSuggestionsByCoingeckoId: readOnlyProcedure
      .input(v.string())
      .query(({ ctx, input }) =>
        getSuggestionsByCoingeckoId(deps.coingeckoClient, ctx.tokenDb, input),
      ),

    getCoingeckoSuggestions: readOnlyProcedure.query(({ ctx }) =>
      getCoingeckoSuggestions(deps.coingeckoClient, ctx.tokenDb),
    ),

    getSuggestionsByPartialTransfers: readOnlyProcedure.query(({ ctx }) =>
      getSuggestionsByPartialTransfers(ctx.db, ctx.tokenDb),
    ),
  })

function sortRelations<
  T extends {
    tokenAChain: string
    tokenAAddress: string
    tokenBChain: string
    tokenBAddress: string
    plugin: string
  },
>(relations: T[]) {
  return [...relations].sort((a, b) =>
    [a.plugin, a.tokenAChain, a.tokenAAddress, a.tokenBChain, a.tokenBAddress]
      .join(':')
      .localeCompare(
        [
          b.plugin,
          b.tokenAChain,
          b.tokenAAddress,
          b.tokenBChain,
          b.tokenBAddress,
        ].join(':'),
      ),
  )
}

function isGraphRelation(relation: { bridgeType: string }): boolean {
  return (
    relation.bridgeType === 'burnAndMint' ||
    relation.bridgeType === 'lockAndMint'
  )
}

/**
 * What one endpoint of a relation is to the other:
 *
 * - `locked` — this token is escrowed, the other is its minted representation
 * - `minted` — this token is minted by the relation's plugin: the
 *   representation side of a lock-and-mint pair, or either side of a
 *   burn-and-mint pair. A burn-and-mint pair is symmetric, but as a role that
 *   fact reads "minted" from each endpoint's point of view — the bridge type
 *   is what shows the symmetry, so the role does not repeat it.
 * - `unknown` — a lock-and-mint pair whose locked endpoint is not identified
 */
function tokenRelationRole(
  relation: TokenRelationRoute,
  token: { chain: string; address: string },
): 'locked' | 'minted' | 'unknown' {
  if (relation.bridgeType === 'burnAndMint') return 'minted'
  // Anything that is neither burnAndMint nor lockAndMint mints nothing and
  // has no locked side to name — it must not claim a minter, consistently
  // with `getMintingPluginsFor`. No writer produces such a row (ingestion
  // keeps only the non-swapping types and the add planner rejects the rest),
  // but this reader does not assume that.
  if (relation.bridgeType !== 'lockAndMint') return 'unknown'
  if (relation.lockedToken === null) return 'unknown'

  const locked =
    relation.lockedToken === 'A'
      ? { chain: relation.tokenAChain, address: relation.tokenAAddress }
      : { chain: relation.tokenBChain, address: relation.tokenBAddress }
  return tokenKey(locked) === tokenKey(token) ? 'locked' : 'minted'
}

function otherEndpoint(
  relation: TokenRelationRoute,
  token: { chain: string; address: string },
) {
  const a = {
    chain: relation.tokenAChain,
    address: relation.tokenAAddress,
  }
  if (tokenKey(a) !== tokenKey(token)) return a
  return { chain: relation.tokenBChain, address: relation.tokenBAddress }
}

function uniqueTokenKeys(tokens: { chain: string; address: string }[]) {
  return Array.from(
    new Map(tokens.map((token) => [tokenKey(token), token])).values(),
  )
}

function tokenKey(token: { chain: string; address: string }) {
  return `${token.chain}:${token.address.toLowerCase()}`
}

function formatTokenRelationPrimaryKey(
  relation: v.infer<typeof TokenRelationPrimaryKey>,
) {
  return `${relation.tokenAChain}:${relation.tokenAAddress} <-> ${relation.tokenBChain}:${relation.tokenBAddress} via ${relation.plugin} (${relation.bridgeType})`
}
