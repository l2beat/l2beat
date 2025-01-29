import type { DataAvailabilityLayer } from './dataAvailability'

const ETH_CALLDATA: DataAvailabilityLayer = {
  value: 'Ethereum',
  secondLine: 'Calldata',
  sentiment: 'good',
  description: 'The data is posted to Ethereum as calldata.',
  fallbackDescription:
    'In case posting is not possible for some reason, there is a fallback mechanism to Ethereum.',
}

const ETH_BLOBS: DataAvailabilityLayer = {
  value: 'Ethereum',
  secondLine: 'Blobs',
  sentiment: 'good',
  description: 'The data is posted to Ethereum as blobs.',
  fallbackDescription:
    'In case posting is not possible for some reason, there is a fallback mechanism to Ethereum.',
}

const ETH_BLOBS_OR_CALLDATA: DataAvailabilityLayer = {
  value: 'Ethereum',
  secondLine: 'Blobs or Calldata',
  sentiment: 'good',
  description: 'The data is posted to Ethereum as calldata or blobs.',
  fallbackDescription:
    'In case posting is not possible for some reason, there is a fallback mechanism to Ethereum.',
}

const MEMO: DataAvailabilityLayer = {
  value: 'MEMO',
  sentiment: 'warning',
  description: 'The data is posted to MEMO (a decentralized storage).',
}

const DAC: DataAvailabilityLayer = {
  value: 'DAC',
  sentiment: 'warning',
  description:
    'The data is posted off chain and a Data Availability Committee (DAC) is responsible for protecting and supplying it.',
}

const CELESTIA: DataAvailabilityLayer = {
  value: 'Celestia',
  sentiment: 'warning',
  description: 'The data is posted to Celestia.',
}

const AVAIL: DataAvailabilityLayer = {
  value: 'Avail',
  sentiment: 'warning',
  description: 'The data is posted to Avail.',
}

const NONE: DataAvailabilityLayer = {
  value: 'None',
  sentiment: 'bad',
  description: 'The data is not posted to any data availability layer.',
}

const MANTLE_DA: DataAvailabilityLayer = {
  value: 'Mantle DA',
  sentiment: 'warning',
  description:
    'The data is posted to Mantle DA (contracts are forked from EigenDA with significant modifications, most importantly removal of slashing conditions).',
}

const FRAXTAL_DA: DataAvailabilityLayer = {
  value: 'FraxtalDA',
  sentiment: 'warning',
  description:
    'The data is posted to FraxtalDA which is a separate data availability module developed by the Frax Core Team. Data is posted off chain, and only hashes of blob data are published on an onchain inbox.',
}

const OP_ALT_DA: DataAvailabilityLayer = {
  value: 'Alt-DA Provider',
  sentiment: 'warning',
  description:
    'The data is posted to an off-chain data availability provider which is tasked to serve data upon request. Only hashes of the data are published on an onchain inbox.',
}

const EIGEN_DA: DataAvailabilityLayer = {
  value: 'EigenDA',
  sentiment: 'warning',
  description:
    'The data is posted to EigenDA which is a separate data availability layer developed by the Eigenlayer team. Only hashes of data are published on an onchain inbox.',
}

const NEAR_DA: DataAvailabilityLayer = {
  value: 'NearDA',
  sentiment: 'warning',
  description:
    'The data is posted to NearDA which is a separate data availability layer on the Near protocol. Only hashes of data are published on an onchain inbox.',
}

const POLYGON_POS_DA: DataAvailabilityLayer = {
  value: 'Polygon PoS DA',
  sentiment: 'warning',
  description:
    'The data is guaranteed to be available by Polygon proof of stake validators. On Ethereum, the data is indirectly referenced in the signed block header.',
}

const HYPERLIQUID_DA: DataAvailabilityLayer = {
  value: 'Hyperliquid DA',
  sentiment: 'bad',
  description:
    'The data is custodied by Hyperliquid validators. On Arbitrum there is no direct reference of the data.',
}

export const DA_LAYERS = {
  ETH_CALLDATA,
  ETH_BLOBS,
  ETH_BLOBS_OR_CALLDATA,
  MEMO,
  DAC,
  CELESTIA,
  AVAIL,
  NONE,
  MANTLE_DA,
  FRAXTAL_DA,
  OP_ALT_DA,
  EIGEN_DA,
  NEAR_DA,
  POLYGON_POS_DA,
  HYPERLIQUID_DA,
}
