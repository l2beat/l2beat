import type { InteropFlowData } from './getFlows'

export type InteropTopPathData = {
  chainA: string
  chainB: string
  volume: number
}

export function getTopPath(
  flows: InteropFlowData[] | undefined,
): InteropTopPathData | undefined {
  const paths = new Map<string, InteropTopPathData>()

  for (const flow of flows ?? []) {
    if (flow.volume === 0) continue

    const [firstChain, secondChain] = [flow.srcChain, flow.dstChain].toSorted()
    const key = `${firstChain}-${secondChain}`
    const current = paths.get(key)

    paths.set(key, {
      chainA: current?.chainA ?? flow.srcChain,
      chainB: current?.chainB ?? flow.dstChain,
      volume: (current?.volume ?? 0) + flow.volume,
    })
  }

  return Array.from(paths.values()).toSorted((a, b) => b.volume - a.volume)[0]
}
