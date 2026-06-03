import { useQuery } from '@tanstack/react-query'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { InteropTransferSizeBreakdown } from '~/pages/interop/protocol/components/InteropSummaryParts'
import { useTRPC } from '~/trpc/React'
import { InteropTokensSection } from './InteropTokensSection'
import { InteropTransfersSection } from './InteropTransfersSection'

/**
 * Detail for the current protocol + chain selection, shown within the "Volume
 * and flows" section: the aggregate transfer-size breakdown inline, plus the
 * Top tokens and Transfers tables as collapsible (card) subsections. Always
 * rendered — the data reflects the selected protocols and chains.
 */
export function InteropBridgeSubsections({
  protocolIds,
  selectedChains,
  interopChains,
}: {
  protocolIds: string[]
  selectedChains: string[]
  interopChains: InteropChainWithIcon[]
}) {
  const trpc = useTRPC()
  const apiSelection = { from: selectedChains, to: selectedChains }
  const { data } = useQuery(
    trpc.interop.selectionDetails.queryOptions(
      { ...apiSelection, protocolIds },
      {
        enabled: protocolIds.length > 0 && selectedChains.length > 0,
      },
    ),
  )

  if (protocolIds.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-divider bg-surface-primary px-4 pt-2.5 pb-4">
        <InteropTransferSizeBreakdown transferSize={data?.transferSize} />
      </div>

      <InteropTokensSection
        as="div"
        id="interop-tokens"
        title="Top tokens by volume"
        sectionOrder={undefined}
        nested
        collapsible
        protocolIds={protocolIds}
        apiSelection={apiSelection}
      />

      <InteropTransfersSection
        as="div"
        id="interop-transfers"
        title="Transfers"
        sectionOrder={undefined}
        nested
        collapsible
        protocolIds={protocolIds}
        apiSelection={apiSelection}
        snapshotTimestamp={data?.snapshotTimestamp}
        interopChains={interopChains}
      />
    </div>
  )
}
