import { ProjectId } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { EM_DASH } from '~/consts/characters'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { InteropNoDataBadge } from '~/pages/interop/components/InteropNoDataBadge'
import { InteropTopPathValue } from '~/pages/interop/components/InteropTopPathValue'
import { AvgDurationCell } from '~/pages/interop/components/table/AvgDurationCell'
import {
  InteropSummaryStat,
  InteropTransferSizeBreakdown,
  InteropTransferTypeBreakdown,
} from '~/pages/interop/protocol/components/InteropSummaryParts'
import { useTRPC } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { ProjectSection } from '../ProjectSection'
import { InteropTokensSection } from './InteropTokensSection'
import { InteropTransfersSection } from './InteropTransfersSection'

/**
 * Bridge-specific detail for the single selected protocol, shown as collapsible
 * subsections (collapsed by default) inside the "Volume and flows" section.
 */
export function InteropBridgeSubsections({
  protocolId,
  selectedChains,
  interopChains,
}: {
  protocolId: string
  selectedChains: string[]
  interopChains: InteropChainWithIcon[]
}) {
  const trpc = useTRPC()
  const apiSelection = { from: selectedChains, to: selectedChains }
  const { data } = useQuery(
    trpc.interop.protocol.queryOptions({
      id: protocolId,
      ...apiSelection,
    }),
  )

  if (!data?.entry) return null

  const projectId = ProjectId(protocolId)

  return (
    <div className="flex flex-col">
      <ProjectSection
        as="div"
        id="interop-volume"
        title="Bridge summary"
        sectionOrder={undefined}
        nested
        collapsible
      >
        <div className="flex flex-col gap-4">
          <div className="grid gap-x-8 gap-y-4 max-md:grid-cols-1 md:grid-cols-3">
            <InteropSummaryStat
              title="Last 24h top path"
              value={
                data.topPath ? (
                  <InteropTopPathValue path={data.topPath} />
                ) : (
                  EM_DASH
                )
              }
            />
            <InteropSummaryStat
              title="Last 24h avg. transfer time"
              value={
                data.entry.averageDuration ? (
                  <AvgDurationCell
                    className="font-bold text-label-value-16"
                    splitClassName="flex-row text-label-value-16 font-bold"
                    averageDuration={data.entry.averageDuration}
                  />
                ) : (
                  <InteropNoDataBadge size="extraSmall" />
                )
              }
            />
            <InteropSummaryStat
              title="Last 24h avg. transfer value"
              value={
                data.entry.averageValue
                  ? formatCurrency(data.entry.averageValue, 'usd')
                  : EM_DASH
              }
            />
          </div>
          <InteropTransferSizeBreakdown protocolData={data} />
          <InteropTransferTypeBreakdown protocolData={data} />
        </div>
      </ProjectSection>

      <InteropTokensSection
        as="div"
        id="interop-tokens"
        title="Top tokens by volume"
        sectionOrder={undefined}
        nested
        collapsible
        projectId={projectId}
        apiSelection={apiSelection}
        data={data}
      />

      <InteropTransfersSection
        as="div"
        id="interop-transfers"
        title="Transfers"
        sectionOrder={undefined}
        nested
        collapsible
        projectId={projectId}
        apiSelection={apiSelection}
        data={data}
        interopChains={interopChains}
      />
    </div>
  )
}
