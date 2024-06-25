export interface DataAvailabilityConfig {
  layers: DataAvailabilityLayer[]
  bridge: DataAvailabilityBridge
  mode: DataAvailabilityMode
}

export type DataAvailabilityMode =
  | 'State diffs'
  | 'State diffs (compressed)'
  | 'Transaction data'
  | 'Transaction data (compressed)'

export type DataAvailabilityLayer =
  | 'Ethereum (calldata)'
  | 'Ethereum (blobs)'
  | 'Ethereum (blobs or calldata)'
  | 'MEMO'
  | 'DAC'
  | 'Celestia'
  | 'External'
  | 'MantleDA'
  | 'FraxtalDA'
  | 'RedstoneDA'
  | 'EigenDA'
  | 'NearDA'

export type DataAvailabilityBridge =
  | { type: 'None' }
  | { type: 'None + DA challenges' }
  | { type: 'Enshrined' }
  | { type: 'Optimistic' }
  | { type: 'DAC Members'; requiredSignatures?: number; membersCount?: number }
  | {
      type: 'Staked Operators'
      requiredSignatures: number
      membersCount: number
    }
