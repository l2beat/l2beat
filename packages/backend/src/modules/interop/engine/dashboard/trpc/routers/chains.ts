import { INTEROP_CHAINS } from '@l2beat/config'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'

type Dependencies = {
  captureEnabled: boolean
  chains: readonly { id: string; type: 'evm' }[]
  oneSidedChains: string[]
  getExplorerUrl: (chain: string) => string | undefined
}

type ChainMetadataRow = {
  id: string
  name: string
  display: string
  explorerUrl: string | undefined
  isCaptureChain: boolean
  isOneSided: boolean
}

export function createChainsRouter(deps: Dependencies) {
  return router({
    metadata: protectedProcedure.query(() => {
      return getInteropChainMetadata(deps)
    }),
    summary: protectedProcedure.query(async ({ ctx }) => {
      const metadata = getInteropChainMetadata(deps)
      const stats = await ctx.db.interopTransfer.getChainSummaryStats()
      const statsByChain = new Map(stats.map((stat) => [stat.chain, stat]))
      const knownById = new Map(metadata.map((chain) => [chain.id, chain]))
      const allIds = new Set([
        ...metadata.map((chain) => chain.id),
        ...stats.map((stat) => stat.chain),
      ])

      const rows = [...allIds]
        .map((id) => {
          const known = knownById.get(id)
          const stat = statsByChain.get(id)

          return {
            id,
            name: known?.name ?? id,
            display: known?.display ?? id,
            explorerUrl: known?.explorerUrl ?? deps.getExplorerUrl(id),
            isKnownChain: known !== undefined,
            isCaptureChain: known?.isCaptureChain ?? false,
            isOneSided: known?.isOneSided ?? false,
            outgoingTransfersCount: stat?.outgoingTransfersCount ?? 0,
            outgoingValueUsd: stat?.outgoingValueUsd ?? 0,
            incomingTransfersCount: stat?.incomingTransfersCount ?? 0,
            incomingValueUsd: stat?.incomingValueUsd ?? 0,
            totalTransfersCount:
              (stat?.outgoingTransfersCount ?? 0) +
              (stat?.incomingTransfersCount ?? 0),
            totalValueUsd:
              (stat?.outgoingValueUsd ?? 0) + (stat?.incomingValueUsd ?? 0),
          }
        })
        .sort((a, b) => {
          if (a.isKnownChain !== b.isKnownChain) {
            return a.isKnownChain ? -1 : 1
          }
          if (a.totalValueUsd !== b.totalValueUsd) {
            return b.totalValueUsd - a.totalValueUsd
          }
          return a.id.localeCompare(b.id, 'en', { sensitivity: 'base' })
        })

      return {
        captureEnabled: deps.captureEnabled,
        rows,
      }
    }),
  })
}

function getInteropChainMetadata(deps: Dependencies): ChainMetadataRow[] {
  const captureChains = new Set(deps.chains.map((chain) => chain.id))
  const oneSidedChains = new Set(deps.oneSidedChains)

  return INTEROP_CHAINS.map((chain) => ({
    id: chain.id,
    name: chain.name,
    display: chain.display,
    explorerUrl: deps.getExplorerUrl(chain.id),
    isCaptureChain: captureChains.has(chain.id),
    isOneSided: oneSidedChains.has(chain.id),
  }))
}
