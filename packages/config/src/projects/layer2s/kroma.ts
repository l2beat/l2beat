import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  NUGGETS,
  OPERATOR,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ESCROW } from '../../common'
import { formatChallengePeriod } from '../../common/formatDelays'
import { RISK_VIEW } from '../../common/riskView'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../discovery/values/hardcoded'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { getStage } from './common/stages/getStage'

const discovery = new ProjectDiscovery('kroma')

const proposerRoundDurationSecondsOLD = discovery.getContractValue<number>(
  'ValidatorPool',
  'ROUND_DURATION',
)

const proposerRoundDurationSeconds = discovery.getContractValue<number>(
  'ValidatorManager',
  'ROUND_DURATION_SECONDS',
)

const rootsSubmissionIntervalBlocks = discovery.getContractValue<number>(
  'L2OutputOracle',
  'SUBMISSION_INTERVAL',
)

const scPA = discovery.getContractValue<string>('SC_ProxyAdmin', 'owner')
const shPA = discovery.getContractValue<string>('SH_ProxyAdmin', 'owner')
const spETHPA = discovery.getContractValue<string>('spETH_ProxyAdmin', 'owner')
assert(
  scPA === shPA && shPA === spETHPA,
  'Spectrum EOA Admin permission changed, please update the .ts file.',
)

const rootsSubmissionIntervalSeconds = rootsSubmissionIntervalBlocks * 2 // L2 block time

const timelockDefaultDelay = discovery.getContractValue<number>(
  'Timelock',
  'getMinDelay',
)

const upgradesProxy = {
  upgradableBy: [
    { name: 'SecurityCouncil', delay: formatSeconds(timelockDefaultDelay) },
  ],
}

const SCNumConfirmationsRequired = discovery.getContractValue<number>(
  'SecurityCouncil',
  'quorum',
)

const SCMembers = discovery.getPermissionedAccounts(
  'SecurityCouncilToken',
  'tokenOwners',
)

const finalizationPeriod = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

const SCMembersSize = SCMembers.length

const SCThreshold = `${SCNumConfirmationsRequired} / ${SCMembersSize}`

