import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import { formatSeconds } from '../utils/formatSeconds'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  OPERATOR,
  subtractOne,
} from './common'
import { RISK_VIEW } from './common/riskView'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('kroma')

const upgradesProxy = {
  upgradableBy: ['KromaAdmin'],
  upgradeDelay: 'No delay',
}

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
    provider: 'OP Stack',
    links: {
      websites: ['https://kroma.network/'],
      apps: ['https://kroma.network/bridge/'],
      documentation: [
        'https://docs.kroma.network/',
        'https://github.com/kroma-network/kroma/tree/dev/specs',
      ],
      explorers: ['https://blockscout.kroma.network/'],
      repositories: ['https://github.com/kroma-network/'],
      socialMedia: [
        'https://discord.gg/kroma',
        'https://twitter.com/kroma_network',
        'https://medium.com/@kroma-network',
      ],
    },
    activityDataSource: 'Blockchain RPC',
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
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_FP_INT_ZK,
      description:
        RISK_VIEW.STATE_FP_INT_ZK.description +
        ' The challenge protocol can be subject to delay attacks and can fail under certain conditions.',
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
    upgradeability: {
      ...RISK_VIEW.UPGRADABLE_YES,
      sources: [
        {
          contract: 'KromaPortal',
          references: [
            'https://etherscan.io/address/0x31F648572b67e60Ec6eb8E197E1848CC5F5558de',
          ],
        },
        {
          contract: 'UpgradeGovernor',
          references: [
            'https://etherscan.io/address/0x2a51e099CC7AF922CcDe7F3db909DC7b71B8D030#code#F1#95',
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
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: true,
    },
    stage1: {
      stateVerificationOnL1: false,
      fraudProofSystemAtLeast5Outsiders: true,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: true,
      securityCouncilProperlySetUp: false,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
      fraudProofSystemIsPermissionless: true,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
    stateCorrectness: {
      name: 'Fraud Proofs ensure state correctness',
      description:
        'Kroma uses an interactive fraud proof system to find a single block of disagreement, which is then zk proven. The zkEVM used is based on Scroll.\
        Once the single block of disagreement is found, CHALLENGER is required to present zkProof of the fraud. When the proof is validated, the incorrect\
        state output is deleted. The Security Council can always override the result of the challenge, it can also delete any L2 state root at any time. If\
        the malicious ATTESTER and CHALLENGER collude and are willing to spend bonds, they can perform a delay attack by engaging in continuous challenge\
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
  permissions: [
    {
      name: 'KromaAdmin',
      accounts: discovery.getPermissionedAccounts(
        'SecurityCouncilToken',
        'ownerOf',
      ),
      description:
        'Only member of the UpgradeGovernor, which owns the Timelock and therefore controls the ProxyAdmin. Can instantly upgrade the system.',
    },
    {
      name: 'SecurityCouncil',
      accounts: [
        discovery.getPermissionedAccount('Colosseum', 'SECURITY_COUNCIL'),
      ],
      description:
        'MultiSig (currently 1/1) that is a guardian of KromaPortal, priviliged Validator that does not need a bond \
        and priviliged actor in Colosseum contract that can remove any L2Output state root regardless of the outcome of the challenge.',
    },
    {
      name: 'SecurityCouncilAdmin',
      accounts: [
        discovery.getPermissionedAccount('SecurityCouncil', 'GOVERNOR'),
      ],
      description:
        'Can add, remove and replace members of the SecurityCouncil multisig, and can also add addresses to the Governor whitelist. Currently EOA.',
    },
    {
      name: 'Sequencer',
      accounts: [
        discovery.getPermissionedAccount('SystemConfig', 'batcherHash'),
      ],
      description: 'Central actor allowed to commit L2 transactions on L1.',
    },
    /*
    {
      name: 'Proposers',
      accounts: discovery.getPermissionedAccounts(
        'ValidatorPool',
        'validators', //TODO: find way to read internal array, check config for more info
      ),
      description: 'Addresses allowed to propose and challenge state roots.',
    },
    */
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
        )} delay, but it can be bypassed by the KromaAdmin without conditions.`,
      }),
      discovery.getContractDetails('SecurityCouncil', {
        description:
          'Contract designated as a guardian, meaning it can pause withdrawals. Managed by the SecurityCouncilAdmin.',
        ...upgradesProxy,
      }),
      discovery.getContractDetails('UpgradeGovernor', {
        description:
          'Controls the Timelock. It is governed using a Soulbound NFT. It can bypass the Timelock delay without conditions.',
      }),
      discovery.getContractDetails('ProxyAdmin', {
        description:
          "Admin of the L2OutputOracle, Timelock, KromaPortal, SystemConfig, SecurityCouncil, L1CrossDomainMessenger, L1ERC721Bridge, ZKVerifier, Colosseum, L1StandardBridge, UpgradeGovernor, SecurityCouncilToken, ValidatorPool proxies. It's effectively controlled by the KromaAdmin. The proxy is behind a Timelock, but the delay can always be bypassed.",
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
          'Contract used to compute hashes. It is used by the ZKMerkeTrie.',
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'Kroma Mainnet Launch',
      link: 'https://twitter.com/kroma_network/status/1699267271968055305?s=20',
      date: '2023-09-06T00:00:00Z',
      description: 'Kroma is live on mainnet.',
    },
  ],
}
