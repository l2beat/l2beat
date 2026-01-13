export type InteropProtocolData = {
  protocolId: string
  volume: number
  share: number
}

export function getTopProtocols(
  records: {
    id: string
    srcChain: string
    dstChain: string
    srcValueUsd: number | null
    dstValueUsd: number | null
  }[],
  from: string[],
  to: string[],
): InteropProtocolData[] {
  const map = new Map<string, number>()

  for (const record of records) {
    if (!from.includes(record.srcChain) || !to.includes(record.dstChain)) {
      continue
    }
    const currentVolume = map.get(record.id) ?? 0
    map.set(
      record.id,
      currentVolume + (record.srcValueUsd ?? record.dstValueUsd ?? 0),
    )
  }

  const totalVolume = Array.from(map.values()).reduce((a, b) => a + b, 0)

  if (totalVolume === 0) return []

  return Array.from(map.entries())
    .toSorted((a, b) => b[1] - a[1])
    .map(([key, volume]): InteropProtocolData => {
      return { protocolId: key, volume, share: (volume / totalVolume) * 100 }
    })
}
