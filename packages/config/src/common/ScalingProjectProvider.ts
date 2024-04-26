type ScalingProviderBase = 'OP Stack' | 'Arbitrum'

export type Layer2Provider =
  | ScalingProviderBase
  | 'StarkEx'
  | 'zkSync Lite'
  | 'ZK Stack'
  | 'Loopring'
  | 'Polygon'
  | 'OVM'
  | 'Starknet'

export type Layer3Provider =
  | ScalingProviderBase
  | 'Cartesi Rollups'
  | 'zkLink Nexus'
  | 'Taiko'
