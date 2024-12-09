type ScalingProviderBase = 'OP Stack' | 'Arbitrum'

export type Layer2Provider =
  | ScalingProviderBase
  | 'StarkEx'
  | 'ZKsync Lite'
  | 'ZK Stack'
  | 'Loopring'
  | 'Polygon'
  | 'OVM'
  | 'Starknet'
  | 'Taiko'
  | 'Cartesi Rollups'

export type Layer3Provider =
  | ScalingProviderBase
  | 'Cartesi Rollups'
  | 'Taiko'
  | 'ZK Stack'
