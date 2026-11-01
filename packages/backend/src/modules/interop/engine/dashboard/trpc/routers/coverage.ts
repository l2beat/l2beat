import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'
import { getInteropCoverageData } from '../../impls/coverage'

type Dependencies = {
  chains: readonly { id: string }[]
  oneSidedChains: readonly string[]
  oneSidedPlugins: readonly string[]
}

export function createCoverageRouter(deps: Dependencies) {
  return router({
    data: protectedProcedure.query(({ ctx }) =>
      getInteropCoverageData(ctx.db, {
        capturedChains: deps.chains.map((chain) => chain.id),
        oneSidedChains: deps.oneSidedChains,
        oneSidedPlugins: deps.oneSidedPlugins,
      }),
    ),
  })
}
