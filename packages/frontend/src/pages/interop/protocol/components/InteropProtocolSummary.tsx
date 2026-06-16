import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { EM_DASH } from '~/consts/characters'
import type { InteropProtocolDashboardData } from '~/server/features/scaling/interop/getInteropProtocolData'
import type { InteropProtocolEntry } from '~/server/features/scaling/interop/protocol/getInteropProtocolEntry'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { InteropNoDataBadge } from '../../components/InteropNoDataBadge'
import { InteropTopPathValue } from '../../components/InteropTopPathValue'
import { AvgDurationCell } from '../../components/table/AvgDurationCell'
import { TopTokensCell } from '../../components/tokens/TopTokensCell'
import type { InteropSelection } from '../../utils/types'
import {
  InteropSummaryStat,
  InteropTransferSizeBreakdown,
  InteropTransferTypeBreakdown,
} from './InteropSummaryParts'

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
        <InteropSummaryStat
          title="Last 24h volume"
          value={
            protocolData?.entry?.volume
              ? formatCurrency(protocolData.entry.volume, 'usd')
              : EM_DASH
          }
        />
        <InteropSummaryStat
          title="Last 24h transfer count"
          value={formatInteger(protocolData?.entry?.transferCount ?? 0)}
        />
        <InteropSummaryStat
          title="Last 24h top path"
          value={
            protocolData?.topPath ? (
              <InteropTopPathValue path={protocolData.topPath} />
            ) : (
              EM_DASH
            )
          }
        />
        <HorizontalSeparator className="col-span-3 my-4 max-md:hidden" />
        <InteropSummaryStat
          title="Last 24h avg. transfer time"
          value={
            protocolData?.entry?.averageDuration ? (
              <AvgDurationCell
                className="font-bold text-label-value-16"
                splitClassName="flex-row text-label-value-16 font-bold"
                averageDuration={protocolData?.entry?.averageDuration}
              />
            ) : (
              <InteropNoDataBadge size="extraSmall" />
            )
          }
        />
        <InteropSummaryStat
          title="Last 24 avg. transfer value"
          value={
            protocolData?.entry?.averageValue
              ? formatCurrency(protocolData.entry.averageValue, 'usd')
              : EM_DASH
          }
        />
        <InteropSummaryStat
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
            />
          }
        />
      </div>
      <HorizontalSeparator className="my-4" />
      <InteropTransferSizeBreakdown transferSize={protocolData.transferSize} />
      <HorizontalSeparator className="my-4" />
      <InteropTransferTypeBreakdown
        byType={Object.fromEntries(
          Object.entries(protocolData?.entry?.byBridgeType ?? {}).flatMap(
            ([type, stats]) => (stats ? [[type, stats.volume] as const] : []),
          ),
        )}
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
