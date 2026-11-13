import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { EM_DASH } from '~/consts/characters'
import type { InteropProtocolDashboardData } from '~/server/features/layer2s/interop/getInteropProtocolData'
import type { InteropProtocolEntry } from '~/server/features/layer2s/interop/protocol/getInteropProtocolEntry'
import { InteropNoDataBadge } from '../../components/InteropNoDataBadge'
import { InteropTopPathValue } from '../../components/InteropTopPathValue'
import { InteropTransferSizeBreakdown } from '../../components/InteropTransferSizeBreakdown'
import { InteropTransferTypeBreakdown } from '../../components/InteropTransferTypeBreakdown'
import { AvgDurationCell } from '../../components/table/AvgDurationCell'
import { TopTokensCell } from '../../components/tokens/TopTokensCell'
import { getBridgeTypeVolumes } from '../../utils/getBridgeTypeVolumes'
import type { InteropSelection } from '../../utils/types'

export function InteropProtocolSummary({
  protocol,
  apiSelection,
  protocolData,
}: {
  protocol: InteropProtocolEntry
  apiSelection: InteropSelection
  protocolData: InteropProtocolDashboardData
}) {
  return (
    <section
      id="summary"
      data-role="nav-section"
      className="mt-4 flex w-full scroll-mt-[100vh] flex-col border-divider px-4 max-md:border-b max-md:pb-6 md:rounded-lg md:bg-surface-primary md:p-6"
    >
      <div className="grid grid-cols-1 gap-x-3 max-md:gap-y-3 md:grid-cols-3">
        <StatsItem
          title="Last 24h volume"
          value={
            protocolData?.entry?.volume
              ? formatCurrency(protocolData.entry.volume, 'usd')
              : EM_DASH
          }
        />
        <StatsItem
          title="Last 24h transfer count"
          value={formatInteger(protocolData?.entry?.transferCount ?? 0)}
        />
        <StatsItem
          title="Last 24h top path"
          value={
            protocolData?.topPath ? (
              <InteropTopPathValue path={protocolData.topPath} />
            ) : (
              EM_DASH
            )
          }
        />
        <HorizontalSeparator className="my-1 md:col-span-3 md:my-4" />
        <StatsItem
          title="Last 24h avg. transfer time"
          value={
            protocolData?.entry?.averageDuration ? (
              <AvgDurationCell
                className="font-bold text-label-value-16"
                splitClassName="flex-row gap-3 text-label-value-16 font-bold md:gap-3"
                averageDuration={protocolData?.entry?.averageDuration}
              />
            ) : (
              <InteropNoDataBadge size="extraSmall" />
            )
          }
        />
        <StatsItem
          title="Last 24h avg. transfer value"
          value={
            protocolData?.entry?.averageValue
              ? formatCurrency(protocolData.entry.averageValue, 'usd')
              : EM_DASH
          }
        />
        <StatsItem
          title="Tokens by volume"
          value={
            <TopTokensCell
              topItems={
                protocolData?.entry?.tokens ?? { items: [], remainingCount: 0 }
              }
              type={undefined}
              apiSelection={apiSelection}
              protocol={{
                id: protocol.id,
                name: protocolData?.entry?.name ?? '',
                slug: protocol.slug,
                iconUrl: protocolData?.entry?.iconUrl ?? '',
                bridgeTypes: protocolData?.entry?.bridgeTypes ?? [],
              }}
              hideDialog
              itemsType="default"
            />
          }
        />
      </div>
      <HorizontalSeparator className="my-4" />
      <InteropTransferSizeBreakdown
        transferSize={protocolData.transferSize}
        inSummary
      />
      <HorizontalSeparator className="my-4" />
      <InteropTransferTypeBreakdown
        inSummary
        byType={getBridgeTypeVolumes(protocolData?.entry?.byBridgeType)}
      />
      {protocol.header.description && (
        <div className="max-md:hidden">
          <HorizontalSeparator className="my-4" />
          <AboutSection description={protocol.header.description} />
        </div>
      )}
    </section>
  )
}

function StatsItem({ title, value }: { title: string; value: ReactNode }) {
  return (
    <div className="flex gap-4 max-md:items-center max-md:justify-between md:flex-col md:gap-3">
      <span className="shrink-0 font-normal text-label-value-13 text-primary leading-4">
        {title}
      </span>
      <div className="min-w-0 font-bold text-label-value-16 leading-none max-md:text-right">
        {value}
      </div>
    </div>
  )
}
