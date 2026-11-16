import { formatCurrency } from '@l2beat/shared-pure'
import type { InteropDashboardData } from '~/server/features/layer2s/interop/getInteropDashboardData'
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
      heading="Volume by protocol"
      topProtocols={topProtocols}
      isLoading={isLoading}
      formatValue={(value) => formatCurrency(value, 'usd')}
    />
  )
}
