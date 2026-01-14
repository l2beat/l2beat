import { useMemo } from 'react'
import type { ChartMeta } from '~/components/core/chart/Chart'
import { formatNumber } from '~/utils/number-format/formatNumber'
import { ProtocolsPieChart } from '../charts/ProtocolsPieChart'
import type { DisplayProtocolTransfer } from './TopProtocolsByTransfers'

export function TopProtocolsByTransfersChart({
  protocols,
}: {
  protocols: DisplayProtocolTransfer[]
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
      center={{
        label: 'Transfers',
        value: formatNumber(totalTransfers),
      }}
    />
  )
}
