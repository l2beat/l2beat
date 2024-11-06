import { ValueWithSentiment } from '@l2beat/shared-pure'

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
} as const satisfies Record<
  string,
  { value: string; secondLine: string | undefined }
>

export type DataAvailabilityMode = (typeof DA_MODES)[keyof typeof DA_MODES]

export const DA_LAYERS = {
  ETH_CALLDATA: {
    value: 'Ethereum',
    secondLine: 'Calldata',
    sentiment: 'good',
    description: 'The data is posted to Ethereum as calldata.',
    fallbackDescription:
      'In case posting is not possible for some reason, there is a fallback mechanism to Ethereum.',
  },
  ETH_BLOBS: {
    value: 'Ethereum',
    secondLine: 'Blobs',
    sentiment: 'good',
    description: 'The data is posted to Ethereum as blobs.',
    fallbackDescription:
      'In case posting is not possible for some reason, there is a fallback mechanism to Ethereum.',
  },
  ETH_BLOBS_OR_CALLLDATA: {
    value: 'Ethereum',
    secondLine: 'Blobs or Calldata',
    sentiment: 'good',
    description: 'The data is posted to Ethereum as calldata or blobs.',
    fallbackDescription:
      'In case posting is not possible for some reason, there is a fallback mechanism to Ethereum.',
  },
  MEMO: {
    value: 'MEMO',
    sentiment: 'warning',
    description: 'The data is posted to MEMO (a decentralized storage).',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  DAC: {
    value: 'DAC',
    sentiment: 'warning',
    description:
      'The data is posted off chain and a Data Availability Committee (DAC) is responsible for protecting and supplying it.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  CELESTIA: {
    value: 'Celestia',
    sentiment: 'warning',
    description: 'The data is posted to Celestia.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  EXTERNAL: {
    value: 'External',
    sentiment: 'warning',
    description: 'The data is posted off chain.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  MANTLE_DA: {
    value: 'Mantle DA',
    sentiment: 'warning',
    description:
      'The data is posted to Mantle DA (contracts are forked from EigenDA with significant modifications, most importantly removal of slashing conditions).',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  FRAXTAL_DA: {
    value: 'FraxtalDA',
    sentiment: 'warning',
    description:
      'The data is posted to FraxtalDA which is a separate data availability module developed by the Frax Core Team. Data is posted off chain, and only hashes of blob data are published on an on chain inbox.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  REDSTONE_DA: {
    value: 'RedstoneDA',
    sentiment: 'warning',
    description:
      'The data is posted to RedstoneDA which is a separate data availability module developed by the Redstone team. Data is posted off chain, and only hashes of data are published on an on chain inbox.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  XTERIO_DA: {
    value: 'XterioDA',
    sentiment: 'warning',
    description:
      'The data is posted to XterioDA which is a separate data availability module developed by the Xterio team. Data is posted off chain, and only hashes of data are published on an on chain inbox.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  EIGEN_DA: {
    value: 'EigenDA',
    sentiment: 'warning',
    description:
      'The data is posted to EigenDA which is a separate data availability layer developed by the Eigenlayer team. Only hashes of data are published on an on chain inbox.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
  NEAR_DA: {
    value: 'NearDA',
    sentiment: 'warning',
    description:
      'The data is posted to NearDA which is a separate data availability layer on the Near protocol. Only hashes of data are published on an on chain inbox.',
    fallbackDescription: undefined,
    secondLine: undefined,
  },
} as const satisfies Record<
  string,
  ValueWithSentiment<string> & {
    secondLine: string | undefined
    description: string
    fallbackDescription: string | undefined
  }
>

export type DataAvailabilityLayer = (typeof DA_LAYERS)[keyof typeof DA_LAYERS]

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