export const kroma: Layer2 = {
  type: 'layer2',
  id: ProjectId('kroma'),
  addedAt: new UnixTime(1686820004), // 2023-06-15T09:06:44Z
  capability: 'universal',
  badges: [
    Badge.VM.EVM,
    Badge.DA.EthereumBlobs,
    Badge.Stack.OPStack,
    Badge.Infra.Superchain,
  ],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Kroma',
    slug: 'kroma',
    description:
      'Kroma aims to develop an universal ZK Rollup based on the Optimism Bedrock architecture. Currently, Kroma operates as an Optimistic Rollup with ZK fault proofs, utilizing a zkEVM based on Scroll.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://kroma.network/'],
      apps: ['https://kroma.network/bridge/'],
      documentation: [
        'https://docs.kroma.network/',
        'https://specs.kroma.network/',
      ],
      explorers: [
        'https://kromascan.com/',
        'https://blockscout.kroma.network/',
      ],
      repositories: ['https://github.com/kroma-network/'],
      socialMedia: [
        'https://discord.com/invite/kroma-network',
        'https://twitter.com/kroma_network',
        'https://medium.com/@kroma-network',
      ],
    },
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Kroma is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.KROMA.SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root gets finalized ${formatSeconds(
        finalizationPeriod,
      )} after it has been posted.`,
    },
    finality: {
      warnings: {
        timeToInclusion: {
          sentiment: 'neutral',
          value:
            "It's assumed that transaction data batches are submitted sequentially.",
        },
      },
      finalizationPeriod,
    },
  },
  chainConfig: {
    name: 'kroma',
    chainId: 255,
    coingeckoPlatform: 'kroma',
    explorerUrl: 'https://kromascan.com',
    explorerApi: {
      url: 'https://api.kromascan.com/api',
      type: 'etherscan',
    },
    multicallContracts: [],
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-09-05T03:00:00Z')),
  },
  config: {
    associatedTokens: ['KRO'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x31F648572b67e60Ec6eb8E197E1848CC5F5558de'),
        sinceTimestamp: new UnixTime(1693880555),
        tokens: ['ETH'],
        description: 'Main entry point for users depositing ETH.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x827962404D7104202C5aaa6b929115C8211d9596'),
        sinceTimestamp: new UnixTime(1693880555),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 token that do not require custom gateway.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e'),
        sinceTimestamp: new UnixTime(1700122827),
        tokens: ['USDC'],
        ...ESCROW.CANONICAL_EXTERNAL,
        description: 'Main entry point for users depositing USDC.',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://api.kroma.network',
      defaultCallsPerMinute: 1500,
      startBlock: 1,
      adjustCount: { type: 'SubtractOne' },
    },
    daTracking: {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 0, // Edge Case: config added @ DA Module start
      inbox: '0xfF00000000000000000000000000000000000255',
      sequencers: ['0x41b8cD6791De4D8f9E0eaF7861aC506822AdcE12'],
    },
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'transfer',
          from: EthereumAddress(
            discovery.getContractValue('SystemConfig', 'batcherHash'),
          ),
          to: EthereumAddress(
            discovery.getContractValue('SystemConfig', 'sequencerInbox'),
          ),
          sinceTimestamp: new UnixTime(1693883663),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6',
          ),
          selector: '0x5a045f78',
          functionSignature:
            'function submitL2Output(bytes32 _outputRoot,uint256 _l2BlockNumber,bytes32 _l1BlockHash,uint256 _l1BlockNumber)',
          sinceTimestamp: new UnixTime(1693880579),
        },
      },
    ],
    finality: {
      type: 'OPStack',
      // timestamp of the first blob tx
      minTimestamp: new UnixTime(1714032407),
      l2BlockTimeSeconds: 2,
      genesisTimestamp: new UnixTime(1693880389),
      lag: 0,
      stateUpdate: 'disabled',
    },
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_FP_INT_ZK,
      description:
        RISK_VIEW.STATE_FP_INT_ZK.description +
        " The challenge protocol can be subject to delay attacks and can fail under certain conditions. The current system doesn't use posted L2 txs batches on L1 as inputs to prove a fault, meaning that DA is not enforced.",
      sentiment: 'bad',
      secondLine: formatChallengePeriod(finalizationPeriod),
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(timelockDefaultDelay, finalizationPeriod),
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
      HARDCODED.KROMA.SEQUENCING_WINDOW_SECONDS,
    ),
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_ROOTS,
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        principle: false,
        stateVerificationOnL1: false,
        fraudProofSystemAtLeast5Outsiders: true,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: true,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: true,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/kroma-network/kroma',
    },
  ),
  technology: {
    stateCorrectness: {
      name: 'Fraud Proofs ensure state correctness',
      description:
        'Kroma uses an interactive fraud proof system to find a single block of disagreement, which is then ZK proven. The zkEVM used is based on Scroll.\
        Once the single block of disagreement is found, the challenger is required to present a ZK proof of the fraud. If the proof is validated, the incorrect\
        state output is deleted. The Security Council can always override the result of the challenge, it can also delete any L2 state root at any time. If\
        the malicious attester and challenger collude and are willing to spend bonds, they can perform a delay attack by engaging in continuous challenges\
        resulting in a lack of finalization of the L2 state root on L1. The protocol can also fail under certain conditions.',
      references: [
        {
          title:
            'Colosseum.sol#L300 - Etherscan source code, createChallenge function',
          url: 'https://etherscan.io/address/0xAB54b3e775f645cf4486039bfA4dA539E70c9f99#code#F1#L437',
        },
        {
          title: 'Colosseum.sol#L378 - Etherscan source code, bisect function',
          url: 'https://etherscan.io/address/0xAB54b3e775f645cf4486039bfA4dA539E70c9f99#code#F1#L514',
        },
        {
          title:
            'Colosseum.sol#L434 - Etherscan source code, proveFault function',
          url: 'https://etherscan.io/address/0xAB54b3e775f645cf4486039bfA4dA539E70c9f99#code#F1#L570',
        },
        {
          title:
            'KROMA-020: lack of validation segments and proofs in Colosseum.sol - ChainLight security audit',
          url: 'https://drive.google.com/file/d/13TUxZ9KPyvUXNZGddALcJLin-xmp_Fkj/view',
        },
      ],
      risks: [
        {
          category: 'Withdrawals can be delayed if',
          text: 'the fraud proof system is under a delay attack.',
        },
        {
          category: 'Funds can be lost if',
          text: 'the cryptography is broken or implemented incorrectly.',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          title: 'Derivation: Batch Submission - Kroma specs',
          url: 'https://specs.kroma.network/glossary.html#batch-submission',
        },
        {
          title: 'BatchInbox - Etherscan address',
          url: 'https://etherscan.io/address/0xff00000000000000000000000000000000000255',
        },
        {
          title:
            'KromaPortal.sol#L430 - Etherscan source code, depositTransaction function',
          url: 'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#L430',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_SEQUENCER,
      references: [
        {
          title: 'SystemConfig - batcher address',
          url: 'https://etherscan.io/address/0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35#readProxyContract#F3',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract'),
      references: [
        {
          title: 'Sequencing Window - Kroma specs',
          url: 'https://specs.kroma.network/glossary.html#sequencing-window',
        },
        {
          title:
            'KromaPortal.sol#430 - Etherscan source code, depositTransaction function',
          url: 'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#L430',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_MESSAGING('optimistic', finalizationPeriod),
        references: [
          {
            title:
              'KromaPortal.sol#L241 - Etherscan source code, proveWithdrawalTransaction function',
            url: 'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#L241',
          },
          {
            title:
              'KromaPortal.sol#L324 - Etherscan source code, finalizeWithdrawalTransaction function',
            url: 'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#L324',
          },
        ],
      },
      EXITS.AUTONOMOUS,
    ],
    otherConsiderations: [
      {
        name: 'EVM compatible smart contracts are supported',
        description:
          'OP stack chains are pursuing the EVM Equivalence model. No changes to smart contracts are required regardless of the language they are written in, i.e. anything deployed on L1 can be deployed on L2.',
        risks: [],
        references: [
          {
            title: 'Introducing EVM Equivalence',
            url: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
          },
        ],
      },
    ],
  },
  stateDerivation: {
    nodeSoftware:
      'Kroma nodes source code, including full node, proposer and validator, can be found [here](https://github.com/kroma-network/kroma). Also, the geth server, source maintained [here](https://github.com/kroma-network/go-ethereum), is a fork of go-ethereum. For more details on how they are different from the Optimism implementation, see [here](https://github.com/kroma-network/kroma-specs/blob/main/specs/protocol/differences-from-optimism.md).' +
      '\n' +
      'The instructions to run the proposer (called validator) and the ZK prover, are documented [here](https://docs.kroma.network/developers/running-nodes-on-kroma).',
    compressionScheme:
      'Data batches are compressed using the [zlib](https://github.com/madler/zlib) algorithm with best compression level.',
    genesisState:
      'The genesis file can be found [here](https://github.com/kroma-network/kroma-up/blob/main/config/mainnet/genesis.json).',
    dataFormat:
      'L2 blocks derivation from L1 data plus the format and architecture of batch submission is documented [here](https://specs.kroma.network/protocol/rollup-node.html#derivation).',
  },
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getPermissionDetails(
          'Spectrum EOA Admin',
          discovery.getPermissionedAccounts('SC_ProxyAdmin', 'owner'),
          'Can upgrade all Spectrum-related contracts and potentially gain access to all escrowed weETH.',
        ),
        discovery.getPermissionDetails(
          'SecurityCouncil',
          discovery.getPermissionedAccounts('Colosseum', 'SECURITY_COUNCIL'),
          `MultiSig (currently ${SCThreshold}) that is a guardian of KromaPortal, privileged Validator that does not need a bond \
        and privileged actor in Colosseum contract that can remove any L2Output state root regardless of the outcome of the challenge.`,
        ),
        discovery.getPermissionDetails(
          'SecurityCouncil members',
          SCMembers,
          `Members of the SecurityCouncil.`,
          {
            references: [
              {
                title:
                  'Security Council members - Announcing Kroma Security Council',
                url: 'https://blog.kroma.network/announcing-kroma-security-council-435b540d2ab4',
              },
            ],
          },
        ),
        discovery.getPermissionDetails(
          'Sequencer',
          discovery.getPermissionedAccounts('SystemConfig', 'batcherHash'),
          'Central actor allowed to commit L2 transactions on L1.',
        ),
        discovery.getPermissionDetails(
          'Guardian',
          discovery.getPermissionedAccounts('KromaPortal', 'GUARDIAN'),
          'Actor allowed to pause withdrawals. Currently set to the Security Council.',
        ),
        discovery.getMultisigPermission(
          'KromaRewardVaultMultisig',
          'Escrows a pool of KRO used as validator rewards by the AssetManager.',
        ),
      ],
    },
  },
  contracts: {
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails('L2OutputOracle', {
          description: `The L2OutputOracle contract contains a list of proposed state roots which Proposers assert to be a result of block execution. Anyone can participate as a Proposer by depositing in the ValidatorPool. A root can be proposed every ${formatSeconds(
            rootsSubmissionIntervalSeconds,
          )}.`,
          ...upgradesProxy,
        }),
        discovery.getContractDetails('KromaPortal', {
          description:
            'The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.',
          ...upgradesProxy,
        }),
        discovery.getContractDetails('SystemConfig', {
          description:
            'It contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.',
          ...upgradesProxy,
        }),
        discovery.getContractDetails('L1ERC721Bridge', {
          description:
            'The L1ERC721Bridge contract is the main entry point to deposit ERC721 tokens from L1 to L2.',
          ...upgradesProxy,
        }),
        discovery.getContractDetails('L1CrossDomainMessenger', {
          description:
            "The L1 Cross Domain Messenger contract sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.",
          ...upgradesProxy,
        }),
        discovery.getContractDetails('Timelock', {
          description: `Timelock contract behind which the ProxyAdmin is. There is a ${formatSeconds(
            timelockDefaultDelay,
          )} delay.`,
        }),
        discovery.getContractDetails('SecurityCouncil', {
          description:
            'Contract allowed to start upgrades, dismiss challenges and delete roots. It is also designated as a guardian, meaning it can pause withdrawals.',
          ...upgradesProxy,
        }),
        discovery.getContractDetails('UpgradeGovernor', {
          description:
            'Controls the Timelock. It is governed using a Soulbound NFT.',
        }),
        discovery.getContractDetails('ProxyAdmin', {
          description:
            "Admin of the L2OutputOracle, Timelock, KromaPortal, SystemConfig, SecurityCouncil, L1CrossDomainMessenger, L1ERC721Bridge, ZKVerifier, Colosseum, L1StandardBridge, UpgradeGovernor, SecurityCouncilToken, ValidatorPool proxies. It's effectively controlled by the Security Council. The proxy is behind a Timelock.",
        }),
        discovery.getContractDetails('Colosseum', {
          description:
            'Contract used to challenge state roots and prove fraud. The SecurityCouncil can interfere by deleting challenges and roots.',
          ...upgradesProxy,
        }),
        discovery.getContractDetails('ValidatorPool', {
          description: `Contract used to manage the Proposers. Anyone can submit a deposit and bond to a state root, or create a challenge. It also manages the Proposer rotation for each submittable block using a random selection. If the selected proposer fails to publish a root within ${formatSeconds(
            proposerRoundDurationSecondsOLD,
          )}, then the submission becomes open to everyone.`,
          ...upgradesProxy,
        }),
        discovery.getContractDetails('ValidatorManager', {
          description: `Manages the set of Proposers (Validators in Kroma) and selects the next proposer with the window to submit the output root within ${formatSeconds(proposerRoundDurationSeconds)}, after which anyone propose for them. It is also the entry point for other contracts, such as the L2OutputOracle and the Colosseum, which distribute output rewards and slash challenge losers. It makes successive calls to the AssetManager to apply changes to the proposers' assets.`,
          ...upgradesProxy,
        }),
        discovery.getContractDetails('AssetManager', {
          description:
            'Manages the delegation and undelegation of KRO tokens and Kroma Guardian House (KGH) NFTs for Proposers (Kroma Validators) and distributes rewards.',
          ...upgradesProxy,
        }),
        discovery.getContractDetails('ZKMerkleTrie', {
          description: 'Trie contract used to prove withdrawals.',
        }),
        discovery.getContractDetails('ZKVerifier', {
          description:
            'ZK verifier used to verify the last step of a fraud proof, which corresponds to a block.',
          ...upgradesProxy,
        }),
        discovery.getContractDetails('Poseidon2', {
          description:
            'Contract used to compute hashes. It is used by the ZKMerkeTrie. The contract has been generated using the circomlibjs library.',
        }),
      ],
    },
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_RISK(formatSeconds(timelockDefaultDelay)),
    ],
  },
  milestones: [
    {
      title: 'Chain fork #2 - Output root replaced',
      url: 'https://x.com/kroma_network/status/1774683208753590506',
      date: '2024-04-05T00:00:00Z',
      description:
        'The chain forked and an L2 output on Ethereum has to be replaced by the Security Council.',
      type: 'incident',
    },
    {
      title: 'Chain fork - Output root replaced',
      url: 'https://x.com/kroma_network/status/1767478100819153009',
      date: '2024-03-18T00:00:00Z',
      description:
        'The chain forked and an L2 output on Ethereum has to be replaced by the Security Council.',
      type: 'incident',
    },
    {
      title: 'Ecotone upgrade',
      url: 'https://twitter.com/kroma_network/status/1783410075346063564',
      date: '2024-04-25T00:00:00.00Z',
      description:
        'Introduces EIP-4844 data blobs for L1 data availability and more L2 opcodes.',
      type: 'general',
    },
    {
      title: 'Kroma Mainnet Launch',
      url: 'https://twitter.com/kroma_network/status/1699267271968055305?s=20',
      date: '2023-09-06T00:00:00Z',
      description: 'Kroma is live on mainnet.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Kroma’s Road to Stage 2',
      url: 'https://blog.kroma.network/kromas-road-to-stage-2-0c02e41d8c99',
      thumbnail: NUGGETS.THUMBNAILS.KROMA_01,
    },
  ],
}
