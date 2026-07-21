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
        const [outgoing, incoming] = await Promise.all([
          ctx.tokenDb.tokenRelation.getRelationsFrom(input),
          ctx.tokenDb.tokenRelation.getRelationsTo(input),
        ])

        const otherTokenKeys = uniqueTokenKeys([
          ...outgoing.map((relation) => ({
            chain: relation.tokenToChain,
            address: relation.tokenToAddress,
          })),
          ...incoming.map((relation) => ({
            chain: relation.tokenFromChain,
            address: relation.tokenFromAddress,
          })),
        ])
        const otherTokens =
          await ctx.tokenDb.deployedToken.getByPrimaryKeys(otherTokenKeys)
        const otherTokenMap = new Map(
          otherTokens.map((token) => [tokenKey(token), token]),
        )

        return {
          outgoing: sortRelations(outgoing).map((relation) => ({
            relation,
            otherToken:
              otherTokenMap.get(
                tokenKey({
                  chain: relation.tokenToChain,
                  address: relation.tokenToAddress,
                }),
              ) ?? null,
          })),
          incoming: sortRelations(incoming).map((relation) => ({
            relation,
            otherToken:
              otherTokenMap.get(
                tokenKey({
                  chain: relation.tokenFromChain,
                  address: relation.tokenFromAddress,
                }),
              ) ?? null,
          })),
        }
      }),

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
      const tokenKeys = uniqueTokenKeys(
        relations.flatMap((relation) => [
          {
            chain: relation.tokenFromChain,
            address: relation.tokenFromAddress,
          },
          {
            chain: relation.tokenToChain,
            address: relation.tokenToAddress,
          },
        ]),
      )
      const tokens = await ctx.tokenDb.deployedToken.getByPrimaryKeys(tokenKeys)
      const tokenMap = new Map(tokens.map((token) => [tokenKey(token), token]))
      const graphRelations = relations.map((relation) => {
        const tokenFrom = tokenMap.get(
          tokenKey({
            chain: relation.tokenFromChain,
            address: relation.tokenFromAddress,
          }),
        )
        const tokenTo = tokenMap.get(
          tokenKey({
            chain: relation.tokenToChain,
            address: relation.tokenToAddress,
          }),
        )

        return {
          ...relation,
          isConflict:
            tokenFrom?.abstractTokenId != null &&
            tokenTo?.abstractTokenId != null &&
            tokenFrom.abstractTokenId !== tokenTo.abstractTokenId,
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
    tokenFromChain: string
    tokenFromAddress: string
    tokenToChain: string
    tokenToAddress: string
    plugin: string
  },
>(relations: T[]) {
  return [...relations].sort((a, b) =>
    [
      a.plugin,
      a.tokenFromChain,
      a.tokenFromAddress,
      a.tokenToChain,
      a.tokenToAddress,
    ]
      .join(':')
      .localeCompare(
        [
          b.plugin,
          b.tokenFromChain,
          b.tokenFromAddress,
          b.tokenToChain,
          b.tokenToAddress,
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
  return `${relation.tokenFromChain}:${relation.tokenFromAddress} -> ${relation.tokenToChain}:${relation.tokenToAddress} via ${relation.plugin} (${relation.bridgeType})`
}
