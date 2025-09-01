import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const silentData: ScalingProject = underReviewL2({
  id: 'silentdata',
  capability: 'universal',
  addedAt: UnixTime(1753945535),
  badges: [BADGES.DA.CustomDA, BADGES.Stack.OPStack, BADGES.VM.EVM],
  display: {
    name: 'Silent Data',
    slug: 'silentdata',
    description:
      'Silent Data is an OP Stack L2 combining programmable privacy with lightning-fast throughput, built for institutional scale and web3 innovation.',
    purposes: ['Privacy'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://silentdata.com'],
      explorers: ['https://explorer-mainnet.rollup.silentdata.com/'],
      bridges: ['https://bridge-mainnet.rollup.silentdata.com/'],
      documentation: ['https://docs.silentdata.com/'],
      socialMedia: [
        'https://linkedin.com/company/69477792',
        'https://twitter.com/SilentDataApp',
        'https://podcasts.apple.com/podcast/applied-blockchain-podcast/id1653098459',
      ],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
  dataAvailability: undefined,
  // no activity config due to no DA / rpc
  escrows: [
    {
      address: EthereumAddress('0xCcd285b1ccf1cdaB36Da995B9fC68870E287694E'), // optiPortal
      sinceTimestamp: UnixTime(1753442903),
      tokens: ['ETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xe97d73B0079e04f4ea4162b9173604a6213eF158'), // l1standardBridge
      sinceTimestamp: UnixTime(1753442903),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
})
