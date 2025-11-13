import { assertUnreachable } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { BlockscoutClient } from '../../chains/clients/blockscout/BlockscoutClient'
import { EtherscanClient } from '../../chains/clients/etherscan/EtherscanClient'
import { RpcClient } from '../../chains/clients/rpc/RpcClient'
import { ChainRecord, ChainUpdateSchema } from '../../schemas/Chain'
import { readOnlyProcedure, readWriteProcedure } from '../procedures'
import { router } from '../trpc'

export interface ChainsRouterDeps {
  etherscanApiKey: string | undefined
  createRpcClient?: (config: { url: string }) => RpcClient
  createBlockscoutClient?: (config: { url: string }) => BlockscoutClient
  createEtherscanClient?: (
    config: { apiKey: string },
    chainId: number,
  ) => EtherscanClient
}

export const chainsRouter = (deps: ChainsRouterDeps) =>
  router({
    getAll: readOnlyProcedure.query(({ ctx }) => ctx.db.chain.getAll()),
    getByName: readOnlyProcedure
      .input(v.string())
      .query(async ({ input, ctx }) => {
        const result = await ctx.db.chain.findByName(input)
        return result ?? null
      }),
    insert: readWriteProcedure
      .input(ChainRecord)
      .mutation(async ({ input, ctx }) => {
        await ctx.db.chain.insert(input)
        return { success: true }
      }),
    update: readWriteProcedure
      .input(
        v.object({
          name: v.string(),
          update: ChainUpdateSchema,
        }),
      )
      .mutation(async ({ input, ctx }) =>
        ctx.db.chain.updateByName(input.name, input.update),
      ),
    delete: readWriteProcedure
      .input(v.object({ name: v.string() }))
      .mutation(async ({ input, ctx }) =>
        ctx.db.chain.deleteByName(input.name),
      ),
    testApi: readOnlyProcedure
      .input(
        v.union([
          v.object({
            type: v.enum(['rpc', 'blockscout']),
            url: v.string(),
          }),
          v.object({
            type: v.literal('etherscan'),
            chainId: v.number(),
          }),
        ]),
      )
      .mutation(({ input }) => {
        const {
          etherscanApiKey,
          createRpcClient = (config) => new RpcClient(config),
          createBlockscoutClient = (config) => new BlockscoutClient(config),
          createEtherscanClient = (config, chainId) =>
            new EtherscanClient(config, chainId),
        } = deps

        switch (input.type) {
          case 'rpc': {
            const client = createRpcClient({ url: input.url })
            return client.test()
          }
          case 'blockscout': {
            const client = createBlockscoutClient({ url: input.url })
            return client.test()
          }
          case 'etherscan': {
            if (!etherscanApiKey) {
              return { success: false, error: 'API key not configured' }
            }
            const client = createEtherscanClient(
              { apiKey: etherscanApiKey },
              input.chainId,
            )
            return client.test()
          }
          default: {
            assertUnreachable(input)
          }
        }
      }),
  })
