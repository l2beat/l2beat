import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { agglayer } from '../../templates/agglayer'

const discovery = new ProjectDiscovery('penchain')
const bridge = discovery.getContract('AgglayerBridge')

export const penchain: ScalingProject = agglayer({
  addedAt: UnixTime(1740706975),
  additionalPurposes: ['Gaming'],
  additionalBadges: [BADGES.RaaS.Zeeve],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  display: {
    name: 'Pentagon Chain',
    slug: 'penchain',
    description:
      'Pentagon Chain is a zkEVM blockchain powered by Agglayer and secured by Ethereum. It is dedicated to mainstream adoption of Web3 gaming, DeFi, and SocialFi.',
    links: {
      websites: ['https://pentagon.games/pentagon-chain'],
      bridges: ['https://bridge.pentagon.games'],
      explorers: ['https://explorer.pentagon.games'],
      socialMedia: [
        'https://x.com/pentagonchain',
        'https://discord.gg/pentagongamesXP',
        'https://youtube.com/@PentagonGamesXP',
        'https://linkedin.com/company/pentagongames',
        'https://x.com/pentagongamesxp',
        'https://t.me/PentagonGamesXP',
      ],
    },
  },
  discovery,
  chainConfig: {
    name: 'penchain',
    chainId: 3344,
    gasTokens: ['PC'],
    explorerUrl: 'https://explorer.pentagon.games',
    sinceTimestamp: UnixTime(1740743363),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.pentagon.games',
        callsPerMinute: 3000,
      },
    ],
  },
  associatedTokens: ['PC'],
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
        tokensToAssignFromL1: ['PC'],
      },
    }),
  ],
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/PentagonChain/status/1942909180932718920', // TODO: almost
      date: '2025-07-09',
      description: 'Pentagon Chain mainnet is live.',
      type: 'general',
    },
  ],
})
