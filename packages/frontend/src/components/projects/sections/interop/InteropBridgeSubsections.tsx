import { useQuery } from '@tanstack/react-query'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { InteropTransferSizeBreakdown } from '~/pages/interop/components/InteropTransferSizeBreakdown'
import { InteropTransferTypeBreakdown } from '~/pages/interop/components/InteropTransferTypeBreakdown'
import { useTRPC } from '~/trpc/React'
import { InteropCollapsibleSubsection } from './InteropCollapsibleSubsection'
import { InteropTokensTable } from './InteropTokensTable'
import { InteropTransfersTable } from './InteropTransfersTable'

export function InteropBridgeSubsections({
  protocolIds,
  chains,
  anchorChain,
  interopChains,
}: {
  protocolIds: string[]
  chains: string[]
  anchorChain: string
  interopChains: InteropChainWithIcon[]
}) {
  const trpc = useTRPC()
  const apiSelection = { from: chains, to: chains }
  const { data, isLoading } = useQuery(
    trpc.interop.selectionDetails.queryOptions(
      { ...apiSelection, protocolIds, anchorChain },
      {
        enabled: protocolIds.length > 0 && chains.length > 0,
      },
    ),
  )

  if (protocolIds.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-divider bg-surface-primary px-4 pt-2.5 pb-4">
          <InteropTransferSizeBreakdown transferSize={data?.transferSize} />
        </div>
        <div className="rounded-lg border border-divider bg-surface-primary px-4 pt-2.5 pb-4">
          <InteropTransferTypeBreakdown byType={data?.transferType} />
        </div>
      </div>

      <InteropCollapsibleSubsection
        id="interop-tokens"
        title="Top tokens by volume"
      >
        <InteropTokensTable
          protocolIds={protocolIds}
          apiSelection={apiSelection}
          anchorChain={anchorChain}
        />
      </InteropCollapsibleSubsection>

      <InteropCollapsibleSubsection id="interop-transfers" title="Transfers">
        <InteropTransfersTable
          protocolIds={protocolIds}
          apiSelection={apiSelection}
          anchorChain={anchorChain}
          snapshotTimestamp={data?.snapshotTimestamp}
          interopChains={interopChains}
          showChainFilters={false}
          isSnapshotLoading={isLoading}
        />
      </InteropCollapsibleSubsection>
    </div>
  )
}
