import { useMemo } from 'react'
import type { ChartMeta } from '~/components/core/chart/Chart'
import { formatNumber } from '~/utils/number-format/formatNumber'
import { ProtocolsPieChart } from './ProtocolsPieChart'
import type { DisplayProtocol } from './TopProtocolsWidget'

export function TopProtocolsByTransfersChart({
  protocols,
  isLoading,
}: {
  protocols: DisplayProtocol[]
  isLoading: boolean
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
      center={{
        label: 'Transfers',
        value: formatNumber(totalTransfers),
      }}
    />
  )
}
