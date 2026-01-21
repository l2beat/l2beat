import times from 'lodash/times'
import uniq from 'lodash/uniq'
import { useMemo, useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import type { InteropProtocolData } from '~/server/features/scaling/interop/utils/getTopProtocols'
import { useInteropSelectedChains } from '../../../utils/InteropSelectedChainsContext'
import { TopProtocolsByTransfersChart } from './TopProtocolsByTransfersChart'
import { TopProtocolsByVolumeChart } from './TopProtocolsByVolumeChart'
import { useProtocolColorMap } from './useProtocolColorMap'
import { getProtocolsDataWithOthers } from './utils/getProtocolsDataWithOthers'

export type DisplayProtocol = InteropProtocolData & {
  color: string
  othersCount?: number
}

type TopProtocolsWidgetProps = {
  metricType: 'volume' | 'transfers'
  heading: string
  formatValue: (value: number) => string
  data: InteropDashboardData | undefined
  isLoading: boolean
}

export function TopProtocolsWidget({
  metricType,
  heading,
  formatValue,
  data,
  isLoading,
}: TopProtocolsWidgetProps) {
  const { selectedChains } = useInteropSelectedChains()

  const containerRef = useRef<HTMLDivElement>(null)
  const { width } = useResizeObserver({ ref: containerRef })

  const uniqChains = uniq([...selectedChains.from, ...selectedChains.to])

  const protocolColorMap = useProtocolColorMap(data?.topProtocols)
  const protocolsWithOthers = useMemo(
    () =>
      getProtocolsDataWithOthers(
        data?.topProtocols,
        protocolColorMap,
        metricType,
      ),
    [data?.topProtocols, metricType, protocolColorMap],
  )

  return (
    <PrimaryCard
      className="@container flex h-full items-start justify-between max-md:rounded-lg"
      ref={containerRef}
    >
      <div className="flex-1">
        <h2 className="font-bold text-heading-16 md:text-heading-20">
          {heading}
        </h2>
        <div className="mt-0.5 font-medium text-label-value-12 text-secondary md:text-label-value-14">
          Between {uniqChains.length} selected chains
        </div>
        <table className="mt-2 w-fit border-separate border-spacing-y-1 pr-1">
          <tbody>
            {isLoading || protocolsWithOthers.length === 0
              ? times(5).map((index) => (
                  <tr key={index}>
                    <td colSpan={3}>
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
              : null}
            {protocolsWithOthers.length > 0 &&
              protocolsWithOthers.map((protocol) => (
                <tr key={protocol.protocolName}>
                  <td className="flex items-center gap-1 font-medium text-2xs">
                    <div
                      className="size-3 rounded-xs"
                      style={{ backgroundColor: protocol.color }}
                    />
                    {protocol.protocolName === 'Others'
                      ? `Others (${protocol.othersCount ?? 0})`
                      : protocol.protocolName}
                  </td>
                  <td className="px-2 text-right font-medium text-2xs text-secondary">
                    {protocol[metricType].share.toFixed(1)}%
                  </td>
                  <td className="text-right font-medium text-2xs">
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
