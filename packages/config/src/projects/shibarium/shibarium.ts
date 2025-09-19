import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import floor from 'lodash/floor'
import {
  CONTRACTS,
  DA_LAYERS,
  DA_MODES,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('shibarium')

const currentValidatorSetSize = discovery.getContractValue<number>(
  'StakeManager',
  'currentValidatorSetSize',
)

export const shibarium: ScalingProject = {
  id: ProjectId('shibarium'),
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  type: 'layer2',
  capability: 'universal',
  addedAt: UnixTime(1738081310), // 2025-01-28T16:21:50+00:00
  badges: [BADGES.VM.EVM, BADGES.DA.CustomDA],
  display: {
    name: 'Shibarium',
    slug: 'shibarium',
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    description:
      'Shibarium is an EVM-compatible, proof of stake sidechain for Ethereum. It is built by developers behind the Shiba Inu token ecosystem. The main bridge to Ethereum is currently validated by Shibarium validators and allows for asset as well as data movement between Shibarium and Ethereum.',
    purposes: ['Universal'],
    links: {
      websites: ['https://shibarium.shib.io/'],
      bridges: ['https://shibarium.shib.io/bridge'],
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
  proofSystem: undefined,
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    associatedTokens: ['SHIB', 'BONE', 'LEASH'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xc3897302aB4B42931cB4857050Fa60f53B775870',
        ), // etherpredicate
        tokens: ['ETH'],
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa',
        ), // erc20predicate
        tokens: '*',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x885fcE983b6a01633f764325B8c3c5D31032C995',
        ), // DepositManager
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
        callsPerMinute: 300,
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.DAC,
    bridge: {
      value: `${currentValidatorSetSize} validators`,
      sentiment: 'bad',
      description:
        'The bridge verifies that at least 2/3+1 of the whitelisted validators stake has signed off on the checkpoint. The StakeManager contract is the source of truth for the current validator set. The identity of the validators is not public, so it is not possible to verify the presence of sybils, or the number of different entities behind the validators. Since members are whitelisted, the validator set effectively acts as a permissioned DAC.',
    },
    mode: DA_MODES.TRANSACTION_DATA,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: {
      ...RISK_VIEW.DATA_EXTERNAL_DAC({
        membersCount: currentValidatorSetSize,
        requiredSignatures: floor((currentValidatorSetSize * 2) / 3) + 1,
      }),
      sentiment: 'bad', // because members are not public
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_ENQUEUE_VIA('L1'),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stateValidation: {
    categories: [
      {
        title: 'No state validation',
        description:
          'As a fork of Polygon PoS, state updates are settled if signed by at least 2/3+1 of the Shibarium validators stake, without checking whether the state transition is valid. The validator set is gated by a whitelist, which is not public.',
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
    ],
  },
  contracts: {
    addresses: discovery.getDiscoveredContracts(),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: discovery.getDiscoveredPermissions(),
  discoveryInfo: getDiscoveryInfo([discovery]),
  milestones: [
    {
      title: 'Shibarium bridge exploited',
      description:
        'Keys of 10/12 Shibarium validators compromised - malicious chain root state used to steal funds.',
      date: '2025-09-12T00:00:00.00Z',
      url: 'https://x.com/Shibtoken/status/1966845298774278444',
      type: 'incident',
    },
  ],
}
