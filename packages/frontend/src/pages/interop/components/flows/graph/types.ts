/**
 * The graph only needs these fields, so it can draw anything that flows
 * between nodes — interop volume between chains, data posted to a DA layer.
 * Interop's `InteropChainWithIcon` and `InteropFlowsData` satisfy them as is.
 */
export interface FlowsGraphNode {
  id: string
  name: string
  iconUrl: string
  color: string
}

export interface FlowsGraphFlow {
  srcChain: string
  dstChain: string
  /** Amount moved in 24h, in the unit the particle scale is expressed in */
  volume: number
}

export interface FlowsGraphNodeData {
  chainId: string
  totalVolume: number
  netFlow: number
}

export interface FlowsGraphData {
  flows: FlowsGraphFlow[]
  chainData: FlowsGraphNodeData[]
}

export interface FlowsGraphCaption {
  text: string
  tone: 'positive' | 'negative' | 'neutral'
}

export type GetFlowsGraphCaption = (
  node: FlowsGraphNodeData | undefined,
) => FlowsGraphCaption | undefined
