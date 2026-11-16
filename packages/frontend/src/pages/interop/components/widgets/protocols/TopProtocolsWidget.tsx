import times from 'lodash/times'
import { useMemo, useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import type { InteropDashboardData } from '~/server/features/layer2s/interop/getInteropDashboardData'
import type { InteropProtocolData } from '~/server/features/layer2s/interop/utils/getTopProtocols'
import { BetweenChainsInfo } from '../../BetweenChainsInfo'
import { Last24HoursBadge } from '../../Last24HoursBadge'
import { TopProtocolsByTransfersChart } from './TopProtocolsByTransfersChart'
import { TopProtocolsByVolumeChart } from './TopProtocolsByVolumeChart'
import { useProtocolColorMap } from './useProtocolColorMap'
import { getProtocolsDataWithOthers } from './utils/getProtocolsDataWithOthers'

export type DisplayProtocol = Omit<InteropProtocolData, 'slug' | 'iconUrl'> & {
  slug?: string
  iconUrl?: string
  color: string
  othersCount?: number
}

type TopProtocolsWidgetProps = {
  metricType: 'volume' | 'transfers'
  heading: string
  formatValue: (value: number) => string
  topProtocols: InteropDashboardData['topProtocols'] | undefined
  isLoading: boolean
}

export function TopProtocolsWidget({
  metricType,
  heading,
  formatValue,
  topProtocols,
  isLoading,
}: TopProtocolsWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width } = useResizeObserver({ ref: containerRef })

  const protocolColorMap = useProtocolColorMap(topProtocols)
  const protocolsWithOthers = useMemo(
    () =>
      getProtocolsDataWithOthers(topProtocols, protocolColorMap, metricType),
    [topProtocols, metricType, protocolColorMap],
  )

  return (
    <PrimaryCard
      className="@container flex h-full items-start justify-between"
      ref={containerRef}
    >
      <div>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h2 className="font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
            {heading}
          </h2>
          <Last24HoursBadge />
        </div>
        <BetweenChainsInfo className="mt-0.5" />
        <table className="mt-2 w-fit border-separate border-spacing-y-1 pr-1">
          <tbody>
            {isLoading || protocolsWithOthers.length === 0
              ? times(5).map((index) => (
                  <tr key={index}>
                    <td colSpan={3}>
                      <Skeleton className="h-4 w-48" />
                    </td>
                  </tr>
                ))
              : null}
            {protocolsWithOthers.length > 0 &&
              protocolsWithOthers.map((protocol) => (
                <tr key={protocol.name}>
                  <td className="flex items-center gap-1.5 font-medium text-label-value-13">
                    <div
                      className="size-3 min-w-3 rounded-xs"
                      style={{ backgroundColor: protocol.color }}
                    />
                    <div className="leading-none">
                      {protocol.slug ? (
                        <a href={`/interop/protocols/${protocol.slug}`}>
                          {protocol.name}
                        </a>
                      ) : protocol.name === 'Others' ? (
                        `Others (${protocol.othersCount ?? 0})`
                      ) : (
                        protocol.name
                      )}
                    </div>
                  </td>
                  <td className="@max-[373px]:hidden w-12 pl-2 text-right font-normal text-label-value-13 text-secondary tabular-nums">
                    {formatShare(protocol[metricType].share)}
                  </td>
                  <td className="w-12.5 whitespace-nowrap pl-2 text-right font-medium text-label-value-13 tabular-nums">
                    {formatValue(protocol[metricType].value)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {metricType === 'volume' ? (
        <TopProtocolsByVolumeChart
          protocols={protocolsWithOthers}
          isLoading={isLoading}
          containerWidth={width}
        />
      ) : (
        <TopProtocolsByTransfersChart
          protocols={protocolsWithOthers}
          isLoading={isLoading}
          containerWidth={width}
        />
      )}
    </PrimaryCard>
  )
}

/** A share that rounds to 0.0% but isn't zero reads "<0.1%". */
function formatShare(share: number) {
  if (share > 0 && share < 0.05) return '<0.1%'
  return `${share.toFixed(1)}%`
}
