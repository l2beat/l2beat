export interface DataAvailabilityConfig {
  layers: DataAvailabilityLayer[]
  bridge: DataAvailabilityBridge
  mode: DataAvailabilityMode
}

export const DataAvailabilityMode = {
  StateDiffs: 'StateDiffs',
  CompressedStateDiffs: 'CompressedStateDiffs',
  TransactionsData: 'TransactionsData',
  CompressedTransactionData: 'CompressedTransactionsData',
} as const

export type DataAvailabilityMode =
  (typeof DataAvailabilityMode)[keyof typeof DataAvailabilityMode]

export const DataAvailabilityLayer = {
  EthereumCalldata: 'EthereumCalldata',
  EthereumBlobs: 'EthereumBlobs',
  EthereumBlobsOrCalldata: 'EthereumBlobsOrCalldata',
  MEMO: 'MEMO',
  DAC: 'DAC',
  Celestia: 'Celestia',
  External: 'External',
  MantleDA: 'MantleDA',
  FraxtalDA: 'FraxtalDA',
  RedstoneDA: 'RedstoneDA',
  EigenDA: 'EigenDA',
  NearDA: 'NearDA',
} as const

export type DataAvailabilityLayer =
  (typeof DataAvailabilityLayer)[keyof typeof DataAvailabilityLayer]

export const DataAvailabilityBridgeType = {
  None: 'None',
  NoneAndDAChallenges: 'NoneAndDAChallenges',
  Enshrined: 'Enshrined',
  Optimistic: 'Optimistic',
  DACMembers: 'DACMembers',
  StakedOperators: 'StakedOperators',
} as const

export type DataAvailabilityBridgeType =
  (typeof DataAvailabilityBridgeType)[keyof typeof DataAvailabilityBridgeType]

export type DataAvailabilityBridge =
  | { type: typeof DataAvailabilityBridgeType.None }
  | { type: typeof DataAvailabilityBridgeType.NoneAndDAChallenges }
  | { type: typeof DataAvailabilityBridgeType.Enshrined }
  | { type: typeof DataAvailabilityBridgeType.Optimistic }
  | {
      type: typeof DataAvailabilityBridgeType.DACMembers
      requiredSignatures?: number
      membersCount?: number
    }
  | {
      type: typeof DataAvailabilityBridgeType.StakedOperators
      requiredSignatures: number
      membersCount: number
    }
