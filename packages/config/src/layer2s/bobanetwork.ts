import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { Layer2 } from './types'

export const bobanetwork: Layer2 = {
  type: 'layer2',
  id: ProjectId('bobanetwork'),
  display: {
    name: 'Boba Network',
    slug: 'bobanetwork',
    warning:
      'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
    description:
      'Boba is an L2 Ethereum scaling & augmenting solution built by the Enya team as core contributors to the Boba Foundation. Boba is an EVM-compatible Optimistic Rollup chain \
    forked from Optimism. Two notable features are fast withdrawal facility that allows users to remove funds immediately without waiting for the end of the 7-day fraud proof window. \
    This facility is using funds from liquidity providers. The second is Hybrid Compute technology that enables Ethereum developers to build dApps that trigger code executed on web-scale infrastructure. \
    Boba Network operates on multiple Layer 1 blockchains.',
    purpose: 'Universal',
    links: {
      websites: ['https://boba.network'],
      apps: [],
      documentation: ['https://docs.boba.network/'],
      explorers: ['https://bobascan.com/'],
      repositories: ['https://github.com/bobanetwork/boba'],
      socialMedia: [
        'https://boba.network/#news',
        'https://boba.network/blog/',
        'https://www.enya.ai/company/media',
        'https://twitter.com/bobanetwork',
        'https://t.me/bobanetwork',
        'https://discord.gg/m7NysJjKhm',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    associatedTokens: ['BOBA', 'OMG'],
    escrows: [
      {
        // Proxy__OVM_L1StandardBridge
        address: '0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00',
        sinceTimestamp: new UnixTime(1628793901),
        tokens: '*',
      },
      {
        // Proxy__L1LiquidityPool
        address: '0x1A26ef6575B7BBB864d984D9255C069F6c361a14',
        sinceTimestamp: new UnixTime(1628818577),
        tokens: '*',
      },
    ],
    events: [
      {
        name: 'StateBatchAppended',
        abi: 'event StateBatchAppended (uint256 indexed _batchIndex, bytes32 _batchRoot, uint256 _batchSize, uint256 _prevTotalElements, bytes _extraData)',
        emitter: EthereumAddress('0xdE7355C971A5B733fe2133753Abd7e5441d441Ec'),
        type: 'state',
        sinceTimestamp: new UnixTime(1635386294),
      },
      {
        name: 'SequencerBatchAppended',
        abi: 'event  SequencerBatchAppended (uint256 _startingQueueIndex, uint256 _numQueueElements, uint256 _totalElements)',
        emitter: EthereumAddress('0xfBd2541e316948B259264c02f370eD088E04c3Db'),
        type: 'data',
        sinceTimestamp: new UnixTime(1635386025),
      },
    ],
    transactionApi: {
      type: 'rpc',
      url: 'https://mainnet.boba.network/',
      callsPerMinute: 200,
      startBlock: 1, // block 0 has timestamp of beginning of unix time
    },
  },
  riskView: makeBridgeCompatible({
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
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL('ETH and BOBA', 'are'),
  }),
  technology: {
    provider: 'Optimism',
    category: 'Optimistic Rollup',
    stateCorrectness: {
      name: 'Fraud proofs are in development',
      description:
        'Ultimately Boba Network will use fraud proofs to enforce state correctness. This feature is currently in development and the system permits invalid state roots. Users have the ability to run a validator software and compute valid state roots locally, but cannot act on them on chain.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'an invalid state root is submitted to the system.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'The incentive contract for verification proofs is disabled - Boba FAQ',
          href: 'https://docs.boba.network/faq#the-incentive-contract-for-verification-proofs-is-disabled',
        },
        {
          text: 'Checking Boba Mainnet for Fraud - Boba Optimism repository',
          href: 'https://github.com/bobanetwork/boba/blob/develop/boba_community/fraud-detector',
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
        {
          text: 'Canonical Transaction Chain - Boba documentation',
          href: 'https://docs.boba.network/developer-docs/chain-contracts#ovm-canonicaltransactionchain-ctc',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_SEQUENCER,
      references: [
        {
          text: 'Boba operates the only "Sequencer" node - Boba FAQ',
          href: 'https://docs.boba.network/faq#boba-operates-the-only-sequencer-node',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
      references: [
        {
          text: 'Canonical Transaction Chain - Boba documentation',
          href: 'https://docs.boba.network/developer-docs/chain-contracts#ovm-canonicaltransactionchain-ctc',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'The Standard Bridge - Boba documentation',
            href: 'https://docs.boba.network/developer-docs/bridging-l1-l2#the-standardtm-bridge',
          },
        ],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
      {
        name: 'Fast exit',
        description:
          'Users can initiate a fast exit which makes use of liquidity pools, and charges a small fee for the convenience. Users funds can then be withdrawn on L1 after only minutes.',
        references: [
          {
            text: 'The LP Bridge - Boba documentation',
            href: 'https://docs.boba.network/developer-docs/bridging-l1-l2#the-standardtm-bridge-1',
          },
        ],
        risks: [],
      },
    ],
    smartContracts: {
      name: 'EVM compatible smart contracts are supported',
      description:
        'Boba Network is pursuing the EVM Equivalence model. No changes to smart contracts are required regardless of the language they are written in, i.e. anything deployed on L1 can be deployed on Boba Network.',
      risks: [],
      references: [
        {
          text: 'Introducing EVM Equivalence',
          href: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
        },
      ],
    },
  },
  contracts: {
    addresses: [
      {
        name: 'CanonicalTransactionChain',
        description:
          'The Canonical Transaction Chain (CTC) contract is an append-only log of transactions which must be applied to the OVM state. It defines the ordering of transactions by writing them to the CTC:batches instance of the Chain Storage Container. CTC batches can only be submitted by OVM_Sequencer. The CTC also allows any account to enqueue() an L2 transaction, which the Sequencer must eventually append to the rollup state.',
        address: '0xfBd2541e316948B259264c02f370eD088E04c3Db',
      },
      {
        name: 'StateCommitmentChain',
        description:
          'The State Commitment Chain (SCC) contract contains a list of proposed state roots which Proposers assert to be a result of each transaction in the Canonical Transaction Chain (CTC). Elements here have a 1:1 correspondence with transactions in the CTC, and should be the unique state root calculated off-chain by applying the canonical transactions one by one. Currenlty olny OVM_Proposer can submit new state roots.',
        address: '0xdE7355C971A5B733fe2133753Abd7e5441d441Ec',
      },
      {
        name: 'ChainStorageContainer-CTC-batches',
        address: '0x17148284d2da2f38c96346f1776C1BF7D7691231',
      },
      {
        name: 'ChainStorageContainer-CTC-queue',
        address: '0x5f003030884B3a105809a0Eb0C0C28Ac40ECCD8d',
      },
      {
        name: 'ChainStorageContainer-SCC-batches',
        address: '0x13992B9f327faCA11568BE18a8ad3E9747e87d93',
      },
      {
        name: 'BondManager',
        description:
          "The Bond Manager contract will handle deposits in the form of an ERC20 token from bonded Proposers. It will also handle the accounting of gas costs spent by a Verifier during the course of a challenge. In the event of a successful challenge, the faulty Proposer's bond will be slashed, and the Verifier's gas costs will be refunded. Current mock implementation allows only OVM_Proposer to propose new state roots. No slashing is implemented.",
        address: '0x60660e6CDEb423cf847dD11De4C473130D65b627',
      },
      {
        name: 'L1CrossDomainMessenger',
        address: '0x6D4528d192dB72E282265D6092F4B872f9Dff69e',
        description:
          "The L1 Cross Domain Messenger (L1xDM) contract sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.",
        upgradeability: {
          type: 'EIP1967',
          admin: '0x1f2414D0af8741Bc822dBc2f88069c2b2907a840',
          implementation: '0x12Acf6E3ca96A60fBa0BBFd14D2Fe0EB6ae47820',
        },
      },
      {
        name: 'L1CrossDomainMessengerFast',
        address: '0xD05b8fD53614e1569cAC01c6D8d41416d0a7257E',
        description:
          'The L1 Cross Domain Messenger (L1xDM) contract that allows permissioned relayer to relay messages from L2 onto L1 immediately without waiting for the end of the fraud proof window. It is used only for L2->L1 communication.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0x1f2414D0af8741Bc822dBc2f88069c2b2907a840',
          implementation: '0x4CD1948de677e6f791B463daaB807645D3460996',
        },
      },
      {
        name: 'L1MultiMessageRelayer',
        description:
          'Helper contract that allows for relaying a batch of messages using L1CrossDomainMessenger.',
        address: '0x5fD2CF99586B9D92f56CbaD0A3Ea4DF256A0070B',
      },
      {
        name: 'L1MultiMessageRelayerFast',
        description:
          'Helper contract that allows for relaying a batch of messages using L1CrossDomainMessengerFast.',
        address: '0x2d6134Ac3e480fBDD263B7163d333dCA285f9622',
      },
      {
        name: 'L1LiquidityPool',
        address: '0x1A26ef6575B7BBB864d984D9255C069F6c361a14',
        description: 'Liquidity Pool manager for fast withdrawal facility.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0xEcB03B77Fa399676dC20f21e97c8C0F1476f97a0',
          implementation: '0xEcB03B77Fa399676dC20f21e97c8C0F1476f97a0',
        },
      },
      {
        name: 'Lib_AddressManager',
        description:
          'This is a library that stores the mappings between names such as OVM_Sequencer, OVM_Proposer and other contracts and their addresses.',
        address: '0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089',
      },
      // This Proxy is a L1ChugSplashProxy with a typical EIP1967 pattern.
      {
        name: 'L1StandardBridge',
        address: '0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00',
        description:
          'Main entry point for users depositing ERC20 tokens and ETH that do not require custom gateway.',
        upgradeability: {
          type: 'EIP1967',
          implementation: '0xAf41c681143Cb91f218959375f4452A604504833',
          admin: '0x1f2414D0af8741Bc822dBc2f88069c2b2907a840',
        },
      },
      // L1NFTBridge Proxy even though is called ResolvedDelegateProxy it does not use external lib manager
      {
        name: 'L1NFTBridge',
        address: '0xC891F466e53f40603250837282eAE4e22aD5b088',
        description: 'Standard NFT bridge.',
        upgradeability: {
          type: 'EIP1967',
          implementation: '0x8DB3B7Db8A0f77e0E21178FcaD0A53E52bfdBA82',
          admin: '0x1f2414D0af8741Bc822dBc2f88069c2b2907a840',
        },
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      name: 'Owner',
      accounts: [
        {
          address: '0x1f2414D0af8741Bc822dBc2f88069c2b2907a840',
          type: 'EOA',
        },
      ],
      description:
        'This address is the owner of the following contracts: OVM_L1CrossDomainMessenger, L1StandardBridge, LibAddressManager. This allows it to censor messages or pause message bridge altogether, upgrade bridge implementation potentially gaining access to all funds stored in a bridge and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    },
    {
      name: 'Sequencer',
      accounts: [
        {
          address: '0xfa46908B587f9102E81CE6C43b7B41b52881c57F',
          type: 'EOA',
        },
      ],
      description: 'Central actor allowed to commit L2 transactions to L1.',
    },
    {
      name: 'State Root Proposer',
      accounts: [
        {
          address: '0x5558c63d5bf229450995adc160c023C9F4d4bE80',
          type: 'EOA',
        },
      ],
      description: 'Central actor to post new L2 state roots to L1.',
    },
  ],
  milestones: [
    {
      name: 'Boba launches L2 on BNB',
      date: '2022-11-01T00:00:00Z',
      link: 'https://boba.network/boba-network-bnb-chain-l2-live/',
      description: 'Boba launches on BnB.',
    },
    {
      name: 'Boba launches L2 on Avalanche',
      date: '2022-09-21T00:00:00Z',
      link: 'https://boba.network/an-avalanche-of-boba-is-coming/',
      description: 'Boba launches on Avalanche.',
    },
    {
      name: 'Boba launches L2 on Moonbeam and Fantom',
      date: '2022-06-02T00:00:00Z',
      link: 'https://boba.network/boba-network-multichain-announcement/',
      description: 'Boba launches on Moonbeam and Fantom.',
    },
    {
      name: 'Call data compression',
      date: '2022-10-08T00:00:00Z',
      link: 'https://boba.network/boba-call-data-compression/',
      description:
        'The Boba Tree From (v0.1.0) release introduces Brotli compression for call data.',
    },
    {
      name: 'Hybrid Compute',
      date: '2022-03-18T00:00:00Z',
      link: 'https://boba.network/turing-hybrid-compute/',
      description:
        'Boba’s proprietary technology enables dApps that trigger code executed on web-scale infrastructure.',
    },
    {
      name: 'Mainnet launch',
      date: '2021-09-20T00:00:00Z',
      link: 'https://www.enya.ai/press/public-mainnet',
      description:
        'Layer 2 Optimistic Rollup based on the Optimism codebase is live on Ethereum.',
    },
    {
      name: 'BOBA Token launched',
      date: '2021-11-18T00:00:00Z',
      link: 'https://boba.network/Boba-airdrop-live/',
      description: 'BOBA token launched by OMG Foundation.',
    },
  ],
}
