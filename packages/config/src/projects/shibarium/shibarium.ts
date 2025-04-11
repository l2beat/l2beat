import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { DA_LAYERS, RISK_VIEW } from '../../common'

const discovery = new ProjectDiscovery('shibarium')

export const shibarium: ScalingProject = {
  id: ProjectId('shibarium'),
  capability: 'universal',
  addedAt: UnixTime(1738081310), // 2025-01-28T16:21:50+00:00
  badges: [BADGES.VM.EVM, BADGES.DA.CustomDA],
  display: {
    name: 'Shibarium',
    slug: 'shibarium',
    category: 'Other',
    description:
      'Shibarium is an EVM-compatible, proof of stake sidechain for Ethereum. It is built by developers behind the Shiba Inu token ecosystem. The main bridge to Ethereum is currently validated by Shibarium validators and allows for asset as well as data movement between Shibarium and Ethereum.',
    purposes: ['Universal'],
    links: {
      websites: ['https://shibarium.shib.io/'],
      apps: ['https://shibarium.shib.io/bridge'],
      documentation: [
        'https://docs.shib.io/docs/shibarium/welcome/welcome-overview',
      ],
      explorers: ['https://shibariumscan.io/'],
      repositories: ['https://github.com/shibaone'],
      socialMedia: [
        'https://x.com/ShibariumNet',
        'https://discord.com/invite/shibariumtech',
        'https://x.com/shibtoken',
        'https://blog.shib.io/',
        'https://t.me/ShibariumTechnologies',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    associatedTokens: ['SHIB', 'BONE', 'LEASH'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xc3897302aB4B42931cB4857050Fa60f53B775870'), // etherpredicate
        tokens: ['ETH'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa'), // erc20predicate
        tokens: '*',
      }),
    ],
  },
  chainConfig: {
    name: 'shibarium',
    chainId: 109,
    apis: [
      {
        type: 'rpc',
        url: 'https://www.shibrpc.com',
        callsPerMinute: 1500,
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.NONE, // StakeManager is unverified
    bridge: {},
    mode: {},
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL, // StakeManager is unverified
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_ENQUEUE_VIA('L1'),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW, // StakeManager is unverified
  },
}
