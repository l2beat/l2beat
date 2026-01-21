import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { TopProtocolsWidget } from './TopProtocolsWidget'

export function TopProtocolsByVolume({
  data,
  isLoading,
}: {
  data: InteropDashboardData | undefined
  isLoading: boolean
}) {
  return (
    <TopProtocolsWidget
      metricType="volume"
      heading="Last 24 hours volume"
      data={data}
      isLoading={isLoading}
      formatValue={(value) =>
        formatCurrency(value, 'usd', {
          decimals: 1,
        })
      }
    />
  )
}
