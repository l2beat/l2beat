import { ProjectId } from '@l2beat/shared-pure'
import type { DaProjectTableValue } from './dataAvailability'

const ETH_CALLDATA: DaProjectTableValue = {
  value: 'Ethereum',
  secondLine: 'Calldata',
  sentiment: 'good',
  description: 'The data is posted to Ethereum as calldata.',
  projectId: ProjectId('ethereum'),
}

const ETH_BLOBS: DaProjectTableValue = {
  value: 'Ethereum',
  secondLine: 'Blobs',
  sentiment: 'good',
  description: 'The data is posted to Ethereum as blobs.',
  projectId: ProjectId('ethereum'),
}

const ETH_BLOBS_OR_CALLDATA: DaProjectTableValue = {
  value: 'Ethereum',
  secondLine: 'Blobs or Calldata',
  sentiment: 'good',
  description: 'The data is posted to Ethereum as calldata or blobs.',
  projectId: ProjectId('ethereum'),
}

const MEMO: DaProjectTableValue = {
  value: 'MEMO',
  sentiment: 'warning',
  description: 'The data is posted to MEMO (a decentralized storage).',
  projectId: ProjectId('memo'),
}

const DAC: DaProjectTableValue = {
  value: 'DAC',
  sentiment: 'warning',
  description:
    'The data is posted off chain and a Data Availability Committee (DAC) is responsible for protecting and supplying it.',
}

const CELESTIA: DaProjectTableValue = {
  value: 'Celestia',
  sentiment: 'warning',
  description: 'The data is posted to Celestia.',
  projectId: ProjectId('celestia'),
}

const AVAIL: DaProjectTableValue = {
  value: 'Avail',
  sentiment: 'warning',
  description: 'The data is posted to Avail.',
  projectId: ProjectId('avail'),
}

const NONE: DaProjectTableValue = {
  value: 'None',
  sentiment: 'bad',
  description: 'The data is not posted to any data availability layer.',
}

const MANTLE_DA: DaProjectTableValue = {
  value: 'Mantle DA',
  sentiment: 'warning',
  description:
    'The data is posted to Mantle DA (contracts are forked from EigenDA with significant modifications, most importantly removal of slashing conditions).',
}

const FRAXTAL_DA: DaProjectTableValue = {
  value: 'FraxtalDA',
  sentiment: 'warning',
  description:
    'The data is posted to FraxtalDA which is a separate data availability module developed by the Frax Core Team. Data is posted off chain, and only hashes of blob data are published on an onchain inbox.',
}

const OP_ALT_DA: DaProjectTableValue = {
  value: 'Alt-DA',
  sentiment: 'warning',
  description:
    'The data is posted to an off-chain data availability provider which is tasked to serve data upon request. Only hashes of the data are published on an onchain inbox.',
}

const EIGEN_DA: DaProjectTableValue = {
  value: 'EigenDA',
  sentiment: 'warning',
  description:
    'The data is posted to EigenDA which is a separate data availability layer developed by the Eigenlayer team. Only hashes of data are published on an onchain inbox.',
  projectId: ProjectId('eigenda'),
}

const NEAR_DA: DaProjectTableValue = {
  value: 'NearDA',
  sentiment: 'warning',
  description:
    'The data is posted to NearDA which is a separate data availability layer on the Near protocol. Only hashes of data are published on an onchain inbox.',
  projectId: ProjectId('near-da'),
}

const POLYGON_POS_DA: DaProjectTableValue = {
  value: 'Polygon PoS DA',
  sentiment: 'warning',
  description:
    'The data is guaranteed to be available by Polygon proof of stake validators. On Ethereum, the data is indirectly referenced in the signed block header.',
}

const HYPERLIQUID_DA: DaProjectTableValue = {
  value: 'Hyperliquid DA',
  sentiment: 'bad',
  description:
    'The data is custodied by Hyperliquid validators. On Arbitrum there is no direct reference of the data.',
}

const SELF_CUSTODIED_INTMAX: DaProjectTableValue = {
  value: 'Self Custodied',
  sentiment: 'good',
  description:
    "The data needed to prove users' own balance is stored by the users themselves. This data can be received from an aggregator when depositing or transferring funds, or from senders when receiving funds. The protocol ensures that for a deposit or transfer to be accepted by the protocol, the user must confirm the collection of data from the aggregator.",
}

const ESPRESSO: DaProjectTableValue = {
  value: 'Espresso',
  sentiment: 'warning',
  description: 'The data is posted to Espresso.',
  projectId: ProjectId('espresso'),
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
  SELF_CUSTODIED_INTMAX,
  ESPRESSO,
}
