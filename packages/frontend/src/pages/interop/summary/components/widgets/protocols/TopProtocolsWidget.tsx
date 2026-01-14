import times from 'lodash/times'
import uniq from 'lodash/uniq'
import { useMemo } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { InteropProtocolData } from '~/server/features/scaling/interop/utils/getTopProtocols'
import { api } from '~/trpc/React'
import { generateAccessibleColors } from '~/utils/generateColors'
import { useInteropSelectedChains } from '../../../utils/InteropSelectedChainsContext'
import { TopProtocolsByTransfersChart } from './TopProtocolsByTransfersChart'
import { TopProtocolsByVolumeChart } from './TopProtocolsByVolumeChart'

export type DisplayProtocol = InteropProtocolData & {
  color: string
  othersCount?: number
}

type TopProtocolsWidgetProps = {
  metricType: 'volume' | 'transfers'
  heading: string
  formatValue: (value: number) => string
}

export function TopProtocolsWidget({
  metricType,
  heading,
  formatValue,
}: TopProtocolsWidgetProps) {
  const { selectedChains } = useInteropSelectedChains()
  const uniqChains = uniq([...selectedChains.from, ...selectedChains.to])
  const { data, isLoading } = api.interop.dashboard.useQuery({
    from: selectedChains.from,
    to: selectedChains.to,
  })

  const protocolsWithOthers = useMemo(() => {
    if (!data?.topProtocols) return []

    data.topProtocols.sort((a, b) => b[metricType].value - a[metricType].value)

    const top5 = data.topProtocols.slice(0, 5)
    const others = data.topProtocols.slice(5)

    if (others.length === 0) {
      return top5
    }

    const totalValue = data.topProtocols.reduce(
      (sum, p) => sum + p[metricType].value,
      0,
    )
    const othersValue = others.reduce((sum, p) => sum + p[metricType].value, 0)
    const othersShare = totalValue > 0 ? (othersValue / totalValue) * 100 : 0

    return [
      ...top5,
      {
        protocolName: 'Others',
        volume: {
          value: metricType === 'volume' ? othersValue : 0,
          share: metricType === 'volume' ? othersShare : 0,
        },
        transfers: {
          value: metricType === 'transfers' ? othersValue : 0,
          share: metricType === 'transfers' ? othersShare : 0,
        },
        othersCount: others.length,
      },
    ] as DisplayProtocol[]
  }, [data?.topProtocols, metricType])

  const colors = useMemo(
    () => generateAccessibleColors(protocolsWithOthers.length),
    [protocolsWithOthers.length],
  )

  const protocolsWithColors: DisplayProtocol[] = protocolsWithOthers.map(
    (protocol, index) => ({
      ...protocol,
      color: colors[index] ?? '#000000',
    }),
  )

  return (
    <PrimaryCard className="flex h-full items-start justify-between">
      <div className="flex-1">
        <h2 className="font-bold text-heading-20">{heading}</h2>
        <div className="mt-0.5 font-medium text-label-value-14 text-secondary">
          Between {uniqChains.length} supported chains
        </div>
        <table className="mt-2 w-full border-separate border-spacing-y-1">
          <tbody>
            {isLoading || protocolsWithColors.length === 0
              ? times(5).map((index) => (
                  <tr key={index}>
                    <td colSpan={3}>
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
              : null}
            {protocolsWithColors.length > 0 &&
              protocolsWithColors.map((protocol) => (
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
                  <td className="px-2 font-medium text-2xs text-secondary">
                    {protocol[metricType].share.toFixed(2)}%
                  </td>
                  <td className="font-medium text-2xs">
                    {formatValue(protocol[metricType].value)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {metricType === 'volume' ? (
        <TopProtocolsByVolumeChart protocols={protocolsWithColors} />
      ) : (
        <TopProtocolsByTransfersChart protocols={protocolsWithColors} />
      )}
    </PrimaryCard>
  )
}
