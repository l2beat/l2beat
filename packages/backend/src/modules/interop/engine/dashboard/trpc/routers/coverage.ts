import { INTEROP_ONE_SIDED_CHAINS } from '@l2beat/config'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import { getInteropCoverageData } from '../../impls/coverage'

type Dependencies = {
  chains: readonly { id: string }[]
  oneSidedChains: readonly string[]
  oneSidedPlugins: readonly string[]
  maxTransferValueUsd: number
}

export function createCoverageRouter(deps: Dependencies) {
  return router({
    data: protectedProcedure.query(({ ctx }) =>
      getInteropCoverageData(ctx.db, {
        capturedChains: deps.chains.map((chain) => chain.id),
        oneSidedChains: deps.oneSidedChains,
        configuredOneSidedChains: INTEROP_ONE_SIDED_CHAINS,
        oneSidedPlugins: deps.oneSidedPlugins,
        maxTransferValueUsd: deps.maxTransferValueUsd,
      }),
    ),
  })
}
