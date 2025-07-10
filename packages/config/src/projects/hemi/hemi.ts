import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const chainId = 43111
const discovery = new ProjectDiscovery('hemi')
const genesisTimestamp = UnixTime(1725860711)

export const hemi: ScalingProject = opStackL2({
  addedAt: UnixTime(1727449740), // 2024-09-27T17:09:00Z,
  discovery,
  genesisTimestamp,
  additionalPurposes: ['Bitcoin DApps'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Hemi',
    slug: 'hemi',
    description:
      'Hemi is an OP Stack based L2 on Ethereum focusing on interoperability with the Bitcoin blockchain. In addition to the EVM, Hemi uses Hemi Virtual Machine (hVM), an EVM upgraded to have awareness of the Bitcoin state.',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://hemi.xyz'],
      bridges: ['https://app.hemi.xyz'],
      documentation: ['https://docs.hemi.xyz'],
      explorers: ['https://explorer.hemi.xyz'],
      repositories: ['https://github.com/hemilabs'],
      socialMedia: [
        'https://twitter.com/hemi_xyz',
        'https://discord.gg/hemixyz',
        'https://linkedin.com/company/hemi-labs',
        'https://youtube.com/@HemiLabs',
      ],
    },
  },
  chainConfig: {
    name: 'hemi',
    chainId,
    explorerUrl: 'https://explorer.hemi.xyz',
    sinceTimestamp: genesisTimestamp,
    gasTokens: ['ETH'],
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 0,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.hemi.network/rpc',
        callsPerMinute: 1000,
      },
      {
        type: 'blockscoutV2',
        url: 'https://explorer.hemi.xyz/api/v2',
      },
    ],
  },
  isNodeAvailable: true,
  associatedTokens: ['hemi'],
  nodeSourceLink: 'https://github.com/hemilabs/heminetwork/tree/main',
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOneSinceBlock', blockNumber: 1 },
  },
})
