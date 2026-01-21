import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { formatNumber } from '~/utils/number-format/formatNumber'
import { TopProtocolsWidget } from './TopProtocolsWidget'

export function TopProtocolsByTransfers({
  data,
  isLoading,
}: {
  data: InteropDashboardData | undefined
  isLoading: boolean
}) {
  return (
    <TopProtocolsWidget
      metricType="transfers"
      heading="Last 24 hours transfers"
      data={data}
      isLoading={isLoading}
      formatValue={formatNumber}
    />
  )
}
