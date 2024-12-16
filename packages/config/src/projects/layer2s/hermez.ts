import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Layer2 } from './types'

const upgradeDelay = 604800
const discovery = new ProjectDiscovery('hermez')

export const hermez: Layer2 = {
  type: 'layer2',
  id: ProjectId('hermez'),
  createdAt: new UnixTime(1623153328), // 2021-06-08T11:55:28Z
  isArchived: true,
  display: {
    name: 'Polygon Hermez',
    slug: 'hermez',
    warning:
      'Hermez and Polygon have recently merged. Hermez and Polygon Hermez are two names for the same rollup.',
    description:
      'Hermez is an open-source ZK Rollup that aims to be optimized for secure, low-cost and usable token transfers on the wings of Ethereum.',
    purposes: ['Payments'],
    category: 'ZK Rollup',
    // TODO: This is not correct. Research it.

    provider: 'Polygon',
    links: {
      websites: ['https://hermez.io/'],
      apps: ['https://wallet.hermez.io/'],
      documentation: [
        'https://docs.hermez.io/',
        'https://hermez.io/polygon-hermez-whitepaper.pdf',
      ],
      explorers: ['https://explorer.hermez.io/'],
      repositories: ['https://github.com/0xpolygonhermez'],
      socialMedia: [
        'https://blog.hermez.io/',
        'https://t.me/PolygonHermez',
        'https://discord.gg/AczuUXDA2N',
        'https://twitter.com/0xPolygonZK',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0xA68D85dF56E733A06443306A095646317B5Fa633'),
        sinceTimestamp: new UnixTime(1616482490),
        tokens: '*',
        chain: 'ethereum',
      },
    ],
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(),
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_ZK,
  },
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'ZK proofs - Hermez documentation',
          href: 'https://docs.hermez.io/#/about/security?id=zk-proofs',
        },
      ],
    },
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: 'ZK proofs - Hermez documentation',
          href: 'https://docs.hermez.io/#/about/security?id=zk-proofs',
        },
        {
          text: 'Multi-party Computation for the Trusted Setup - Hermez documentation',
          href: 'https://docs.hermez.io/#/about/security?id=multi-party-computation-for-the-trusted-setup',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA,
      references: [
        {
          text: 'Data Availability - Hermez documentation',
          href: 'https://docs.hermez.io/#/developers/glossary?id=data-availability',
        },
      ],
    },
    operator: {
      ...OPERATOR.DECENTRALIZED_OPERATOR,
      description:
        'The system runs an auction in which anyone can bid to become the operator for a set number of blocks. The operator will be able to propose blocks and collect fees during this window. Hermez will also run a operator known as boot coordinator that will propose blocks in case no one bids in the auction. This operator can be removed by the governance.',
      references: [
        {
          text: 'Forging Consensus Protocol - Hermez documentation',
          href: 'https://docs.hermez.io/#/developers/protocol/consensus/consensus?id=forging-consensus-protocol',
        },
        {
          text: 'Boot Coordinator - Hermez documentation',
          href: 'https://docs.hermez.io/#/developers/protocol/consensus/consensus?id=boot-coordinator',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS,
      references: [
        {
          text: 'Can coordinators censor transactions? - Hermez documentation',
          href: 'https://docs.hermez.io/#/faq/end-users?id=can-coordinators-censor-transactions',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'merkle proof'),
        description:
          EXITS.REGULAR('zk', 'merkle proof').description +
          ' This operation cannot be performed if the withdrawal exceeds certain threshold.',
        risks: [],
        references: [
          {
            text: 'Withdrawing Funds from Hermez - Hermez documentation',
            href: 'https://docs.hermez.io/#/developers/sdk?id=withdrawing-funds-from-hermez',
          },
        ],
      },
      {
        name: 'Forced withdraw',
        description:
          'The user submits the withdrawal request on L1. This forces the operators to pick up the request before other L2 transactions. A block still needs to be proved, the user still submits a merkle proof, and the funds threshold still cannot be exceeded.',
        risks: [],
        references: [
          {
            text: 'Force Exit - Hermez documentation',
            href: 'https://docs.hermez.io/#/developers/sdk?id=force-exit',
          },
        ],
      },
      {
        name: 'Delayed withdraw',
        description:
          'When the user does a regular or forced withdraw and their funds exceed a certain threshold a timer activates. After a specified time has passed and the emergency mode has not been activated the funds can be withdrawn.',
        risks: [],
        references: [
          {
            text: 'Withdrawal Delayer Mechanism - Hermez documentation',
            href: 'https://docs.hermez.io/#/developers/protocol/withdrawal-delayer/withdrawal-delayer?id=mechanism',
          },
        ],
      },
      {
        name: 'Emergency mode',
        description:
          "When the user does a regular or forced withdraw and their funds exceed a certain threshold a timer activates. The operators can now trigger emergency mode and transfer the user's funds to the governance.",
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'the operators trigger a false alarm during withdrawal.',
            isCritical: true,
          },
        ],
        references: [
          {
            text: 'Withdrawal Delayer Mechanism - Hermez documentation',
            href: 'https://docs.hermez.io/#/developers/protocol/withdrawal-delayer/withdrawal-delayer?id=mechanism',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('HermezAuctionProtocol'),
      discovery.getContractDetails('Hermez'),
      discovery.getContractDetails(
        'ProxyAdmin',
        'Admin of HermezAuctionProtocol and Hermez, owned by the timelock.',
      ),
      discovery.getContractDetails('WithdrawalDelayer'),
      discovery.getContractDetails(
        'Timelock',
        'Enforces a 7 day delay on upgrades.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('7 days')],
  },
}
