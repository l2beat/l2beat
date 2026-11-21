import type { InteropBridgeType } from './InteropBridgeType.js'

export interface InteropLane {
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
}

export function interopLaneKey(lane: InteropLane): string {
  return `${lane.id}|${lane.bridgeType}|${lane.srcChain}|${lane.dstChain}`
}
