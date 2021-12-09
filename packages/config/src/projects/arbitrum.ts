import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { Project } from './types'

export const arbitrum: Project = {
  name: 'Arbitrum',
  slug: 'arbitrum',
  bridges: [
    {
      address: '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
      sinceBlock: 12525700,
      tokens: ['ETH'],
    },
    {
      address: '0xcEe284F754E854890e311e3280b767F80797180d',
      sinceBlock: 12647126,
      tokens: ['LAND', 'MCB', 'USDC', 'USDT'],
    },
    {
      address: '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
      sinceBlock: 12640867,
      tokens: [
        'BADGER',
        'BAL',
        'CELR',
        'COMP',
        'CRV',
        'DODO',
        'DPX',
        'GNO',
        'GRT',
        'LINK',
        'LRC',
        'MATH',
        'MKR',
        'OHM',
        'SPELL',
        'sUSD',
        'SUSHI',
        'UNI',
        'WBTC',
        'WOO',
        'YFI',
      ],
    },
    {
      address: '0xA10c7CE4b876998858b1a9E12b10092229539400',
      sinceBlock: 13262081,
      tokens: ['DAI'],
    },
  ],
  details: {
    description:
      'Arbitrum is an Optimistic Rollup that aims to feel exactly like interacting with Ethereum, but with transactions costing a fraction of what they do on L1.',
    purpose: 'Universal',
    links: {
      websites: ['https://arbitrum.io/', 'https://offchainlabs.com/'],
      apps: [],
      documentation: ['https://developer.offchainlabs.com/'],
      explorers: ['https://arbiscan.io', 'https://explorer.arbitrum.io/'],
      repositories: [
        'https://github.com/OffchainLabs/arbitrum',
        'https://github.com/OffchainLabs/arb-os',
      ],
      socialMedia: [
        'https://twitter.com/OffchainLabs',
        'https://twitter.com/arbitrum',
        'https://medium.com/offchainlabs',
        'https://discord.gg/5KE54JwyTs',
      ],
    },
    riskView: {
      stateValidation: {
        value: 'Fraud proofs (INT)',
        description:
          'Fraud proofs allow WHITELISTED actors watching the chain to prove that the state is incorrect. Interactive proofs (INT) require multiple transactions over time to resolve.',
        sentiment: 'warning',
      },
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      sequencerFailure: RISK_VIEW.SEQUENCER_TRANSACT_L1,
      validatorFailure: RISK_VIEW.VALIDATOR_WHITELISTED_BLOCKS,
    },
    technology: {
      category: {
        name: 'Optimistic Rollup',
      },
      stateCorrectness: {
        name: 'Fraud proofs ensure state correctness',
        description:
          'After some period of time, the published state root is assumed to be correct. For a certain time period, usually one week one of the whitelisted actors can submit a fraud proof that shows that the state was incorrect.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'none of the whitelisted verifiers checks the published state. Fraud proofs assume at least one honest and able validator.',
            isCritical: true,
          },
        ],
        references: [
          {
            text: 'Executing and Securing the Chain - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/rollup_basics#executing-and-securing-the-chain',
          },
          {
            text: 'Note: onlyValidator modifier',
            href: 'https://etherscan.io/address/0x00c51f63a2d906510cb2c802c0a30589ba75d942#code#F1#L281',
          },
        ],
      },
      dataAvailability: {
        ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
        references: [
          {
            text: 'Submitting Transactions - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/rollup_basics#submitting-transactions',
          },
        ],
      },
      operator: {
        ...OPERATOR.CENTRALIZED_SEQUENCER,
        references: [
          {
            text: 'Validators - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/inside_arbitrum#validators',
          },
          {
            text: 'If the sequencer is malicious - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/inside_arbitrum#if-the-sequencer-is-malicious',
          },
        ],
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
        references: [
          {
            text: 'Submitting Transactions - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/rollup_basics#submitting-transactions',
          },
        ],
      },
      exitMechanisms: [
        {
          ...EXITS.REGULAR('optimistic', 'merkle proof'),
          references: [
            {
              text: 'L2 to L1 Messages Lifecycle - Arbitrum documentation',
              href: 'https://developer.offchainlabs.com/docs/l1_l2_messages#l2-to-l1-messages-lifecycle',
            },
            {
              text: 'Rules for Confirming or Rejecting Rollup Blocks - Arbitrum documentation',
              href: 'https://developer.offchainlabs.com/docs/inside_arbitrum#rules-for-confirming-or-rejecting-rollup-blocks',
            },
          ],
          risks: [
            {
              ...EXITS.RISK_CENTRALIZED_VALIDATOR,
              references: [
                {
                  text: 'Mainnet for everyone - Arbitrum Blog',
                  href: 'https://offchain.medium.com/mainnet-for-everyone-27ce0f67c85e',
                },
              ],
            },
          ],
        },
        {
          name: 'Tradeable Bridge Exit',
          description:
            "When a user initiates a regular withdrawal a third party verifying the chain can offer to buy this withdrawal by paying the user on L1. The user will get the funds immediately, however the third party has to wait for the block to be finalized. This is implemented as a first party functionality inside Arbitrum's token bridge.",
          risks: [],
          references: [
            {
              text: 'Tradeable Bridge Exits - Arbitrum documentation',
              href: 'https://developer.offchainlabs.com/docs/withdrawals#tradeable-bridge-exits',
            },
          ],
        },
      ],
      smartContracts: {
        name: 'EVM compatible smart contracts are supported',
        description:
          'Arbitrum uses the Arbitrum Virtual Machine (AVM) to execute transactions. This is similar to the EVM, but is independent from it and allows fraud proofs to be executed.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'there are mistakes in the highly complex AVM implementation.',
          },
        ],
        references: [
          {
            text: 'AVM - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/inside_arbitrum#avm-the-arbitrum-virtual-machine',
          },
        ],
      },
      contracts: {
        addresses: [
          {
            address: '0x171a2624302775eF943f4f62E76fd22A6813d7c4',
            name: 'ProxyAdmin',
            description:
              'This contract is an admin of most other contracts allowed to upgrade their implementations. It is owned by a 4-of-6 multisig.',
          },
          {
            address: '0xC12BA48c781F6e392B49Db2E25Cd0c28cD77531A',
            name: 'Rollup',
            description:
              'Main contract implementing Arbitrum One Rollup. Manages other Rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x171a2624302775eF943f4f62E76fd22A6813d7c4',
              implementation: '0x637E1CD58Ad3f0071ceCb281395e1823A96a553F',
            },
          },
          {
            address: '0x4c6f947Ae67F572afa4ae0730947DE7C874F95Ef',
            name: 'SequencerInbox',
            description:
              'Main entry point for the Sequencer submitting transaction batches to a Rollup.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x171a2624302775eF943f4f62E76fd22A6813d7c4',
              implementation: '0x9685e7281Fb1507B6f141758d80B08752faF0c43',
            },
          },
          {
            address: '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
            name: 'Inbox',
            description:
              'Entry point for users depositing ETH and sending L1 --> L2 messages. Deposited ETH is escowed in a Bridge contract.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x171a2624302775eF943f4f62E76fd22A6813d7c4',
              implementation: '0x048cc108763de75E080Ad717bD284003aa49eA15',
            },
          },
          {
            address: '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
            name: 'Bridge',
            description:
              'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x171a2624302775eF943f4f62E76fd22A6813d7c4',
              implementation: '0x2f06e43D850Ac75926FA2866e40139475b58Cb16',
            },
          },
          {
            address: '0xc8C3194eD3BE7B2393fEfE811a2Cc39297442c0B',
            name: 'RollupEventBridge',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x171a2624302775eF943f4f62E76fd22A6813d7c4',
              implementation: '0xb872Ea300eDba3872873fa1Aa33DB897c4D2cB66',
            },
          },

          {
            address: '0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a',
            name: 'Outbox',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x171a2624302775eF943f4f62E76fd22A6813d7c4',
              implementation: '0xb91f4bE773F5a1b9b0dC1085663b3535A6EBeEE2',
            },
          },
          {
            address: '0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa',
            name: 'ProxyAdmin (2)',
            description:
              'This is a different proxy admin for the three gateway contracts below. It is also owned by a 4-of-6 multisig..',
          },
          {
            address: '0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef',
            name: 'L1GatewayRouter',
            description: 'Router managing token <--> gateway mapping.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa',
              implementation: '0x62285266B5ec3d5B8867c84B807b79B2c13892EC',
            },
          },
          {
            address: '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
            name: 'L1ERC20Gateway',
            description:
              'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa',
              implementation: '0x0aCb04878B3675EF40b2e9392622CE3C1E9CC99E',
            },
          },
          {
            address: '0xcEe284F754E854890e311e3280b767F80797180d',
            name: 'L1CustomGateway',
            description:
              'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa',
              implementation: '0x98659BDffa4fEF82cD37771CDBFF3ddDa21EE8e9',
            },
          },
          {
            address: '0xD3B5b60020504bc3489D6949d545893982BA3011',
            name: 'L1DaiGateway',
            description:
              'Custom DAI Gateway, main entry point for users depositing DAI to L2 where "canonical" L2 DAI token managed by MakerDAO will be minted. Managed by MakerDAO.',
          },
          {
            address: '0xA10c7CE4b876998858b1a9E12b10092229539400',
            name: 'L1Escrow',
            description:
              'DAI Vault for custom DAI Gateway managed by MakerDAO.',
          },
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
    },
    news: [
      {
        date: '2021-08-31',
        name: 'Mainnet For Everyone',
        link: 'https://offchain.medium.com/mainnet-for-everyone-27ce0f67c85e',
      },
      {
        date: '2021-05-12',
        name: 'Wen Arbitrum?',
        link: 'https://medium.com/offchainlabs/wen-arbitrum-634969c14713',
      },
      {
        date: '2020-05-01',
        name: 'Arbitrum Rollup Protocol',
        link: 'https://developer.offchainlabs.com/docs/rollup_protocol',
      },
      {
        date: '2020-10-14',
        name: 'Arbitrum Rollup Testnet: full-featured and open to all',
        link: 'https://medium.com/offchainlabs/arbitrum-rollup-testnet-full-featured-and-open-to-all-da3255b562ea',
      },
    ],
  },
}
