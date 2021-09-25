import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { Project } from './types'

export const optimism: Project = {
  name: 'Optimism',
  slug: 'optimism',
  bridges: [
    {
      // old snx bridge
      address: '0x045e507925d2e05D114534D0810a1abD94aca8d6',
      sinceBlock: 11656238,
      tokens: ['SNX'],
    },
    {
      // old snx bridge
      address: '0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f',
      sinceBlock: 12409015,
      tokens: ['SNX'],
    },
    {
      address: '0xCd9D4988C0AE61887B075bA77f08cbFAd2b65068',
      sinceBlock: 12409013,
      tokens: ['SNX'],
    },
    {
      address: '0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
      sinceBlock: 12781431,
      tokens: ['DAI'],
    },
    {
      address: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
      sinceBlock: 12686786,
      tokens: ['ETH', 'LINK', 'MKR', 'UNI', 'USDC', 'USDT', 'WBTC'],
    },
  ],
  details: {
    warning:
      'Currently only whitelisted contracts can be deployed on Optimism.',
    description:
      'Optimistic Ethereum is an EVM-compatible Optimistic Rollup chain. It aims to be fast, simple, and secure.',
    purpose: 'Universal',
    links: {
      websites: ['https://optimism.io/'],
      apps: [],
      documentation: ['https://community.optimism.io/docs/'],
      explorers: ['https://optimistic.etherscan.io/'],
      repositories: ['https://github.com/ethereum-optimism/optimism'],
      socialMedia: [
        'https://medium.com/ethereum-optimism',
        'https://twitter.com/optimismPBC',
        'https://discord.gg/jrnFEvq',
        'https://youtube.com/playlist?list=PLX_rXoLYCf5HqTWygUfoMfzRirGz5lekH',
        'https://twitch.tv/optimismpbc',
      ],
    },
    riskView: {
      stateValidation: {
        value: 'Proofs disabled',
        description:
          'Currently the system permits invalid state roots. More details in project overview.',
        sentiment: 'bad',
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
        name: 'Fraud proofs are disabled',
        description:
          'Ultimately Optimism will use fraud proofs to enforce state correctness. This feature is currently disabled and the system permits invalid state roots.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'an invalid state root is submitted to the system.',
            isCritical: true,
          },
        ],
        references: [
          {
            text: 'The incentive contract for verification proofs is disabled - Optimism FAQ',
            href: 'https://community.optimism.io/faqs/#the-incentive-contract-for-verification-proofs-is-disabled',
          },
        ],
      },
      dataAvailability: {
        ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
        references: [
          {
            text: 'Data Availability Batches - Paradigm Research',
            href: 'https://research.paradigm.xyz/optimism#data-availability-batches',
          },
        ],
      },
      operator: {
        ...OPERATOR.CENTRALIZED_SEQUENCER,
        references: [
          {
            text: 'Optimism operates the only "Sequencer" node - Optimism FAQ',
            href: 'https://community.optimism.io/faqs/#optimism-operates-the-only-sequencer-node',
          },
        ],
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
        references: [
          {
            text: ' Chain Contracts - Optimism documentation',
            href: 'https://community.optimism.io/docs/protocol/protocol.html#chain-contracts',
          },
        ],
      },
      exitMechanisms: [
        {
          ...EXITS.REGULAR('optimistic', 'merkle proof'),
          references: [
            {
              text: ' Withdrawing back to L1 - Optimism documentation',
              href: 'https://community.optimism.io/docs/users/gateway.html#withdrawing-back-to-l1',
            },
          ],
          risks: [
            {
              ...EXITS.RISK_CENTRALIZED_VALIDATOR,
              references: [
                {
                  text: 'mockOVM_BondManager.sol#L71 - Etherscan source code',
                  href: 'https://etherscan.io/address/0xCd76de5C57004d47d0216ec7dAbd3c72D8c49057#code#F6#L71',
                },
              ],
            },
          ],
        },
      ],
      smartContracts: {
        name: 'EVM compatible smart contracts are supported',
        description:
          'Optimism uses the Optimistic Virtual Machine (OVM) to execute transactions. This is similar to the EVM, but is independent from it and allows fraud proofs to be executed. Currently there is a whitelist that limits who can deploy smart contracts.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'there are mistakes in the highly complex OVM implementation.',
          },
        ],
        references: [
          {
            text: 'Execution Contracts - Optimism documentation',
            href: 'https://community.optimism.io/docs/protocol/protocol.html#execution-contracts',
          },
          {
            text: 'Deployer Whitelist - Optimism documentation',
            href: 'https://community.optimism.io/docs/protocol/protocol.html#ovm-deployerwhitelist',
          },
        ],
      },
      contracts: {
        addresses: [
          {
            name: 'SynthetixBridgeToOptimism',
            address: '0x045e507925d2e05D114534D0810a1abD94aca8d6',
          },
          {
            name: 'SynthetixBridgeEscrow',
            address: '0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f',
          },
          {
            name: 'SynthetixBridgeToOptimism',
            address: '0xCd9D4988C0AE61887B075bA77f08cbFAd2b65068',
          },
          {
            name: 'L1Escrow',
            address: '0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
          },
          {
            name: 'Lib_AddressManager',
            address: '0xdE1FCfB0851916CA5101820A69b13a4E276bd81F',
          },
          {
            name: 'OVM_CanonicalTransactionChain',
            address: '0x4BF681894abEc828B212C906082B444Ceb2f6cf6',
          },
          {
            name: 'OVM_ChainStorageContainer-CTC-batches',
            address: '0x3EA1a3839D8ca9a7ff3c567a9F36f4C4DbECc3eE',
          },
          {
            name: 'OVM_ChainStorageContainer-CTC-queue',
            address: '0xA0b912b3Ea71A04065Ff82d3936D518ED6E38039',
          },
          {
            name: 'OVM_ChainStorageContainer-SCC-batches',
            address: '0x77eBfdFcC906DDcDa0C42B866f26A8D5A2bb0572',
          },
          {
            name: 'OVM_ExecutionManager',
            address: '0x2745C24822f542BbfFB41c6cB20EdF766b5619f5',
          },
          {
            name: 'OVM_FraudVerifier',
            address: '0x042065416C5c665dc196076745326Af3Cd840D15',
          },
          {
            name: 'OVM_L1MultiMessageRelayer',
            address: '0xF26391FBB1f77481f80a7d646AC08ba3817eA891',
          },
          {
            name: 'OVM_SafetyChecker',
            address: '0xfe1F9Cf28ecDb12110aa8086e6FD343EA06035cC',
          },
          {
            name: 'OVM_StateCommitmentChain',
            address: '0xE969C2724d2448F1d1A6189d3e2aA1F37d5998c1',
          },
          {
            name: 'OVM_StateManagerFactory',
            address: '0xd0e3e318154716BD9d007E1E6B021Eab246ff98d',
          },
          {
            name: 'OVM_StateTransitionerFactory',
            address: '0x38A6ed6fd76035684caDef38cF49a2FffA782B67',
          },
          {
            name: 'Proxy__OVM_L1CrossDomainMessenger',
            address: '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
          },
          {
            name: 'Proxy__OVM_L1StandardBridge',
            address: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x9996571372066A1545D3435C6935e3F9593A7eF5',
              implementation: '0x9091dda480B232133A7D2E4cb23336B4F0293196',
            },
          },
          {
            name: 'mockOVM_BondManager',
            address: '0xCd76de5C57004d47d0216ec7dAbd3c72D8c49057',
          },
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
    },
    news: [
      {
        date: '2021-08-19',
        name: 'Community Launch',
        link: 'https://medium.com/ethereum-optimism/community-launch-7c9a2a9d3e84',
      },
      {
        date: '2021-07-20',
        name: 'Retroactive Public Goods Funding',
        link: 'https://medium.com/ethereum-optimism/retroactive-public-goods-funding-33c9b7d00f0c',
      },
      {
        date: '2021-02-24',
        name: 'Dope Hires & Moar Mainnet in March',
        link: 'https://medium.com/ethereum-optimism/dope-hires-moar-mainnet-in-march-174fa8966361',
      },
    ],
  },
}
