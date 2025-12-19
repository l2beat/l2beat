import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('adi')

const chainId = 36900

const minGovUpgradeDelayS = discovery.getContractValue<number>(
  'Governance',
  'minDelay',
)

const govOwnerAddress = discovery.getContractValue<string>(
  'Governance',
  'owner',
)

const govSecurityCouncilAddress = discovery.getContractValue<string>(
  'Governance',
  'securityCouncil',
)

export const adi: ScalingProject = {
  type: 'layer2',
  id: ProjectId('adi'),
  addedAt: UnixTime(1766016000), // 2025-12-18T00:00:00Z
  capability: 'universal',
  badges: [
    BADGES.Stack.ZKStack,
    BADGES.Infra.ElasticChain,
    BADGES.VM.EVM,
    BADGES.DA.EthereumCalldata,
  ],
  display: {
    name: 'ADI Chain',
    purposes: ['Universal'],
    stacks: ['ZK Stack'],
    slug: 'adi',
    description:
      'ADI Chain is a zk rollup built for scale and policy alignment.',
    links: {
      websites: ['https://adi.foundation/'],
      explorers: ['https://explorer.adifoundation.ai/'],
      repositories: ['https://github.com/orgs/ADI-Foundation-Labs/'],
      bridges: ['https://bridge.adifoundation.ai'],
      documentation: [
        'https://adi-foundation.gitbook.io/adi-chain-documentation',
      ],
      socialMedia: [
        'https://x.com/ADIChain_',
        'https://discord.com/invite/adi-foundation',
      ],
    },
    // Do we need upgradesAndGovernanceImage? architectureImage? liveness?
  },
  proofSystem: { type: 'Validity', zkCatalogId: ProjectId('airbender') },
  config: {
    associatedTokens: ['ADI'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x0a0f8912162ff83a036883dbada42eff647a3065',
        ),
        sinceTimestamp: UnixTime(1764060407),
        tokens: '*',
        description: 'Main escrow contract of ADI chain.',
      }),
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 23874833,
        inbox: 'eth:0xE28cAc160C2a79dFA1fbd2169AC5fa5d061cf186',
        sequencers: [
          '0xF8fF3e62E94807a5C687f418Fe36942dD3a24524',
          '0x6090e365149d005517e2013926cD18d767f04Aa1',
          '0x0b6f2116323C12EE731de6818e41861561bcd44C',
          '0x37eEE7f0472F0740EAf152A3f5e888f7C5f62e51',
        ],
      },
    ],
    trackedTxs: [
      {
        uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
        query: {
          formula: 'sharedBridge',
          firstParameter: EthereumAddress(
            '0x0583Ef2B6416cb7B287406438B940E4d99680C5B',
          ), // gateway diamond on ethereum
          address: EthereumAddress(
            '0xE28cAc160C2a79dFA1fbd2169AC5fa5d061cf186',
          ),
          selector: '0x0db9eb87',
          functionSignature:
            'function commitBatchesSharedBridge(address _chainAddress, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
          sinceTimestamp: UnixTime(1764103931),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharedBridge',
          firstParameter: EthereumAddress(
            '0x0583Ef2B6416cb7B287406438B940E4d99680C5B',
          ), // gateway diamond on ethereum
          address: EthereumAddress(
            '0xE28cAc160C2a79dFA1fbd2169AC5fa5d061cf186',
          ),
          selector: '0x9271e450',
          functionSignature:
            'function proveBatchesSharedBridge(address _chainAddress, uint256, uint256, bytes)',
          sinceTimestamp: UnixTime(1761146555),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'sharedBridge',
          firstParameter: EthereumAddress(
            '0x0583Ef2B6416cb7B287406438B940E4d99680C5B',
          ), // gateway diamond on ethereum
          address: EthereumAddress(
            '0xE28cAc160C2a79dFA1fbd2169AC5fa5d061cf186',
          ),
          selector: '0xa085344d',
          functionSignature:
            'function executeBatchesSharedBridge(address _chainAddress, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
          sinceTimestamp: UnixTime(1761146555),
        },
      },
    ],
  },
  chainConfig: {
    name: 'adi',
    chainId,
    explorerUrl: 'https://explorer.adifoundation.ai',
    sinceTimestamp: UnixTime(1764062519),
    gasTokens: ['ADI'],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.adifoundation.ai/',
      },
    ],
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS_COMPRESSED,
  },
  riskView: {
    stateValidation: { ...RISK_VIEW.STATE_ZKP_ST_SN_WRAP },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
    exitWindow: RISK_VIEW.EXIT_WINDOW_ZKSTACK(minGovUpgradeDelayS),
    sequencerFailure: RISK_VIEW.SEQUENCER_ENQUEUE_VIA('L1'),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
      },
      stage1: {
        principle: false,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: false,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/matter-labs/zksync-era',
    },
  ),
  technology: {
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
    operator: OPERATOR.CENTRALIZED_OPERATOR,
    forceTransactions: {
      name: 'Users can force any transaction via L1',
      description:
        'If a user is censored by the L2 Sequencer, they can try to force their transaction via an L1 queue. Right now there is no mechanism that forces L2 Sequencer to include transactions from the queue in an L2 block. The operator can implement a TransactionFilterer that censors forced transactions.',
      risks: [
        ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM.risks,
        {
          category: 'Users can be censored if',
          text: 'the operator implements a TransactionFilterer, which is possible without delay.',
        },
      ],
      references: [
        {
          title: "L1 - L2 interoperability - Developer's documentation",
          url: 'https://docs.zksync.io/zksync-protocol/era-vm/contracts/handling-l1-l2-ops',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_MESSAGING('zk'),
        references: [
          {
            title: 'Withdrawing funds - ZKsync documentation',
            url: 'https://docs.zksync.io/zksync-protocol/rollup/bridging-assets',
          },
        ],
      },
      EXITS.FORCED_MESSAGING('forced-messages'),
    ],
  },
  upgradesAndGovernance: `
Upgrades are managed by Governance smart contract on L1.  The owner of smart contract (${govOwnerAddress}) can schedule either transparent or shadow proposals.
Transparent proposals have the upgrade data onchain when sceduled. Shadow proposals post only the hash of the upgrade data onchain when proposed, and the full upgrade data during execution.

Scheduled proposals must wait a minimal delay before being executed (currently ${formatSeconds(minGovUpgradeDelayS)}). Governance supports a security council (${govSecurityCouncilAddress}) that can execute proposals without any delay.

Currently, governance process does not involve any ADI tokenholders. See this link for more info: [https://docs.adi.foundation/appendix/appendix-b-governance](https://docs.adi.foundation/appendix/appendix-b-governance).
  `,
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: discovery.getDiscoveredContracts(),
    risks: [
      CONTRACTS.UPGRADE_NO_DELAY_RISK, // There is a Governance minDelay, but it is set to 0 now. This should be updated if minDelay increases
    ],
    // zkProgramHashes: [ZK_PROGRAM_HASHES(l2BootloaderHash)],  still need to check how this actually works with Airbender
  },
  stateDerivation: {
    nodeSoftware: `The node software is open-source, and its source code can be found [here](https://github.com/matter-labs/zksync-era).
The main node software does not rely on Layer 1 (L1) to reconstruct the state, but you can use [this tool](https://github.com/eqlabs/zksync-state-reconstruct) for that purpose. Currently, there is no straightforward method to inject the state into the main node, but MatterLabs is actively working on a solution for this.`,
    compressionScheme:
      'Bytecodes undergo compression before deployment on Layer 1 (L1). You can find additional information on this process [here](https://github.com/matter-labs/zksync-era/blob/main/docs/src/guides/advanced/11_compression.md).',
    genesisState: 'There have been neither genesis states nor regenesis.',
    dataFormat:
      'Details on data format can be found [here](https://github.com/matter-labs/zksync-era/blob/main/docs/src/guides/advanced/09_pubdata.md).',
  },
  stateValidation: {
    description:
      'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
    categories: [
      {
        title: 'Prover Architecture',
        description:
          'MatterLabs proof system Airbender can be found [here](https://github.com/matter-labs/zksync-airbender/tree/main) and contains essential tools like the Prover, the Verifier, and other backend components. The docs about the system can be found [here](https://github.com/matter-labs/zksync-airbender/blob/main/docs/README.md).',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the proof system is implemented incorrectly.',
          },
        ],
      },
    ],
  },
  milestones: [
    {
      title: 'ADI chain mainnet launch',
      url: 'https://x.com/ADIChain_/status/1998366460549480470',
      date: '2025-12-09T00:00:00Z',
      description:
        'ADI mainnet is live as an ZK stack L2 secured by the Airbender prover.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}