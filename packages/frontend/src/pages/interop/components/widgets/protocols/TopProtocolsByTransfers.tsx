import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { formatInteger } from '~/utils/number-format/formatInteger'
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
      formatValue={formatInteger}
    />
  )
}
