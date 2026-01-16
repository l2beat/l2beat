import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { TopProtocolsWidget } from './TopProtocolsWidget'

export function TopProtocolsByVolume() {
  return (
    <TopProtocolsWidget
      metricType="volume"
      heading="Last 24 hours volume"
      formatValue={(value) =>
        formatCurrency(value, 'usd', {
          decimals: 1,
        })
      }
    />
  )
}
