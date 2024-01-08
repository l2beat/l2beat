import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NUGGETS,
  OPERATOR,
} from '../common'
import { subtractOne } from '../common/assessCount'
import { RISK_VIEW } from '../common/riskView'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import { formatSeconds } from '../utils/formatSeconds'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('kroma')

const proposerRoundDurationSeconds = discovery.getContractValue<number>(
  'ValidatorPool',
  'ROUND_DURATION',
)

const rootsSubmissionIntervalBlocks = discovery.getContractValue<number>(
  'L2OutputOracle',
  'SUBMISSION_INTERVAL',
)

const rootsSubmissionIntervalSeconds = rootsSubmissionIntervalBlocks * 2 // L2 block time

const timelockDefaultDelay = discovery.getContractValue<number>(
  'Timelock',
  'getMinDelay',
)

const upgradesProxy = {
  upgradableBy: ['SecurityCouncil'],
  upgradeDelay: `${formatSeconds(timelockDefaultDelay)} delay`,
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
  display: {
    name: 'Kroma',
    slug: 'kroma',
    description:
      "Kroma aims to develop an universal ZK Rollup based on the Optimism Bedrock architecture. \
            Currently, Kroma operates as an Optimistic Rollup with ZK fault proofs, utilizing a zkEVM based on Scroll. \
            Kroma's goal is to eventually transition to a ZK Rollup once the generation of ZK proofs becomes more cost-efficient and faster.",
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'OP Stack',
    links: {
      websites: ['https://kroma.network/'],
      apps: ['https://kroma.network/bridge/'],
      documentation: [
        'https://docs.kroma.network/',
        'https://github.com/kroma-network/kroma/tree/dev/specs',
      ],
      explorers: [
        'https://kromascan.com/',
        'https://blockscout.kroma.network/',
      ],
      repositories: ['https://github.com/kroma-network/'],
      socialMedia: [
        'https://discord.gg/kroma',
        'https://twitter.com/kroma_network',
        'https://medium.com/@kroma-network',
      ],
    },
    activityDataSource: 'Blockchain RPC',
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
  },
  config: {
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
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      url: 'https://api.kroma.network',
      callsPerMinute: 1500,
      assessCount: subtractOne,
    },
    liveness: {
      proofSubmissions: [],
      batchSubmissions: [
        {
          formula: 'transfer',
          from: EthereumAddress('0x41b8cD6791De4D8f9E0eaF7861aC506822AdcE12'),
          to: EthereumAddress('0xfF00000000000000000000000000000000000255'),
          sinceTimestamp: new UnixTime(1693883663),
        },
      ],
      stateUpdates: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6',
          ),
          selector: '0x5a045f78',
          functionSignature:
            'function submitL2Output(bytes32 _outputRoot,uint256 _l2BlockNumber,bytes32 _l1BlockHash,uint256 _l1BlockNumber)',
          sinceTimestamp: new UnixTime(1693880579),
        },
      ],
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_FP_INT_ZK,
      description:
        RISK_VIEW.STATE_FP_INT_ZK.description +
        " The challenge protocol can be subject to delay attacks and can fail under certain conditions. The current system doesn't use posted L2 txs batches on L1 as inputs to prove a fault, meaning that DA is not enforced.",
      sentiment: 'warning',
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'KromaPortal',
          references: [
            'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#430',
          ],
        },
      ],
    },
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW(timelockDefaultDelay, finalizationPeriod),
      sources: [
        {
          contract: 'KromaPortal',
          references: [
            'https://etherscan.io/address/0x31F648572b67e60Ec6eb8E197E1848CC5F5558de',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        HARDCODED.KROMA.SEQUENCING_WINDOW_SECONDS,
      ),
      sources: [
        {
          contract: 'KromaPortal',
          references: [
            'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#430',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_SELF_PROPOSE_ROOTS,
      sources: [
        {
          contract: 'L2OutputOracle',
          references: [
            'https://etherscan.io/address/0x14126FFa3889a026A79F0f99FaE80B3dc9E38095#code#F1#L197',
          ],
        },
      ],
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        stateVerificationOnL1: false,
        fraudProofSystemAtLeast5Outsiders: true,
        usersHave7DaysToExit: true,
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
        Once the single block of disagreement is found, the challenger is required to present ZK proof of the fraud. When the proof is validated, the incorrect\
        state output is deleted. The Security Council can always override the result of the challenge, it can also delete any L2 state root at any time. If\
        the malicious attester and challenger collude and are willing to spend bonds, they can perform a delay attack by engaging in continuous challenge\
        resulting in lack of finalization of the L2 state root on L1. The protocol can also fail under certain conditions.',
      references: [
        {
          text: 'Colosseum.sol#L300 - Etherscan source code, createChallenge function',
          href: 'https://etherscan.io/address/0x7526F997ea040B3949415c3a44e708273863AA2b#code#F1#L300',
        },
        {
          text: 'Colosseum.sol#L378 - Etherscan source code, bisect function',
          href: 'https://etherscan.io/address/0x7526F997ea040B3949415c3a44e708273863AA2b#code#F1#L378',
        },
        {
          text: 'Colosseum.sol#L434 - Etherscan source code, proveFault function',
          href: 'https://etherscan.io/address/0x7526F997ea040B3949415c3a44e708273863AA2b#code#F1#L434',
        },
        {
          text: 'KROMA-020: lack of validation segments and proofs in Colosseum.sol - ChainLight security audit',
          href: 'https://drive.google.com/file/d/13TUxZ9KPyvUXNZGddALcJLin-xmp_Fkj/view',
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
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'Derivation: Batch Submission - Kroma specs',
          href: 'https://github.com/kroma-network/kroma/blob/dev/specs/derivation.md#batch-submission',
        },
        {
          text: 'BatchInbox - Etherscan address',
          href: 'https://etherscan.io/address/0xff00000000000000000000000000000000000255',
        },
        {
          text: 'KromaPortal.sol#L430 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#L430',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_SEQUENCER,
      references: [
        {
          text: 'SystemConfig - batcher address',
          href: 'https://etherscan.io/address/0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35#readProxyContract#F3',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
      references: [
        {
          text: 'Sequencing Window - Kroma specs',
          href: 'https://github.com/kroma-network/kroma/blob/dev/specs/glossary.md#proposing-window',
        },
        {
          text: 'KromaPortal.sol#430 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#L430',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'KromaPortal.sol#L241 - Etherscan source code, proveWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#L241',
          },
          {
            text: 'KromaPortal.sol#L324 - Etherscan source code, finalizeWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x381F53695230BAF83a39D1a08304D233A35730Fa#code#F1#L324',
          },
        ],
      },
      EXITS.AUTONOMOUS,
    ],
    smartContracts: {
      name: 'EVM compatible smart contracts are supported',
      description:
        'OP stack chains are pursuing the EVM Equivalence model. No changes to smart contracts are required regardless of the language they are written in, i.e. anything deployed on L1 can be deployed on L2.',
      risks: [],
      references: [
        {
          text: 'Introducing EVM Equivalence',
          href: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
        },
      ],
    },
  },
  stateDerivation: {
    nodeSoftware:
      'Kroma nodes source code, including full node, proposer and validator, can be found [here](https://github.com/kroma-network/kroma). Also, the geth server, source maintained [here](https://github.com/kroma-network/go-ethereum), is a fork of go-ethereum. For more details on how they are different from the Optimism implementation, see [here](https://github.com/kroma-network/kroma/blob/main/specs/differences-from-optimism-bedrock.md).' +
      '\n' +
      'The instructions to run the proposer (called validator) and the ZK prover, are documented [here](https://docs.kroma.network/developers/running-nodes-on-kroma).',
    compressionScheme:
      'Data batches are compressed using the [zlib](https://github.com/madler/zlib) algorithm with best compression level.',
    genesisState:
      'The genesis file can be found [here](https://github.com/kroma-network/kroma-up/blob/main/config/mainnet/genesis.json).',
    dataFormat:
      'L2 blocks derivation from L1 data plus the format and architecture of batch submission is documented [here](https://github.com/kroma-network/kroma/blob/main/specs/derivation.md).',
  },
  permissions: [
    {
      name: 'SecurityCouncil',
      accounts: [
        discovery.getPermissionedAccount('Colosseum', 'SECURITY_COUNCIL'),
      ],
      description: `MultiSig (currently ${SCThreshold}) that is a guardian of KromaPortal, privileged Validator that does not need a bond \
        and privileged actor in Colosseum contract that can remove any L2Output state root regardless of the outcome of the challenge.`,
    },
    {
      name: 'SecurityCouncil members',
      accounts: SCMembers,
      description: `Members of the SecurityCouncil.`,
      references: [
        {
          text: 'Security Council members - Announcing Kroma Security Council',
          href: 'https://blog.kroma.network/announcing-kroma-security-council-435b540d2ab4',
        },
      ],
    },
    {
      name: 'Sequencer',
      accounts: [
        discovery.getPermissionedAccount('SystemConfig', 'batcherHash'),
      ],
      description: 'Central actor allowed to commit L2 transactions on L1.',
    },
    {
      name: 'Guardian',
      accounts: [discovery.getPermissionedAccount('KromaPortal', 'GUARDIAN')],
      description:
        'Actor allowed to pause withdrawals. Currently set to the Security Council.',
    },
  ],
  contracts: {
    addresses: [
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
          proposerRoundDurationSeconds,
        )}, then the submission becomes open to everyone.`,
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
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_RISK(formatSeconds(timelockDefaultDelay)),
    ],
  },
  milestones: [
    {
      name: 'Kroma Mainnet Launch',
      link: 'https://twitter.com/kroma_network/status/1699267271968055305?s=20',
      date: '2023-09-06T00:00:00Z',
      description: 'Kroma is live on mainnet.',
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
