import { assert } from '@l2beat/shared-pure'

export type InteropPathData = {
  srcChain: string
  dstChain: string
  volume: number
}

export function getTopPaths(
  records: InteropPathData[],
  from: string[],
  to: string[],
): InteropPathData[] {
  const map = new Map<string, number>()

  for (const record of records) {
    if (!from.includes(record.srcChain) || !to.includes(record.dstChain)) {
      continue
    }
    const key = `${record.srcChain}::${record.dstChain}`
    map.set(key, (map.get(key) ?? 0) + record.volume)
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
