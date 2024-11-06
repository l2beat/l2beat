export interface DataAvailabilityConfig {
  layers: DataAvailabilityLayer[]
  bridge: DataAvailabilityBridge
  mode: DataAvailabilityMode
}

export const DA_MODES = {
  STATE_DIFFS: {
    value: 'State diffs',
    secondLine: undefined,
  },
  STATE_DIFFS_COMPRESSED: {
    value: 'State diffs',
    secondLine: 'Compressed',
  },
  TRANSACTION_DATA: {
    value: 'Transaction data',
    secondLine: undefined,
  },
  TRANSACTION_DATA_COMPRESSED: {
    value: 'Transaction data',
    secondLine: 'Compressed',
  },
} as const

export type DataAvailabilityMode = (typeof DA_MODES)[keyof typeof DA_MODES]

export type DataAvailabilityLayer =
  | 'Ethereum (calldata)'
  | 'Ethereum (blobs)'
  | 'Ethereum (blobs or calldata)'
  | 'MEMO'
  | 'DAC'
  | 'Celestia'
  | 'External'
  | 'Mantle DA'
  | 'FraxtalDA'
  | 'RedstoneDA'
  | 'XterioDA'
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
