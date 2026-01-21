import type { InteropConfig } from '@l2beat/config'
import { formatNumber } from '~/utils/number-format/formatNumber'
import { TopProtocolsWidget } from './TopProtocolsWidget'

export function TopProtocolsByTransfers({
  type,
}: {
  type?: InteropConfig['bridgeType']
}) {
  return (
    <TopProtocolsWidget
      metricType="transfers"
      heading="Last 24 hours transfers"
      type={type}
      formatValue={formatNumber}
    />
  )
}
