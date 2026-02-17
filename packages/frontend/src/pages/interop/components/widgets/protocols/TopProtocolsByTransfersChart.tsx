import { useMemo } from 'react'
import type { ChartMeta } from '~/components/core/chart/Chart'
import { formatNumber } from '~/utils/number-format/formatNumber'
import { ProtocolsPieChart } from './ProtocolsPieChart'
import type { DisplayProtocol } from './TopProtocolsWidget'

export function TopProtocolsByTransfersChart({
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
      value: protocol.transfers.value,
      fill: protocol.color,
    }))
  }, [protocols])

  const totalTransfers = useMemo(
    () =>
      protocols.reduce((acc, protocol) => acc + protocol.transfers.value, 0),
    [protocols],
  )

  return (
    <ProtocolsPieChart
      chartMeta={chartMeta}
      chartData={chartData}
      isLoading={isLoading}
      containerWidth={containerWidth}
      center={{
        label: 'Transfers',
        value: formatNumber(totalTransfers),
      }}
    />
  )
}
