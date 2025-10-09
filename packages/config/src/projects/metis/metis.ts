import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
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
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('metis')

const blobBatcher = discovery.getContractValue<string>(
  'MVM_InboxSenderManager',
  'blobBatcher',
)

const inboxAddress = discovery.getContractValue<string>(
  'Lib_AddressManager',
  'inboxAddress',
)

const stateCommitmentChain = discovery.getContract('StateCommitmentChain')

const upgradeDelay = 0

const CHALLENGE_PERIOD_SECONDS = discovery.getContractValue<number>(
  'StateCommitmentChain',
  'FRAUD_PROOF_WINDOW',
)

const DISPUTE_TIMEOUT_PERIOD = discovery.getContractValue<number>(
  'DisputeGameFactory',
  'DISPUTE_TIMEOUT_PERIOD',
)

const disputeGameBond = discovery.getContractValue<number[]>(
  'DisputeGameFactory',
  'initBonds',
)[0]

export const metis: ScalingProject = {
  type: 'layer2',
  id: ProjectId('metis'),
  capability: 'universal',
  addedAt: UnixTime(1637945259), // 2021-11-26T16:47:39Z
  badges: [BADGES.VM.EVM, BADGES.Fork.OVM, BADGES.DA.EthereumBlobs],
  reasonsForBeingOther: [
    {
      ...REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
      explanation:
        'The current proof system is forked from the standard permissionless OP stack proof system. Importantly, new state root proposals do not create new dispute games and although challenge requests can be made by any bonded user, creating dispute games (creator role) and deleting a state root (state deleter role) after winning a challenge is not permissionless.',
    },
  ],
  display: {
    name: 'Metis Andromeda',
    shortName: 'Metis',
    slug: 'metis',
    description:
      'Metis Andromeda is an EVM-equivalent solution originally forked from Optimism OVM. It uses a decentralized Sequencer pool running Tendermint consensus and MPC module to sign transaction batches.',
    purposes: ['Universal'],
    stacks: ['OVM'],
    links: {
      websites: ['https://metis.io'],
      bridges: ['https://bridge.metis.io'],
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
  proofSystem: {
    type: 'Optimistic',
    name: 'OPFP',
    challengeProtocol: 'Interactive',
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: 'UnderReview',
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
      },
      stage1: {
        principle: false,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: true,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/MetisProtocol/mvm',
      securityCouncilReference:
        'https://docs.metis.io/andromeda/network/council',
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
        callsPerMinute: 300,
      },
      {
        type: 'blockscout',
        url: 'https://andromeda-explorer.metis.io/api',
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
        inbox: EthereumAddress('0xFf00000000000000000000000000000000001088'),
        sequencers: [
          EthereumAddress('0xae4d46bd9117cb017c5185844699c51107cb28a9'),
        ],
      },
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'transfer',
          from: ChainSpecificAddress.address(ChainSpecificAddress(blobBatcher)),
          to: ChainSpecificAddress.address(ChainSpecificAddress(inboxAddress)),
          sinceTimestamp: UnixTime(1747234799),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: ChainSpecificAddress.address(stateCommitmentChain.address),
          selector: '0x5b297172',
          functionSignature:
            'function appendStateBatch(bytes32[] _batch, uint256 _shouldStartAtElement, bytes32 _lastBatchBlockHash, uint256 _lastBatchBlockNumber)',
          sinceTimestamp: UnixTime(1710992939),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          // this query assumes that the chain id used is always metis' chain id (1088)
          formula: 'functionCall',
          address: ChainSpecificAddress.address(stateCommitmentChain.address),
          selector: '0x0a17d699',
          functionSignature:
            'function appendStateBatchByChainId(uint256 _chainId, bytes32[] _batch, uint256 _shouldStartAtElement, string _proposer, bytes32 _lastBatchBlockHash, uint256 _lastBatchBlockNumber)',
          sinceTimestamp: UnixTime(1710992939),
        },
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
      ...RISK_VIEW.STATE_FP_INT(CHALLENGE_PERIOD_SECONDS),
      description:
        RISK_VIEW.STATE_FP_INT().description +
        'Anyone can submit challenge requests. However, permissioned actors are needed to create the challenge and to delete successfully disputed state roots. Additionally, the current permissioned actors (GameCreator and Security Council minority) can collude and finalize malicious state roots.',
      sentiment: 'bad',
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_NO_MECHANISM(),
      description:
        RISK_VIEW.SEQUENCER_NO_MECHANISM().description +
        ' The single address acting as a sequencer on L1 is not trustlessly linkable to the claim of multiple decentralized sequencers being used.',
    },
    proposerFailure: RISK_VIEW.PROPOSER_WHITELIST_SECURITY_COUNCIL('METIS'),
  },
  stateValidation: {
    categories: [
      {
        title: 'State root proposals',
        description:
          'Dispute game contracts for state validation are deployed but not used to propose state roots as in standard OP Stack chains. Instead, the permissioned proposer submits state roots through the appendStateBatch function in the `StateCommitmentChain` contract. A state root gets confirmed if the challenge period has passed and the state batch is not disputed.',
        references: [
          {
            title: 'StateCommitmentChain - Etherscan source code',
            url: 'https://etherscan.io/address/0xA738573Ec0FD7959BfA60Aaa8a23Fe7BEC6c4Bd7#code',
          },
        ],
      },
      {
        title: 'Challenges',
        description: `Games can only be created on demand by the permissioned GameCreator should a dispute be requested. Users can signal the need for a dispute by bonding ${formatEther(disputeGameBond)} METIS and calling the dispute() function of the \`DisputeGameFactory\`. If a game is not created by the \`GameCreator\` within the dispute timeout period of ${formatSeconds(
          DISPUTE_TIMEOUT_PERIOD,
        )}, anyone can call \`disputeTimeout()\`. This function calls \`saveDisputedBatchTimeout()\` on the \`StateCommitmentChain\`, which marks the batch as disputed. This blocks L2->L1 messaging and withdrawals for the disputed batch and any subsequent batches until the dispute is deleted. Should a game be created and resolved, disputed state batches can be marked as such in the \`StateCommitmentChain\`. Then, these flagged batches can be deleted (within the fraud proof window). Batches can only be deleted by the MVM_Fraud_Verifier contract address, which currently corresponds to the \`Metis Security Council\` minority.`,
        risks: [
          {
            category: 'Funds can be frozen if',
            text: 'an invalid state root is successfully disputed but it is not deleted by the permissioned MVM_Fraud_Verifier (Metis Security Council minority).',
          },
          {
            category: 'Funds can be stolen if',
            text: 'the GameCreator colludes with the StateDeleter to block Challenges in the proof system.',
            isCritical: true,
          },
        ],
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
          url: 'https://docs.metis.io/andromeda/sequencer/architecture/mpc',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
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
            title: 'Transaction finality - Metis documentation',
            url: 'https://docs.metis.io/andromeda/sequencer/architecture/transaction',
          },
        ],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
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
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: discovery.getDiscoveredContracts(),
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
      url: 'https://etherscan.io/tx/0x4dbb3a65f411b2319dc5c824804a6593d6bf6b482a76493e9089e1e055267123',
      date: '2023-03-15T00:00:00Z',
      description:
        'Hashes to data blobs are now posted to EOA address instead of CanonicalTransactionChain contract.',
      type: 'general',
    },
    {
      title: 'Metis starts using blobs',
      url: 'https://etherscan.io/tx/0x1c28c8e7b89c5da880a52c3e4e4ca6da332816e72c0600d55c18479be897c8b7',
      date: '2025-05-13T00:00:00Z',
      description: 'Permissioned batcher is posting blobs to the inbox.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
