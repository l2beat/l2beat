import { assert } from '@l2beat/shared-pure'

export type InteropPathData = {
  srcChain: string
  dstChain: string
  volume: number
}

export function getTopPaths(
  records: {
    srcChain: string
    dstChain: string
    srcValueUsd: number | null
    dstValueUsd: number | null
  }[],
  from: string[],
  to: string[],
): InteropPathData[] {
  const map = new Map<string, number>()

  for (const record of records) {
    if (!from.includes(record.srcChain) || !to.includes(record.dstChain)) {
      continue
    }
    const key = `${record.srcChain}::${record.dstChain}`
    const current = map.get(key) ?? 0
    map.set(key, current + (record.srcValueUsd ?? record.dstValueUsd ?? 0))
  }

  return Array.from(map.entries())
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, volume]): InteropPathData => {
      const [srcChain, dstChain] = key.split('::')
      assert(srcChain && dstChain)

      return { srcChain, dstChain, volume }
    })
}
