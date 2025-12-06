import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { agglayer } from '../../templates/agglayer'

const discovery = new ProjectDiscovery('ternoa')
const bridge = discovery.getContract('AgglayerBridge')

export const ternoa: ScalingProject = agglayer({
  addedAt: UnixTime(1727455020), // 2024-09-27T17:09:00Z
  additionalBadges: [BADGES.DA.DAC, BADGES.RaaS.Zeeve],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  additionalPurposes: ['Payments'],
  display: {
    name: 'Ternoa',
    slug: 'ternoa',
    description:
      'Ternoa is a modular Validium leveraging the Polygon CDK stack. It is built by the team behind the Substrate-based Ternoa Layer 1 and focuses on PayFi.',
    links: {
      websites: ['https://ternoa.network/'],
      bridges: ['https://portal.polygon.technology/bridge'],
      explorers: ['https://explorer-mainnet.zkevm.ternoa.network/'],
      documentation: ['https://docs.ternoa.network/learn/ternoa-zkevm+'],
      repositories: ['https://github.com/capsule-corp-ternoa'],
      socialMedia: [
        'https://x.com/ternoa_',
        'https://t.me/ternoa',
        'https://medium.com/ternoa',
        'https://discord.com/invite/cNZTGtGJNR',
        'https://linkedin.com/company/ternoa/mycompany/',
        'https://youtube.com/channel/UCUYvbtRE5HoWPz7z88V7Khw',
      ],
    },
  },
  discovery,
  chainConfig: {
    name: 'ternoa',
    chainId: 752025,
    explorerUrl: 'https://explorer-mainnet.zkevm.ternoa.network',
    sinceTimestamp: UnixTime(1735650935),
    gasTokens: ['CAPS'],
    apis: [
      {
        type: 'rpc',
        // successfully tested at 5k/min
        url: 'https://rpc-mainnet.zkevm.ternoa.network',
        callsPerMinute: 300,
      },
    ],
  },
  associatedTokens: ['CAPS'],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherWrapped',
        wethAddress: EthereumAddress(
          '0x5A77f1443D16ee5761d310e38b62f77f726bC71c',
        ),
        tokensToAssignFromL1: ['CAPS'],
      },
    }),
  ],
  milestones: [
    {
      title: 'Ternoa Mainnet Launch',
      url: 'https://x.com/Ternoa_/status/1884519126812487828',
      date: '2025-01-29',
      description: 'Ternoa is live on mainnet, integrated with Agglayer.',
      type: 'general',
    },
  ],
})
