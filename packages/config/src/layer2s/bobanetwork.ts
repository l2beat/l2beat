import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('bobanetwork')

const upgradesProxy = {
  upgradableBy: ['Owner'],
  upgradeDelay: 'No delay',
}

const upgradesAddressManager = {
  upgradableBy: ['Owner'],
  upgradeDelay: 'No delay',
  upgradeConsiderations:
    'The AddressManager can be used to replace this contract.',
}

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
    provider: 'Optimism',
    category: 'Optimistic Rollup',
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
        address: EthereumAddress('0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00'),
        sinceTimestamp: new UnixTime(1628793901),
        tokens: '*',
        ...upgradesProxy,
      },
      {
        // Proxy__L1LiquidityPool
        address: EthereumAddress('0x1A26ef6575B7BBB864d984D9255C069F6c361a14'),
        sinceTimestamp: new UnixTime(1628818577),
        tokens: '*',
        ...upgradesAddressManager,
      },
    ],
    transactionApi: {
      type: 'rpc',
      url: 'https://mainnet.boba.network/',
      callsPerMinute: 200,
      startBlock: 1,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      value: 'In development',
      description:
        'Currently the system permits invalid state roots. More details in project overview.',
      sentiment: 'bad',
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'CanonicalTransactionChain',
          references: [
            'https://etherscan.io/address/0xfBd2541e316948B259264c02f370eD088E04c3Db#code#F1#L311',
          ],
        },
      ],
    },
    upgradeability: {
      ...RISK_VIEW.UPGRADABLE_YES,
      sources: [
        {
          contract: 'L1CrossDomainMessenger_1',
          references: [
            'https://etherscan.io/address/0x6D4528d192dB72E282265D6092F4B872f9Dff69e#code',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_ENQUEUE_VIA_L1,
      sources: [
        {
          contract: 'CanonicalTransactionChain',
          references: [
            'https://etherscan.io/address/0xfBd2541e316948B259264c02f370eD088E04c3Db#code#F1#L219',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [
        {
          contract: 'StateCommitmentChain',
          references: [
            'https://etherscan.io/address/0xdE7355C971A5B733fe2133753Abd7e5441d441Ec#code#F1#L103',
          ],
        },
      ],
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL('ETH and BOBA', 'are'),
  }),
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeOpenSource: true,
    },
    stage1: {
      stateVerificationOnL1: false,
      fraudProofSystemAtLeast5Outsiders: null,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: null,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: null,
      fraudProofSystemIsPermissionless: false,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
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
          text: 'CanonicalTransactionChain.sol#L219 - Etherscan source code, appendSequencerBatch function',
          href: 'https://etherscan.io/address/0x5e4e65926ba27467555eb562121fac00d24e9dd2#code#F1#L277',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'Boba operates the only "Sequencer" node - Boba FAQ',
          href: 'https://docs.boba.network/faq#does-boba-operate-the-only-sequencer-node',
        },
        {
          text: 'CanonicalTransactionChain.sol#L293 - Etherscan source code, "OVM_Sequencer" check',
          href: 'https://etherscan.io/address/0x5e4e65926ba27467555eb562121fac00d24e9dd2#code#F1#L293',
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
          {
            text: 'BondManager.sol#L31 - Etherscan source code, isCollateralized function',
            href: 'https://etherscan.io/address/0x60660e6CDEb423cf847dD11De4C473130D65b627#code#F1#L31',
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
      discovery.getContractDetails('CanonicalTransactionChain', {
        description:
          'The Canonical Transaction Chain (CTC) contract is an append-only log of transactions which must be applied to the OVM state. It defines the ordering of transactions by writing them to the CTC:batches instance of the Chain Storage Container. CTC batches can only be submitted by OVM_Sequencer. The CTC also allows any account to enqueue() an L2 transaction, which the Sequencer must eventually append to the rollup state.',
        ...upgradesAddressManager,
      }),
      discovery.getContractDetails('StateCommitmentChain', {
        description:
          'The State Commitment Chain (SCC) contract contains a list of proposed state roots which Proposers assert to be a result of each transaction in the Canonical Transaction Chain (CTC). Elements here have a 1:1 correspondence with transactions in the CTC, and should be the unique state root calculated off-chain by applying the canonical transactions one by one. Currently only OVM_Proposer can submit new state roots.',
        ...upgradesAddressManager,
      }),
      {
        name: 'ChainStorageContainer-CTC-batches',
        address: EthereumAddress(
          discovery.getContractValue<string>(
            'CanonicalTransactionChain',
            'batches',
          ),
        ),
        ...upgradesAddressManager,
      },
      {
        name: 'ChainStorageContainer-CTC-queue',
        address: EthereumAddress(
          discovery.getContractValue<string>(
            'CanonicalTransactionChain',
            'queue',
          ),
        ),
        ...upgradesAddressManager,
      },
      {
        name: 'ChainStorageContainer-SCC-batches',
        address: EthereumAddress(
          discovery.getContractValue<string>('StateCommitmentChain', 'batches'),
        ),
        ...upgradesAddressManager,
      },
      discovery.getContractDetails('BondManager', {
        description:
          "The Bond Manager contract will handle deposits in the form of an ERC20 token from bonded Proposers. It will also handle the accounting of gas costs spent by a Verifier during the course of a challenge. In the event of a successful challenge, the faulty Proposer's bond will be slashed, and the Verifier's gas costs will be refunded. Current mock implementation allows only OVM_Proposer to propose new state roots. No slashing is implemented.",
        ...upgradesAddressManager,
      }),
      discovery.getContractDetails('L1CrossDomainMessenger_1', {
        description:
          "The L1 Cross Domain Messenger (L1xDM) contract sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.",
        pausable: {
          paused: discovery.getContractValue<boolean>(
            'L1CrossDomainMessenger_1',
            'paused',
          ),
          pausableBy: ['Owner'],
        },
        ...upgradesProxy,
      }),
      discovery.getContractDetails('L1MultiMessageRelayer', {
        description:
          'Helper contract that allows for relaying a batch of messages using L1CrossDomainMessenger.',
        ...upgradesAddressManager,
      }),
      discovery.getContractDetails('L1MultiMessageRelayerFast', {
        description:
          'Helper contract that allows for relaying a batch of messages using L1CrossDomainMessengerFast.',
        ...upgradesAddressManager,
      }),
      discovery.getContractDetails(
        'Proxy__L1LiquidityPoolArguments',
        'Liquidity Pool manager for fast withdrawal facility.',
      ),
      discovery.getContractDetails(
        'AddressManager',
        'This is a library that stores the mappings between names such as OVM_Sequencer, OVM_Proposer and other contracts and their addresses.',
      ),
      discovery.getContractDetails('L1StandardBridge', {
        description:
          'Main entry point for users depositing ERC20 tokens and ETH that do not require custom gateway.',
        ...upgradesProxy,
      }),
      discovery.getContractDetails('L1NFTBridge', {
        description: 'Standard NFT bridge.',
        pausable: {
          paused: discovery.getContractValue<boolean>('L1NFTBridge', 'paused'),
          pausableBy: ['Owner'],
        },
        ...upgradesAddressManager,
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      name: 'Owner',
      accounts: [discovery.getPermissionedAccount('AddressManager', 'owner')],
      description:
        'This address is the owner of the following contracts: OVM_L1CrossDomainMessenger, L1StandardBridge, AddressManager. This allows it to censor messages or pause message bridge altogether, upgrade bridge implementation potentially gaining access to all funds stored in a bridge and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    },
    {
      name: 'Sequencer',
      accounts: [
        discovery.getPermissionedAccount('AddressManager', 'OVM_Sequencer'),
      ],
      description: 'Central actor allowed to commit L2 transactions to L1.',
    },
    {
      name: 'State Root Proposer',
      accounts: [
        discovery.getPermissionedAccount('AddressManager', 'OVM_Proposer'),
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
  knowledgeNuggets: [
    {
      title: 'What is Hybrid Compute?',
      url: 'https://twitter.com/bkiepuszewski/status/1521849011594010624',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
  ],
}
