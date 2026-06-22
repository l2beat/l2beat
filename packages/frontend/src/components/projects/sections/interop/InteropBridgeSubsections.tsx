import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { InteropTransferSizeBreakdown } from '~/pages/interop/components/InteropTransferSizeBreakdown'
import { InteropTransferTypeBreakdown } from '~/pages/interop/components/InteropTransferTypeBreakdown'
import type { InteropScope } from '~/server/features/scaling/interop/types'
import { useTRPC } from '~/trpc/React'
import { InteropCollapsibleSubsection } from './InteropCollapsibleSubsection'
import { InteropTokensTableView } from './InteropTokensTableView'
import { InteropTransfersTableView } from './InteropTransfersTableView'

export function InteropBridgeSubsections({
  protocolIds,
  chains,
  anchorChain,
}: {
  protocolIds: string[]
  chains: string[]
  anchorChain: string
}) {
  const trpc = useTRPC()
  const apiSelection = useMemo(() => ({ from: chains, to: chains }), [chains])
  const scope = useMemo<InteropScope>(
    () => ({ type: 'selection', protocolIds, anchorChain }),
    [protocolIds, anchorChain],
  )
  const { data, isLoading } = useQuery(
    trpc.interop.bridgeSelection.queryOptions(
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
        <InteropTokensTableView
          tokens={data?.tokens}
          isLoading={isLoading}
          apiSelection={apiSelection}
        />
      </InteropCollapsibleSubsection>

      <InteropCollapsibleSubsection id="interop-transfers" title="Transfers">
        <InteropTransfersTableView
          scope={scope}
          from={chains}
          to={chains}
          snapshotTimestamp={data?.snapshotTimestamp}
          isSnapshotLoading={isLoading}
        />
      </InteropCollapsibleSubsection>
    </div>
  )
}
