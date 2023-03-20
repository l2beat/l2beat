import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  MILESTONES,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { ProjectDiscovery } from './common/ProjectDiscovery'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('optimism')

export const optimism: Layer2 = {
  type: 'layer2',
  id: ProjectId('optimism'),
  display: {
    name: 'Optimism',
    slug: 'optimism',
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
      documentation: ['https://community.optimism.io'],
      explorers: ['https://optimistic.etherscan.io'],
      repositories: ['https://github.com/ethereum-optimism/optimism'],
      socialMedia: [
        'https://optimism.mirror.xyz/',
        'https://twitter.com/OptimismFND',
        'https://twitter.com/OPLabsPBC',
        'https://youtube.com/playlist?list=PLX_rXoLYCf5HqTWygUfoMfzRirGz5lekH',
        'https://twitch.tv/optimismpbc',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    associatedTokens: ['OP'],
    escrows: [
      {
        // old snx bridge
        address: EthereumAddress('0x045e507925d2e05D114534D0810a1abD94aca8d6'),
        sinceTimestamp: new UnixTime(1610668212),
        tokens: ['SNX'],
      },
      {
        // current SNX bridge escrow
        address: EthereumAddress('0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f'),
        sinceTimestamp: new UnixTime(1620680982),
        tokens: ['SNX'],
      },
      {
        // new snx bridge
        address: EthereumAddress('0xCd9D4988C0AE61887B075bA77f08cbFAd2b65068'),
        sinceTimestamp: new UnixTime(1620680934),
        tokens: ['SNX'],
      },
      {
        address: EthereumAddress('0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65'),
        sinceTimestamp: new UnixTime(1625675779),
        tokens: ['DAI'],
      },
      {
        address: EthereumAddress('0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1'),
        sinceTimestamp: new UnixTime(1624401464),
        tokens: '*',
      },
    ],
    transactionApi: {
      type: 'rpc',
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
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    provider: 'Optimism',
    category: 'Optimistic Rollup',
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
            text: 'Withdrawing back to L1 - Optimism Help Center',
            href: 'https://help.optimism.io/hc/en-us/articles/4411903283227-Withdrawals-from-Optimism',
          },
          {
            text: 'mockOVM_BondManager.sol#L71 - Etherscan source code',
            href: 'https://etherscan.io/address/0xCd76de5C57004d47d0216ec7dAbd3c72D8c49057#code#F6#L71',
          },
        ],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
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
  },
  permissions: [
    {
      name: 'Optimism MultiSig',
      accounts: [
        {
          address: discovery.getContract('GnosisSafe').address,
          type: 'MultiSig',
        },
      ],
      description:
        'This address is the owner of the following contracts: OVM_L1CrossDomainMessenger, L1StandardBridge, LibAddressManager. This allows it to censor messages or pause message bridge altogether, upgrade bridge implementation potentially gaining access to all funds stored in a bridge and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    },
    {
      name: 'MultiSig participants',
      accounts: discovery
        .getContractValue<string[]>('GnosisSafe', 'getOwners')
        .map((owner) => ({ address: EthereumAddress(owner), type: 'EOA' })),
      description: `These addresses are the participants of the ${discovery.getContractValue<number>(
        'GnosisSafe',
        'getThreshold',
      )}/${
        discovery.getContractValue<string[]>('GnosisSafe', 'getOwners').length
      } Optimism MultiSig.`,
    },
    {
      name: 'Sequencer',
      accounts: [
        {
          address: EthereumAddress(
            discovery.getContractValue<string>(
              'Lib_AddressManager',
              'OVM_Sequencer',
            ),
          ),
          type: 'EOA',
        },
      ],
      description: 'Central actor allowed to commit L2 transactions to L1.',
    },
    {
      name: 'State Root Proposer',
      accounts: [
        {
          address: EthereumAddress(
            discovery.getContractValue<string>(
              'Lib_AddressManager',
              'OVM_Proposer',
            ),
          ),
          type: 'EOA',
        },
      ],
      description: 'Central actor to post new L2 state roots to L1.',
    },
  ],
  contracts: {
    addresses: [
      {
        name: 'CanonicalTransactionChain',
        description:
          'The Canonical Transaction Chain (CTC) contract is an append-only log of transactions which must be applied to the OVM state. It defines the ordering of transactions by writing them to the CTC:batches instance of the Chain Storage Container. CTC batches can only be submitted by OVM_Sequencer. The CTC also allows any account to enqueue() an L2 transaction, which the Sequencer must eventually append to the rollup state.',
        address: discovery.getContract('CanonicalTransactionChain').address,
      },
      {
        name: 'StateCommitmentChain',
        description:
          'The State Commitment Chain (SCC) contract contains a list of proposed state roots which Proposers assert to be a result of each transaction in the Canonical Transaction Chain (CTC). Elements here have a 1:1 correspondence with transactions in the CTC, and should be the unique state root calculated off-chain by applying the canonical transactions one by one. Currenlty olny OVM_Proposer can submit new state roots.',
        address: discovery.getContract('StateCommitmentChain').address,
      },
      {
        name: 'ChainStorageContainer-CTC-batches',
        address: EthereumAddress(
          discovery.getContractValue<string>(
            'CanonicalTransactionChain',
            'batches',
          ),
        ),
      },
      {
        name: 'ChainStorageContainer-SCC-batches',
        address: EthereumAddress(
          discovery.getContractValue<string>('StateCommitmentChain', 'batches'),
        ),
      },
      {
        name: 'BondManager',
        description:
          "The Bond Manager contract will handle deposits in the form of an ERC20 token from bonded Proposers. It will also handle the accounting of gas costs spent by a Verifier during the course of a challenge. In the event of a successful challenge, the faulty Proposer's bond will be slashed, and the Verifier's gas costs will be refunded. Current mock implementation allows only OVM_Proposer to propose new state roots. No slashing is implemented.",
        address: discovery.getContract('BondManager').address,
      },
      {
        name: 'L1CrossDomainMessenger',
        address: discovery.getContract('L1CrossDomainMessenger').address,
        description:
          "The L1 Cross Domain Messenger (L1xDM) contract sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.",
        upgradeability: discovery.getContract('L1CrossDomainMessenger')
          .upgradeability,
      },
      {
        name: 'Lib_AddressManager',
        description:
          'This is a library that stores the mappings between names such as OVM_Sequencer, OVM_Proposer and other contracts and their addresses.',
        address: discovery.getContract('Lib_AddressManager').address,
      },
      {
        name: 'L1StandardBridge',
        address: discovery.getContract('L1StandardBridge').address,
        description:
          'Main entry point forgetContract users depositing ERC20 tokens and ETH that do not require custom gateway.',
        upgradeability:
          discovery.getContract('L1StandardBridge').upgradeability,
      },
      {
        name: 'SynthetixBridgeToOptimism',
        description:
          'Custom SNX Gateway, main entry point for users depositing SNX to L2 where "canonical" L2 SNX token managed by Synthetix will be minted. Managed by Synthetix.',
        address: EthereumAddress('0xCd9D4988C0AE61887B075bA77f08cbFAd2b65068'),
      },
      {
        name: 'SynthetixBridgeEscrow',
        description: 'SNX Vault for custom SNX Gateway managed by Synthetix.',
        address: EthereumAddress('0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f'),
      },
      {
        name: 'L1DaiGateway',
        description:
          'Custom DAI Gateway, main entry point for users depositing DAI to L2 where "canonical" L2 DAI token managed by MakerDAO will be minted. Managed by MakerDAO.',
        address: EthereumAddress('0x10E6593CDda8c58a1d0f14C5164B376352a55f2F'),
      },
      {
        name: 'L1Escrow',
        description: 'DAI Vault for custom DAI Gateway managed by MakerDAO.',
        address: EthereumAddress('0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65'),
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'Optimism’s Goerli Testnet migrated to Bedrock',
      link: 'https://twitter.com/OPLabsPBC/status/1613684377124327424',
      date: '2023-01-13T00:00:00Z',
      description: 'OP on Goerli, since Jan 2023 is running Bedrock.',
    },
    {
      name: 'OP Stack Introduced',
      link: 'https://optimism.mirror.xyz/fLk5UGjZDiXFuvQh6R_HscMQuuY9ABYNF7PI76-qJYs',
      date: '2022-10-17T00:00:00Z',
      description:
        'OP Stack, modular, open-sourced blueprint o how to build scalable blockchains.',
    },
    {
      ...MILESTONES.MAINNET_OPEN,
      link: 'https://medium.com/ethereum-optimism/all-gas-no-brakes-8b0f32afd466',
      date: '2021-12-16T00:00:00Z',
      description:
        'Whitelist got removed, there are no restrictions on who can transact with the network.',
    },
    {
      name: 'OP token airdrop',
      link: 'https://optimism.mirror.xyz/qvd0WfuLKnePm1Gxb9dpGchPf5uDz5NSMEFdgirDS4c',
      date: '2022-05-31T00:00:00Z',
      description: 'The first round of OP token airdrop.',
    },
    {
      name: 'OVM 2.0 is live',
      link: 'https://twitter.com/optimismfnd/status/1458953238867165192?s=21&t=cQ0NPREYt-u1rP7OiPFKUg',
      date: '2021-11-12T00:00:00Z',
      description:
        'Network upgrade to OVM 2.0 and removal of fraud-proof system.',
    },
    {
      name: 'Mainnet Soft Launch',
      link: 'https://medium.com/ethereum-optimism/mainnet-soft-launch-7cacc0143cd5',
      date: '2021-01-16T00:00:00Z',
      description:
        'Only selected contracts like Synthetix and Uniswap are available.',
    },
    {
      name: 'Community Launch',
      link: 'https://medium.com/ethereum-optimism/community-launch-7c9a2a9d3e84',
      date: '2021-08-19T00:00:00Z',
      description: 'All smart contracts allowed after prior approval.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'How Optimism compresses data',
      url: 'https://twitter.com/bkiepuszewski/status/1508740414492323840?s=20&t=vMgR4jW1ssap-A-MBsO4Jw',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
    {
      title: 'How does Optimism really work?',
      url: 'https://research.paradigm.xyz/optimism',
      thumbnail: NUGGETS.THUMBNAILS.PARADIGM_01,
    },
    {
      title: 'Modular Rollup Theory',
      url: 'https://www.youtube.com/watch?v=jnVjhp41pcc',
      thumbnail: NUGGETS.THUMBNAILS.MODULAR_ROLLUP,
    },
  ],
}
