import { ProjectId } from '@l2beat/common'

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
  id: ProjectId('optimism'),
  bridges: [
    {
      // old snx bridge
      address: '0x045e507925d2e05D114534D0810a1abD94aca8d6',
      sinceBlock: 11656238,
      tokens: ['SNX'],
    },
    {
      // current SNX bridge escrow
      address: '0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f',
      sinceBlock: 12409015,
      tokens: ['SNX'],
    },
    {
      // new snx bridge
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
      tokens: '*',
    },
  ],
  associatedTokens: ['OP'],
  details: {
    warning:
      'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
    description:
      'Optimistic Ethereum is an EVM-compatible Optimistic Rollup chain. It aims to be fast, simple, and secure. \
      With the Nov 2021 upgrade to "EVM equivalent" OVM 2.0 old fraud proof system has been disabled while the \
      new fraud-proof system is being built (https://github.com/geohot/cannon).',
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
    provider: 'Optimism',
    riskView: {
      stateValidation: {
        value: 'In development',
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
        name: 'Fraud proofs are in development',
        description:
          'Ultimately, Optimism will use interactive fraud proofs to enforce state correctness. This feature is currently in development and the system permits invalid state roots.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'an invalid state root is submitted to the system.',
            isCritical: true,
          },
        ],
        references: [
          {
            text: 'Introducing EVM Equivalence',
            href: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
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
            text: 'How will the sequencer be decentralized over time? - Optimism documentation',
            href: 'https://community.optimism.io/docs/protocol/sequencing.html#how-will-the-sequencer-be-decentralized-over-time',
          },
        ],
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
        references: [
          {
            text: ' Chain Contracts - Optimism documentation',
            href: 'https://community.optimism.io/docs/protocol/protocol-2.0.html#chain-contracts',
          },
        ],
      },
      exitMechanisms: [
        {
          ...EXITS.REGULAR('optimistic', 'merkle proof'),
          references: [
            {
              text: ' Withdrawing back to L1 - Optimism documentation',
              href: 'https://community.optimism.io/docs/users/withdrawal.html',
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
      permissions: [
        {
          accounts: [
            {
              address: '0x6887246668a3b87F54DeB3b94Ba47a6f63F32985',
              type: 'EOA',
            },
          ],
          name: 'OVM_SEQUENCER',
          description:
            'Central actor allowed to sequence and post new L2 transaction batch.',
        },
        {
          accounts: [
            {
              address: '0x473300df21D047806A082244b417f96b32f13A33',
              type: 'EOA',
            },
          ],
          name: 'OVM_PROPOSER',
          description: 'Central actor allowed to post new L2 state root',
        },
        {
          accounts: [
            {
              address: '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
              type: 'MultiSig',
            },
          ],
          name: 'LibAddressManager Owner',
          description:
            'Can change OVM_SEQUENCER, OVM_PROPOSER and any other system component (unlimited upgrade power). Permissioneless set of validators, thanks to full on-chain data availability, can monitor the chain for any potential mishbehaviour.',
        },
        {
          accounts: [
            {
              address: '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
              type: 'MultiSig',
            },
          ],
          name: 'OVM_L1CrossDomainMessenger Owner',
          description:
            'Can censor messages or pause message bridge alltogether. Can upgrade messenger implementation.',
        },
        {
          accounts: [
            {
              address: '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
              type: 'MultiSig',
            },
          ],
          name: 'L1StandardBridge Owner',
          description:
            'Can upgrade bridge implementation potentially gaining access to all funds stored in a bridge.',
        },
      ],
      smartContracts: {
        name: 'EVM compatible smart contracts are supported',
        description:
          'Optimism is pursuing the EVM Equivalence model. No changes to smart contracts are required regardless of the language they are written in, i.e. anything deployed on L1 can be deployed on Optimism.',
        risks: [],
        references: [
          {
            text: 'Introducing EVM Equivalence',
            href: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
          },
        ],
      },
      contracts: {
        addresses: [
          {
            name: 'CanonicalTransactionChain',
            description:
              'The Canonical Transaction Chain (CTC) contract is an append-only log of transactions which must be applied to the OVM state. It defines the ordering of transactions by writing them to the CTC:batches instance of the Chain Storage Container. CTC batches can only be submitted by OVM_Sequencer. The CTC also allows any account to enqueue() an L2 transaction, which the Sequencer must eventually append to the rollup state.',
            address: '0x5E4e65926BA27467555EB562121fac00D24E9dD2',
          },
          {
            name: 'StateCommitmentChain',
            description:
              'The State Commitment Chain (SCC) contract contains a list of proposed state roots which Proposers assert to be a result of each transaction in the Canonical Transaction Chain (CTC). Elements here have a 1:1 correspondence with transactions in the CTC, and should be the unique state root calculated off-chain by applying the canonical transactions one by one. Currenlty olny OVM_Proposer can submit new state roots.',
            address: '0xBe5dAb4A2e9cd0F27300dB4aB94BeE3A233AEB19',
          },
          {
            name: 'ChainStorageContainer-CTC-batches',
            address: '0xD16463EF9b0338CE3D73309028ef1714D220c024',
          },
          {
            name: 'ChainStorageContainer-SCC-batches',
            address: '0xb0ddFf09c4019e31960de11bD845E836078E8EbE',
          },
          {
            name: 'BondManager',
            description:
              "The Bond Manager contract will handle deposits in the form of an ERC20 token from bonded Proposers. It will also handle the accounting of gas costs spent by a Verifier during the course of a challenge. In the event of a successful challenge, the faulty Proposer's bond will be slashed, and the Verifier's gas costs will be refunded. Current mock implementation allows only OVM_Proposer to propose new state roots. No slashing is implemented.",
            address: '0xcd626E1328b41fCF24737F137BcD4CE0c32bc8d1',
          },
          {
            name: 'L1CrossDomainMessenger',
            address: '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
            description:
              "The L1 Cross Domain Messenger (L1xDM) contract sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.",
            upgradeability: {
              type: 'EIP1967',
              admin: '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
              implementation: '0xd9166833FF12A5F900ccfBf2c8B62a90F1Ca1FD5',
            },
          },
          {
            name: 'Lib_AddressManager',
            description:
              'This is a library that stores the mappings between names such as OVM_Sequencer, OVM_Proposer and other contracts and their addresses.',
            address: '0xdE1FCfB0851916CA5101820A69b13a4E276bd81F',
          },
          {
            name: 'L1StandardBridge',
            address: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
            description:
              'Main entry point for users depositing ERC20 tokens and ETH that do not require custom gateway.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
              implementation: '0x40E0C049f4671846E9Cff93AAEd88f2B48E527bB',
            },
          },
          {
            name: 'SynthetixBridgeToOptimism',
            description:
              'Custom SNX Gateway, main entry point for users depositing SNX to L2 where "canonical" L2 SNX token managed by Synthetix will be minted. Managed by Synthetix.',
            address: '0xCd9D4988C0AE61887B075bA77f08cbFAd2b65068',
          },
          {
            name: 'SynthetixBridgeEscrow',
            description:
              'SNX Vault for custom SNX Gateway managed by Synthetix.',
            address: '0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f',
          },
          {
            name: 'L1DaiGateway',
            description:
              'Custom DAI Gateway, main entry point for users depositing DAI to L2 where "canonical" L2 DAI token managed by MakerDAO will be minted. Managed by MakerDAO.',
            address: '0x10E6593CDda8c58a1d0f14C5164B376352a55f2F',
          },
          {
            name: 'L1Escrow',
            description:
              'DAI Vault for custom DAI Gateway managed by MakerDAO.',
            address: '0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
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
      {
        date: '2021-10-26',
        name: 'Introducing EVM Equivalence',
        link: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
      },
      {
        date: '2021-11-12',
        name: 'Network upgrade to OVM 2.0',
        link: 'https://twitter.com/optimismPBC/status/1458953238867165192?s=20',
      },
      {
        date: '2021-12-16',
        name: 'Optimism removes whitelist for developers',
        link: 'https://optimismpbc.medium.com/all-gas-no-brakes-8b0f32afd466',
      },
    ],
  },
}
