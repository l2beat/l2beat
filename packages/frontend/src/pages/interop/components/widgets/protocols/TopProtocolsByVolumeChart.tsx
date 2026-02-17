import { useMemo } from 'react'
import type { ChartMeta } from '~/components/core/chart/Chart'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { ProtocolsPieChart } from './ProtocolsPieChart'
import type { DisplayProtocol } from './TopProtocolsWidget'

export function TopProtocolsByVolumeChart({
  protocols,
  isLoading,
  containerWidth,
}: {
  protocols: DisplayProtocol[]
  isLoading: boolean
  containerWidth: number | undefined
}) {
  const chartMeta = useMemo(() => {
    return protocols.reduce((acc, protocol) => {
      acc[protocol.name] = {
        label:
          protocol.name === 'Others'
            ? `Others (${protocol.othersCount ?? 0})`
            : protocol.name,
        color: protocol.color,
        indicatorType: { shape: 'square' },
      }
      return acc
    }, {} as ChartMeta)
  }, [protocols])

  const chartData = useMemo(() => {
    return protocols.map((protocol) => ({
      name: protocol.name,
      value: protocol.volume.value,
      fill: protocol.color,
    }))
  }, [protocols])

  const totalVolume = useMemo(
    () => protocols.reduce((acc, protocol) => acc + protocol.volume.value, 0),
    [protocols],
  )

  return (
    <ProtocolsPieChart
      chartMeta={chartMeta}
      chartData={chartData}
      isLoading={isLoading}
      containerWidth={containerWidth}
      center={{
        label: 'Volume',
        value: formatCurrency(totalVolume, 'usd', {
          decimals: 1,
        }),
      }}
    />
  )
}
