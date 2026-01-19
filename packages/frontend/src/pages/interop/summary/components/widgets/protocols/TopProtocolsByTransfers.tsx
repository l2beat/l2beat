import { formatNumber } from '~/utils/number-format/formatNumber'
import { TopProtocolsWidget } from './TopProtocolsWidget'

export function TopProtocolsByTransfers() {
  return (
    <TopProtocolsWidget
      metricType="transfers"
      heading="Last 24 hours transfers"
      formatValue={formatNumber}
    />
  )
}
