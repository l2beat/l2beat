import type { InteropConfig } from '@l2beat/config'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { TopProtocolsWidget } from './TopProtocolsWidget'

export function TopProtocolsByVolume({
  type,
}: {
  type?: InteropConfig['bridgeType']
}) {
  return (
    <TopProtocolsWidget
      metricType="volume"
      heading="Last 24 hours volume"
      type={type}
      formatValue={(value) =>
        formatCurrency(value, 'usd', {
          decimals: 1,
        })
      }
    />
  )
}
