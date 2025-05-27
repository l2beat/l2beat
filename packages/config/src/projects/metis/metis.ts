import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { formatChallengePeriod } from '../../common/formatDelays'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'

const discovery = new ProjectDiscovery('metis')

const upgradeDelay = 0

const CHALLENGE_PERIOD_SECONDS = discovery.getContractValue<number>(
  'StateCommitmentChain',
  'FRAUD_PROOF_WINDOW',
)

export const metis: ScalingProject = {
  type: 'layer2',
  id: ProjectId('metis'),
  capability: 'universal',
  addedAt: UnixTime(1637945259), // 2021-11-26T16:47:39Z
  badges: [BADGES.VM.EVM, BADGES.Fork.OVM, BADGES.DA.EthereumBlobs],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Metis Andromeda',
    shortName: 'Metis',
    slug: 'metis',
    description:
      'Metis Andromeda is an EVM-equivalent solution originally forked from Optimism OVM. It uses a decentralized Sequencer pool running Tendermint consensus and MPC module to sign transaction batches.',
    purposes: ['Universal'],
    stack: 'OVM',
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://metis.io'],
      apps: ['https://bridge.metis.io'],
      documentation: ['https://docs.metis.io'],
      explorers: [
        'https://andromeda-explorer.metis.io',
        'https://explorer.metis.io',
      ],
      repositories: ['https://github.com/MetisProtocol'],
      socialMedia: [
        'https://metisl2.medium.com/',
        'https://twitter.com/MetisL2',
        'https://discord.com/invite/metis',
        'https://youtube.com/@Metis_L2',
        'https://t.me/MetisL2',
        'https://instagram.com/metisl2/',
      ],
    },
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: 'UnderReview',
      },
      stage1: {
        principle: false,
        stateVerificationOnL1: false,
        fraudProofSystemAtLeast5Outsiders: null,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: false,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/MetisProtocol/mvm',
    },
  ),
  chainConfig: {
    name: 'metis',
    chainId: 1088,
    gasTokens: ['METIS'],
    explorerUrl: 'https://explorer.metis.io',
    sinceTimestamp: UnixTime.fromDate(new Date('2021-11-18T21:19:39Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 2338552,
        version: '3',
        // TODO: fix this
        isNativeBalanceSupported: false,
      },
    ],
    coingeckoPlatform: 'metis',
    apis: [
      {
        type: 'rpc',
        url: 'https://andromeda.metis.io/',
        callsPerMinute: 1500,
      },
      {
        type: 'routescan',
        url: 'https://api.routescan.io/v2/network/mainnet/evm/1088/etherscan/api',
      },
    ],
  },
  config: {
    associatedTokens: ['Metis'],
    escrows: [
      {
        address: EthereumAddress('0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b'),
        sinceTimestamp: UnixTime(1637077208),
        tokens: '*',
        chain: 'ethereum',
        premintedTokens: ['Metis'],
      },
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 22472728,
        inbox: '0xFf00000000000000000000000000000000001088',
        sequencers: ['0xae4d46bd9117cb017c5185844699c51107cb28a9'],
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_FP_INT,
      description:
        RISK_VIEW.STATE_FP_INT.description +
        ` Only one entity is currently allowed to propose and submit challenges, as only permissioned games are currently allowed.`,
      sentiment: 'bad',
      secondLine: formatChallengePeriod(CHALLENGE_PERIOD_SECONDS),
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_ENQUEUE_VIA('L1'),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stateValidation: {
    categories: [
      {
        title: 'State root proposals',
        description:
          'Dispute game contracts for state validation are deployed but not used to propose state roots as in standard OP Stack chains. Instead, proposers submit state roots through the appendStateBatch function in the `StateCommitmentChain` contract. A state root gets confirmed if the challenge period has passed and the state batch is not disputed.',
        references: [
          {
            title: 'StateCommitmentChain - Etherscan source code',
            url: 'https://etherscan.io/address/0xe6e2dff51b039c8eff0b21880e2fb008af10b365#code',
          },
        ],
      },
      {
        title: 'Challenges',
        description:
          'Games are created on demand by the permissioned `GameCreator` should a dispute arise. Once resolved, disputed state batches can be marked as such in the `StateCommitmentChain`. Then, these flagged batches can be deleted (within the fraud proof window). Batches can only be deleted from the MVM_Verifier contract address, which currently corresponds to the `Metis Multisig`.',
        risks: [],
        references: [
          {
            title:
              'DisputeGameFactory - No games are created to propose state roots',
            url: 'https://etherscan.io/address/0x1C2f0A08762f0aD4598fB5de8f9D6626a4e4aeE3',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
      description:
        'Transaction data is posted to Ethereum using blobs. Initially, data was posted to the CanonicalTransactionChain contract, then it moved to just posting hashes to an EOA address, and as of May 2025, the system uses blobs for data availability.',
      risks: [],
      references: [
        {
          title: 'Blobs batcher - Metis source code',
          url: 'https://github.com/MetisProtocol/mvm/blob/e816c6c461a8e91db3a9ccaa33d2d0f6a60633d5/go/op-program/chainconfig/rollupcfg.go#L85',
        },
      ],
    },
    operator: {
      name: 'The system has a decentralized sequencer set',
      description:
        'As of April 2024 Metis uses a permissioned sequencer pool running a Tendermint consensus. Once consensus is reached on a block, an MPC address is used to submit a block hash to Ethereum. The infrastructure to manage the MPC is offchain and not trustless because Ethereum does not verify the validity of MPC address.',
      risks: [FRONTRUNNING_RISK],
      references: [
        {
          title: 'Decentralized Sequencer - Metis documentation',
          url: 'https://docs.metis.io/dev/decentralized-sequencer/overview',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.ENQUEUE,
      references: [
        {
          title: 'CanonicalTransactionChain - Etherscan source code',
          url: 'https://etherscan.io/address/0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9#code',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_MESSAGING('optimistic'),
        references: [
          {
            title: 'Withdrawing from Metis - Metis documentation',
            url: 'https://docs.metis.io/building-on-metis/metis-bridge#withdrawing-from-metis',
          },
        ],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
      EXITS.FORCED_MESSAGING('forced-messages'),
    ],
    otherConsiderations: [
      {
        name: 'EVM compatible smart contracts are supported',
        description:
          'Metis uses the Optimistic Virtual Machine (OVM) 2.0 to execute transactions.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'there are mistakes in the highly complex OVM implementation.',
          },
        ],
        references: [
          {
            title: 'MVM repository - Metis source code',
            url: 'https://github.com/MetisProtocol/mvm',
          },
        ],
      },
    ],
  },
  permissions: {
    [discovery.chain]: discovery.getDiscoveredPermissions(),
  },
  contracts: {
    addresses: {
      [discovery.chain]: discovery.getDiscoveredContracts(),
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://metisdao.medium.com/metis-to-launch-andromeda-honoring-our-commitment-to-decentralization-fa2d03394398',
      date: '2021-11-19T00:00:00Z',
      description:
        'Public launch of Metis Layer 2 Andromeda, based on the Optimism codebase.',
      type: 'general',
    },
    {
      title: 'Data availability change',
      url: 'https://metisdao.medium.com/decentralized-storage-goes-live-da876dc6eb70',
      date: '2022-04-12T00:00:00Z',
      description: 'Update moving data to an off-chain committee.',
      type: 'general',
    },
    {
      title: 'Data hashes posted to EOA',
      url: 'https://etherscan.io/address/0xFf00000000000000000000000000000000001088',
      date: '2023-03-15T00:00:00Z',
      description:
        'Hashes to data blobs are now posted to EOA address instead of CanonicalTransactionChain contract.',
      type: 'general',
    },
    {
      title: 'Metis starts using blobs',
      url: 'https://etherscan.io/address/0xFf00000000000000000000000000000000001088',
      date: '2025-05-13T00:00:00Z',
      description: 'Permissioned batcher is posting blobs to the inbox.',
      type: 'general',
    },
  ],
}
