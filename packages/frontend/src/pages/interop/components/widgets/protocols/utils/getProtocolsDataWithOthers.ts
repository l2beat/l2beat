import type { InteropProtocolData } from '~/server/features/scaling/interop/utils/getTopProtocols'
import type { DisplayProtocol } from '../TopProtocolsWidget'
import { OTHERS_PROTOCOL_NAME } from '../useProtocolColorMap'

export function getProtocolsDataWithOthers(
  topProtocolsData: InteropProtocolData[] | undefined,
  protocolColorMap: Map<string, string>,
  metricType: 'volume' | 'transfers',
): DisplayProtocol[] {
  if (!topProtocolsData) return []

  topProtocolsData.sort((a, b) => b[metricType].value - a[metricType].value)

  const top5 = topProtocolsData.slice(0, 5).map((protocol) => ({
    ...protocol,
    color: protocolColorMap.get(protocol.name) ?? '#000000',
  }))

  const others = topProtocolsData.slice(5)
  if (others.length === 0) {
    return top5
  }

  const totalValue = topProtocolsData.reduce(
    (sum, p) => sum + p[metricType].value,
    0,
  )
  const othersValue = others.reduce((sum, p) => sum + p[metricType].value, 0)
  const othersShare = totalValue > 0 ? (othersValue / totalValue) * 100 : 0

  return [
    ...top5,
    {
      name: OTHERS_PROTOCOL_NAME,
      volume: {
        value: metricType === 'volume' ? othersValue : 0,
        share: metricType === 'volume' ? othersShare : 0,
      },
      transfers: {
        value: metricType === 'transfers' ? othersValue : 0,
        share: metricType === 'transfers' ? othersShare : 0,
      },
      othersCount: others.length,
      color: protocolColorMap.get(OTHERS_PROTOCOL_NAME) ?? '#000000',
    },
  ]
}
