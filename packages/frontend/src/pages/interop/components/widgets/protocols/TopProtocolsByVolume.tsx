import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { TopProtocolsWidget } from './TopProtocolsWidget'

export function TopProtocolsByVolume({
  topProtocols,
  isLoading,
}: {
  topProtocols: InteropDashboardData['topProtocols'] | undefined
  isLoading: boolean
}) {
  return (
    <TopProtocolsWidget
      metricType="volume"
      heading="Last 24 hours volume"
      topProtocols={topProtocols}
      isLoading={isLoading}
      formatValue={(value) =>
        formatCurrency(value, 'usd', {
          decimals: 1,
        })
      }
    />
  )
}
