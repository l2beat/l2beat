import type { InteropBridgeType } from './InteropBridgeType.js'

/** Every interop aggregate is keyed by a lane: a project's bridge type between two chains. */
export interface InteropLane {
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
}

/** Deterministic lane identity; must not include magnitudes or timestamps. */
export function interopLaneKey(lane: InteropLane): string {
  return `${lane.id}|${lane.bridgeType}|${lane.srcChain}|${lane.dstChain}`
}
