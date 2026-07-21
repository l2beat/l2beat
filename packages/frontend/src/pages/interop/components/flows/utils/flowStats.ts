import { UnixTime } from '@l2beat/shared-pure'

interface Flow {
  srcChain: string
  dstChain: string
  volume: number
  transferCount: number
}

export interface PairFlowStats {
  flowAtoB: Flow | undefined
  flowBtoA: Flow | undefined
  totalVolume: number
  totalTransfers: number
  avgTransferValue: number
  netFlowValue: number
  /** Chain the net flow points to. */
  netFlowChainId: string
  volumePerSecond: number
  topFlow: Flow | undefined
}

export function getPairFlowStats(
  flows: Flow[],
  chainIdA: string,
  chainIdB: string,
): PairFlowStats {
  const flowAtoB = flows.find(
    (f) => f.srcChain === chainIdA && f.dstChain === chainIdB,
  )
  const flowBtoA = flows.find(
    (f) => f.srcChain === chainIdB && f.dstChain === chainIdA,
  )

  const totalVolume = (flowAtoB?.volume ?? 0) + (flowBtoA?.volume ?? 0)
  const totalTransfers =
    (flowAtoB?.transferCount ?? 0) + (flowBtoA?.transferCount ?? 0)
  const avgTransferValue = totalTransfers > 0 ? totalVolume / totalTransfers : 0
  const netFlowValue = (flowAtoB?.volume ?? 0) - (flowBtoA?.volume ?? 0)
  const netFlowChainId = netFlowValue > 0 ? chainIdB : chainIdA
  const volumePerSecond = totalVolume / UnixTime.DAY
  const topFlow =
    flowAtoB && flowBtoA
      ? flowAtoB.volume >= flowBtoA.volume
        ? flowAtoB
        : flowBtoA
      : (flowAtoB ?? flowBtoA)

  return {
    flowAtoB,
    flowBtoA,
    totalVolume,
    totalTransfers,
    avgTransferValue,
    netFlowValue,
    netFlowChainId,
    volumePerSecond,
    topFlow,
  }
}

export function getChainFlowDerivedStats(chainData: {
  totalVolume: number
  transfersIn: number
  transfersOut: number
}) {
  const totalTransfers = chainData.transfersIn + chainData.transfersOut
  const avgTransferValue =
    totalTransfers > 0 ? chainData.totalVolume / totalTransfers : 0
  const volumePerSecond = chainData.totalVolume / UnixTime.DAY
  return { totalTransfers, avgTransferValue, volumePerSecond }
}
