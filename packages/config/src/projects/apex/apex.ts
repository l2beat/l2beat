import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { getRollupStage } from '../../common/stages/getRollupStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('apex')

export const apex: ScalingProject = {
  type: 'layer3',
  id: ProjectId('apex'),
  hostChain: ProjectId('arbitrum'),
  addedAt: UnixTime(1663927910), // 2022-09-23T10:11:50Z
  capability: 'appchain',
  badges: [BADGES.VM.AppChain, BADGES.L3ParentChain.Arbitrum],
  proofSystem: {
    type: 'Validity',
    zkCatalogId: ProjectId('zksyncprover'),
  },
  reasonsForBeingOther: [
    {
      ...REASON_FOR_BEING_OTHER.EXTERNAL_BRIDGE,
      explanation:
        "ApeX's proof system does not authenticate deposits on external chains. Users must additionally trust the 2/2 validator set and LayerZero bridge not to forge non-existent deposits.",
    },
  ],
  display: {
    name: 'ApeX',
    slug: 'apex',
    description:
      'ApeX Omni is an application-specific ZK rollup for order book trading. It uses zkLink X to aggregate liquidity deposited across multiple chains.',
    detailedDescription:
      'ApeX Omni is a non-EVM L3 on Arbitrum One. Its primary zkLink deployment verifies state transition proofs and publishes state differences on Arbitrum, while secondary deployments escrow assets deposited on other chains and synchronize their local state with the primary deployment through LayerZero.',
    purposes: ['Exchange'],
    links: {
      websites: ['https://apex.exchange/'],
      bridges: ['https://omni.apex.exchange/'],
      documentation: ['https://api-docs.pro.apex.exchange/'],
      repositories: ['https://github.com/ApeX-Protocol'],
      socialMedia: [
        'https://twitter.com/OfficialApeXdex',
        'https://apexdex.medium.com/',
        'https://t.me/ApeXdex',
        'https://discord.com/invite/apexprotocol',
        'https://youtube.com/@apexprotocol',
      ],
    },
  },
  stage: getRollupStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: false,
      stateVerificationOnL1: false,
      fraudProofSystemAtLeast5Outsiders: null,
    },
    stage1: {
      principle: false,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: false,
      noRedTrustedSetups: null,
      programHashesReproducible: null,
      proverSourcePublished: false,
      verifierContractsReproducible: false,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  chainConfig: {
    name: 'apex',
    chainId: undefined,
    apis: [],
  },
  config: {
    associatedTokens: ['APEX'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'arb1:0x3169844a120c0f517b4eb4a750c08d8518c8466a',
        ),
        tokens: '*',
        includeInTotal: false,
        description:
          'Main zkLink contract on Arbitrum One. It escrows assets deposited on Arbitrum and processes withdrawals after blocks are proven, synchronized, and executed.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x35D173cdfE4d484BC5985fDa55FABad5892c7B82',
        ),
        tokens: '*',
        source: 'external',
        description:
          'Secondary zkLink contract on Ethereum. It escrows assets deposited on Ethereum and processes withdrawals confirmed by the primary deployment.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'base:0xee7981c4642de8d19aed11da3bac59277dfd59d7',
        ),
        tokens: '*',
        includeInTotal: false,
        source: 'external',
        description:
          'Secondary zkLink contract on Base. It escrows assets deposited on Base and processes withdrawals confirmed by the primary deployment.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'mantle:0x3C7c0ebFCD5786ef48df5ed127cdDEb806db976c',
        ),
        tokens: '*',
        includeInTotal: false,
        source: 'external',
        description:
          'Secondary zkLink contract on Mantle. It escrows assets deposited on Mantle and processes withdrawals confirmed by the primary deployment.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'bnb:0xb8D9F005654b7b127b34dae8F973Ba729ca3A2D9',
        ),
        tokens: '*',
        includeInTotal: false,
        source: 'external',
        description:
          'Secondary zkLink contract on BNB. It escrows assets deposited on BNB and processes withdrawals confirmed by the primary deployment.',
      }),
    ],
  },
  dataAvailability: {
    layer: {
      value: 'Arbitrum One',
      secondLine: 'Calldata',
      sentiment: 'good',
      description:
        'ApeX state differences are posted as calldata on Arbitrum One. Arbitrum ultimately posts its transaction data to Ethereum blobs.',
      projectId: ProjectId('arbitrum'),
    },
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      executionDelay: 0,
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stackedRiskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_L3('Arbitrum One'),
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN_L3,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stateValidation: {
    categories: [
      {
        title: 'Validity proofs',
        description:
          'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Arbitrum One by a smart contract.\nDeposits on secondary chains are not verified with these validity proofs and rely on LayerZero bridges instead. Deposits could be stolen if bridges are compromized.',
        risks: [],
        references: [
          {
            title:
              'Function proveBlocks on ZkLinkPeriphery.sol calls verifier.verifyAggregatedBlockProof',
            url: 'https://arbiscan.io/address/0x3203E813930bD710043c1d899fE38dD359307352#code#F10#L302',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      name: 'State differences are published on Arbitrum One',
      description:
        'The data needed to reconstruct the ApeX state is included in commitBlocks calldata on Arbitrum One. Secondary deployments additionally commit their local onchain operations and send synchronization hashes to the primary deployment.',
      risks: [],
      references: [
        {
          title: 'See CommitBlockInfo in commitBlock function on ZkLink.sol',
          url: 'https://arbiscan.io/address/0x23871561330080828507ded34d23fef5ede7053c#code#F12#L136',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description:
        'A single permissioned validator can commit and execute blocks. Proof submission is permissionless, but only blocks committed by the validator can be proven and executed.',
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      description:
        'There is no general mechanism to force the sequencer to include transactions. Deposits create priority requests, but users cannot submit forced withdrawal requests. Although the contracts contain an exodus mode, the secondary deployments use EmptyVerifier contracts that reject all exit proofs, so this does not provide a system-wide escape hatch.',
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_WITHDRAWAL('zk'),
        description:
          'Users initiate withdrawals through regular ApeX transactions. After the block is proven, synchronized across the participating deployments, and executed, the user can claim funds from the zkLink escrow on the chain where the assets are held.',
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
    ],
    otherConsiderations: [
      {
        name: 'Multichain state synchronization',
        description:
          'Deposits remain escrowed in the zkLink contract on their origin chain. Secondary deployments send synchronization hashes through LayerZero to the primary deployment on Arbitrum One. The primary deployment only synchronizes a block when the received hashes match the hashes committed as part of the primary block, and then sends block confirmations back to the secondary deployments.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the 2/2 validator set or LayerZero bridge forges a non-existent deposit.',
          },
          {
            category: 'Funds can be frozen if',
            text: 'cross-chain synchronization messages are not delivered.',
          },
        ],
        references: [],
      },
    ],
  },
  upgradesAndGovernance: {
    content:
      'The zkLink and verifier deployments can be upgraded by their respective 4-of-6 network governor multisigs without a delay. The network governors can also manage validators, tokens, and synchronization services.',
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    zkVerifiers: [discovery.getContract('Verifier').address],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  milestones: [
    {
      title: 'ApeX Pro sunset',
      date: '2025-02-27T00:00:00Z',
      url: 'https://www.apex.exchange/blog/detail/ApeX-Pro-Sunset-Delisting-Timeline-for-Trading-Pairs',
      description:
        'ApeX Pro StarkEx chain is discontinuied in favor of zkLink X stack chain.',
      type: 'general',
    },
    {
      title: 'ApeX Omni launched on zkLink X',
      date: '2024-06-10T00:00:00Z',
      url: 'https://www.apex.exchange/blog/detail/ApeX-Omni-zkLink-Elevating-Multi-chain-Liquidity-Trading-via-zkLink-X',
      description:
        'A launch of ApeX Omni chain build on zkLink X stack is announced.',
      type: 'general',
    },
    {
      title: 'ApeX Pro public beta launched',
      date: '2022-11-21T00:00:00Z',
      url: 'https://twitter.com/officialapexdex/status/1564917523401052162?s=21&t=c-SqpS1PL2KOns-2K7myJA',
      description:
        'ApeX Pro beta is launched, with incentives program for users.',
      type: 'general',
    },
    {
      title: 'ApeX Pro live on Mainnet',
      date: '2022-08-31T00:00:00Z',
      url: 'https://twitter.com/officialapexdex/status/1594722304537288706?s=21&t=c-SqpS1PL2KOns-2K7myJA',
      description:
        'ApeX Pro, a non-custodial decentralized exchange is now live on Mainnet.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
