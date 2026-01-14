import { useMemo } from 'react'
import type { ChartMeta } from '~/components/core/chart/Chart'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { ProtocolsPieChart } from '../charts/ProtocolsPieChart'
import type { DisplayVolumeProtocol } from './TopProtocolsByVolume'

export function TopProtocolsByVolumeChart({
  protocols,
}: {
  protocols: DisplayVolumeProtocol[]
}) {
  const chartMeta = useMemo(() => {
    return protocols.reduce((acc, protocol) => {
      acc[protocol.protocolName] = {
        label:
          protocol.protocolName === 'Others'
            ? `Others (${protocol.othersCount ?? 0})`
            : protocol.protocolName,
        color: protocol.color,
        indicatorType: { shape: 'square' },
      }
      return acc
    }, {} as ChartMeta)
  }, [protocols])

  const chartData = useMemo(() => {
    return protocols.map((protocol) => ({
      name: protocol.protocolName,
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
      center={{
        label: 'Volume',
        value: formatCurrency(totalVolume, 'usd', {
          decimals: 1,
        }),
      }}
    />
  )
}
