import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../common'
import { Layer2 } from './types'

const upgradeDelay = 604800

export const hermez: Layer2 = {
  type: 'layer2',
  id: ProjectId('hermez'),
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
      },
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(),
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_ZK,
    // NOTE: I have no clue what token are fees paid in. There are fees but
    // the explorer shows them in USD and there is no documentation around it
    destinationToken: RISK_VIEW.CANONICAL,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
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
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN,
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
      {
        name: 'HermezAuctionProtocol',
        address: EthereumAddress('0x15468b45eD46C8383F5c0b1b6Cf2EcF403C2AeC2'),
        upgradeability: {
          type: 'EIP1967 proxy',
          implementation: EthereumAddress(
            '0x9D62Cdc389caaB35ada830A7C6Ae847D5E8512C6',
          ),
          admin: EthereumAddress('0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3'),
        },
      },
      {
        name: 'Hermez',
        address: EthereumAddress('0xA68D85dF56E733A06443306A095646317B5Fa633'),
        upgradeability: {
          type: 'EIP1967 proxy',
          implementation: EthereumAddress(
            '0x6D85D79D69b7e190E671C16e8611997152bD3e95',
          ),
          admin: EthereumAddress('0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3'),
        },
      },
      {
        name: 'ProxyAdmin',
        address: EthereumAddress('0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3'),
        description:
          'Admin of HermezAuctionProtocol and Hermez, owned by the timelock.',
      },
      {
        name: 'WithdrawalDelayer',
        address: EthereumAddress('0x392361427Ef5e17b69cFDd1294F31ab555c86124'),
      },
      {
        name: 'Timelock',
        address: EthereumAddress('0xf7b20368Fe3Da5CD40EA43d61F52B23145544Ec3'),
        description: 'Enforces a 7 day delay on upgrades.',
      },
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('7 days')],
  },
}
