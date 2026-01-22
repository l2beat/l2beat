import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { formatNumber } from '~/utils/number-format/formatNumber'
import { TopProtocolsWidget } from './TopProtocolsWidget'

export function TopProtocolsByTransfers({
  topProtocols,
  isLoading,
}: {
  topProtocols: InteropDashboardData['topProtocols'] | undefined
  isLoading: boolean
}) {
  return (
    <TopProtocolsWidget
      metricType="transfers"
      heading="Last 24 hours transfers"
      topProtocols={topProtocols}
      isLoading={isLoading}
      formatValue={formatNumber}
    />
  )
}
