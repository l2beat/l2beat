import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS, DA_LAYERS, DA_MODES, RISK_VIEW } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'

const discovery = new ProjectDiscovery('shibarium')

export const shibarium: ScalingProject = {
  id: ProjectId('shibarium'),
  type: 'layer2',
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
      discovery.getEscrowDetails({
        address: EthereumAddress('0x885fcE983b6a01633f764325B8c3c5D31032C995'), // DepositManager
        tokens: ['BONE'],
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
    bridge: {
      value: 'Unknown',
      sentiment: 'bad',
      description:
        'Since the bridge is not verified, the specifics of the DA bridge are unknown.',
    },
    mode: DA_MODES.TRANSACTION_DATA,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL, // StakeManager is unverified
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_ENQUEUE_VIA('L1'),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW, // StakeManager is unverified
  },
  technology: {
    stateCorrectness: {
      name: 'No state validation',
      description:
        'As a fork of Polygon PoS, state updates are supposed to be settled if signed by at least 2/3+1 of the Shibarium validators stake, without checking whether the state transition is valid. Since some contracts are not verified, it is not possible to verify the exact mechanism.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'validators on Shibarium decide to not mint tokens after observing an event on Ethereum.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators decide to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators submit a fraudulent checkpoint allowing themselves to withdraw all locked funds.',
        },
      ],
    },
  },
  contracts: {
    addresses: {
      [discovery.chain]: discovery.getDiscoveredContracts(),
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    [discovery.chain]: discovery.getDiscoveredPermissions(),
  },
}
