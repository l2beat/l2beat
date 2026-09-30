import type { ByBridgeTypeData } from '~/server/features/layer2s/interop/types'
import type { TransferTypeDataPoint } from '~/server/features/layer2s/interop/utils/getTransferSizeChartData'

/** The volumes the transfer type distribution shows, for the bridge types the protocol has. */
export function getBridgeTypeVolumes(
  byBridgeType: ByBridgeTypeData | undefined,
): TransferTypeDataPoint {
  const volumes: TransferTypeDataPoint = {}
  for (const [type, stats] of Object.entries(byBridgeType ?? {})) {
    if (stats) {
      volumes[type as keyof ByBridgeTypeData] = stats.volume
    }
  }
  return volumes
}
