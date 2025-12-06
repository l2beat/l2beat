import {
  assert,
  formatSeconds,
  ProjectId,
  type UnixTime,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  type DaProjectTableValue,
  DaUpgradeabilityRisk,
  EXITS,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  SEQUENCER_NO_MECHANISM,
  STATE_VALIDATION,
} from '../common'
import { BADGES } from '../common/badges'
import { EXPLORER_URLS } from '../common/explorerUrls'
import { ZK_PROGRAM_HASHES } from '../common/zkProgramHashes'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import type {
  Layer2TxConfig,
  ProjectScalingDisplay,
  ProjectScalingTechnology,
  ScalingProject,
} from '../internalTypes'
import type {
  Badge,
  ChainConfig,
  DacInfo,
  DaTechnology,
  Milestone,
  ProjectActivityConfig,
  ProjectContract,
  ProjectCustomDa,
  ProjectDaTrackingConfig,
  ProjectEscrow,
  ProjectPermissions,
  ProjectScalingCapability,
  ProjectScalingProofSystem,
  ProjectScalingPurpose,
  ProjectScalingScopeOfAssessment,
  ProjectScalingStateDerivation,
  ProjectScalingStateValidation,
  ProjectTechnologyChoice,
  ReasonForBeingInOther,
  TableReadyValue,
} from '../types'
import { getActivityConfig } from './activity'
import { DAC } from './dac-template'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from './generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from './getDiscoveryInfo'
import { explorerReferences, mergeBadges, safeGetImplementation } from './utils'

export interface DAProvider {
  layer: DaProjectTableValue
  riskView: TableReadyValue
  technology: ProjectTechnologyChoice
  bridge: TableReadyValue
}

export interface agglayerConfig {
  addedAt: UnixTime
  capability?: ProjectScalingCapability
  daProvider?: DAProvider
  customDa?: ProjectCustomDa
  discovery: ProjectDiscovery
  display: Omit<ProjectScalingDisplay, 'provider' | 'category' | 'purposes'>
  activityConfig?: ProjectActivityConfig
  chainConfig?: ChainConfig
  stateDerivation?: ProjectScalingStateDerivation
  nonTemplateProofSystem?: ProjectScalingProofSystem
  nonTemplatePermissions?: Record<string, ProjectPermissions>
  nonTemplateContracts?: ProjectContract[]
  nonTemplateEscrows: ProjectEscrow[]
  nonTemplateTechnology?: Partial<ProjectScalingTechnology>
  nonTemplateTrackedTxs?: Layer2TxConfig[]
  milestones: Milestone[]
  upgradesAndGovernance?: string
  stateValidation?: ProjectScalingStateValidation
  associatedTokens?: string[]
  additionalBadges?: Badge[]
  additionalPurposes?: ProjectScalingPurpose[]
  overridingPurposes?: ProjectScalingPurpose[]
  archivedAt?: UnixTime
  reasonsForBeingOther?: ReasonForBeingInOther[]
  architectureImage?: string
  scopeOfAssessment?: ProjectScalingScopeOfAssessment
  /** Set to true if projects posts blobs to Ethereum */
  usesEthereumBlobs?: boolean
  /** Configure to enable DA metrics tracking for chain using Celestia DA */
  celestiaDa?: {
    namespace: string
    /* IMPORTANT: Block number on Celestia Network */
    sinceBlock: number
  }
  /** Configure to enable DA metrics tracking for chain using Avail DA */
  availDa?: {
    appIds: string[]
    /* IMPORTANT: Block number on Avail Network */
    sinceBlock: number
  }
  /** Configure to enable custom DA tracking e.g. project that switched DA */
  nonTemplateDaTracking?: ProjectDaTrackingConfig[]
}

export function agglayerDAC(template: { dac: DacInfo }): ProjectCustomDa {
  const technology: DaTechnology = {
    description: `
## Architecture
![polygoncdk architecture](/images/da-layer-technology/polygoncdk/architecture.png#center)

Polygon CDK validiums utilize a data availability solution that relies on a Data Availability Committee (DAC) to ensure data integrity and manage off-chain transaction data. 
This architecture comprises the following components:
- **Operator**: A trusted entity that collects transactions, computes hash values for the transaction batch, and then requests and collects signatures from Committee members.
- **Data Availability Committee (DAC)**: A group of nodes responsible for validating batch data against the hash values provided by the operator (sequencer), ensuring the data accurately represents the transactions.
- **PolygonCommittee Contract**: Contract responsible for managing the data committee members list.

Each DAC node independently validates the batch data, ensuring it matches the received hash values. 
Upon successful validation, DAC members store the hash values locally and generate signatures endorsing the batch's integrity. 
The sequencer collects these signatures and submits the transactions batch hash together with the aggregated signature on Ethereum.
The PolygonCommittee contract is used during batch sequencing to verify that the signature posted by the sequencer was signed off by the DAC members stored in the contract.

## DA Bridge Architecture
![polygoncdk bridge architecture](/images/da-bridge-technology/polygoncdk/architectureL2.png#center)

The DA commitments are posted to the destination chain through the sequencer inbox, using the inbox as a DA bridge.
The DA commitment consists of a data availability message provided as transaction input, made up of a byte array containing the signatures and all the addresses of the committee in ascending order.
The sequencer distributes the data and collects signatures from Committee members offchain. Only the DA message is posted by the sequencer to the destination chain inbox (the DA bridge).
A separate contract, the PolygonCommittee contract, is used to manage the committee members list and verify the signatures before accepting the DA commitment.
    `,
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'a malicious committee signs a data availability attestation for an unavailable transaction batch.',
      },
      {
        category: 'Funds can be lost if',
        text: 'the bridge contract or its dependencies receive a malicious code upgrade. There is no delay on code upgrades.',
      },
    ],
    references: [
      {
        title: 'Polygon CDK Validium Documentation',
        url: 'https://docs.polygon.technology/cdk/architecture/cdk-validium/#data-availability-committee-dac',
      },
    ],
  }

  return DAC({
    ...template,
    technology,
    risks: {
      upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(0),
    },
  })
}

export function agglayer(templateVars: agglayerConfig): ScalingProject {
  const explorerUrl = EXPLORER_URLS['ethereum']

  const isPessimistic = templateVars.discovery.hasContract(
    'AggchainECDSAMultisig',
  )

  const rollupModuleContract = isPessimistic
    ? templateVars.discovery.getContract('AggchainECDSAMultisig')
    : templateVars.discovery.getContract('Validium')

  const forcedBatchAddress = rollupModuleContract.values?.forceBatchAddress

  assert(
    forcedBatchAddress !== undefined,
    'polygonCDKStack requires forceBatchAddress on Validium or AggchainECDSAMultisig.',
  )

  const isForcedBatchDisallowed =
    forcedBatchAddress !== '0x0000000000000000000000000000000000000000'

  const dacInfo =
    !isPessimistic && templateVars.discovery.hasContract('PolygonDataCommittee')
      ? {
          requiredMembers: templateVars.discovery.getContractValue<number>(
            'PolygonDataCommittee',
            'requiredAmountOfSignatures',
          ),
          membersCount: templateVars.discovery.getContractValue<number>(
            'PolygonDataCommittee',
            'getAmountOfMembers',
          ),
        }
      : undefined

  let daProvider = templateVars.daProvider
  if (!isPessimistic && daProvider === undefined && dacInfo !== undefined) {
    daProvider = {
      layer: DA_LAYERS.DAC,
      bridge: DA_BRIDGES.DAC_MEMBERS({
        requiredSignatures: dacInfo.requiredMembers,
        membersCount: dacInfo.membersCount,
      }),
      riskView: RISK_VIEW.DATA_EXTERNAL_DAC({
        membersCount: dacInfo.membersCount,
        requiredSignatures: dacInfo.requiredMembers,
      }),
      technology: {
        name: 'Data is not stored on chain',
        description:
          'The transaction data is not recorded on the Ethereum main chain. Transaction data is stored off-chain and only the hashes are posted onchain by the Sequencer, after being signed by the DAC members.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the external data becomes unavailable.',
            isCritical: true,
          },
        ],
        references: [
          {
            title:
              'PolygonValidiumEtrog.sol - Etherscan source code, sequenceBatchesValidium function',
            url: 'https://etherscan.io/address//0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F#code#F1#L91',
          },
        ],
      },
    }
  }

  const customDa = isPessimistic
    ? templateVars.customDa
    : (templateVars.customDa ??
      (dacInfo !== undefined ? agglayerDAC({ dac: dacInfo }) : undefined))

  assert(
    isPessimistic || daProvider !== undefined,
    'polygonCDKStack requires a daProvider or the PolygonDataCommittee contract in discovery.',
  )
  const shared = new ProjectDiscovery('shared-polygon-cdk')
  const agglayerManagerContract = shared.getContract('AgglayerManager')
  const upgradeDelay = shared.getContractValue<number>(
    'Timelock',
    'getMinDelay',
  )
  const upgradeDelayString = formatSeconds(upgradeDelay)
  const emergencyActivatedCount = shared.getContractValue<number>(
    'AgglayerManager',
    'emergencyStateCount',
  )

  const exitWindowRisk = {
    value: 'None',
    description: `Even though there is a ${upgradeDelayString} Timelock for upgrades, there are no forced transactions and thus no way to exit during operator censorship or downtime.`,
    sentiment: 'bad',
    orderHint: -1, // worse than forced tx available but instantly upgradable
    warning: {
      value: 'The Security Council can remove the delay on upgrades.',
      sentiment: 'bad',
    },
  } as const

  const bridge = templateVars.discovery.getContract('AgglayerBridge')

  const finalizationPeriod = 0

  const discoveries = [templateVars.discovery, shared]

  const reasonsForBeingOther = isPessimistic
    ? [REASON_FOR_BEING_OTHER.NO_DA_ORACLE, REASON_FOR_BEING_OTHER.NO_PROOFS]
    : templateVars.reasonsForBeingOther
  const baseBadges = [BADGES.Infra.Agglayer]
  const additionalBadges = isPessimistic
    ? mergeBadges([BADGES.DA.CustomDA], templateVars.additionalBadges ?? [])
    : mergeBadges(
        [BADGES.Stack.CDKErigon, BADGES.VM.EVM],
        templateVars.additionalBadges ?? [],
      )

  assert(
    additionalBadges.find((b) => b.type === 'DA') !== undefined,
    'DA badge is required for external DA',
  )

  const validiumDaProvider = isPessimistic ? undefined : daProvider
  if (!isPessimistic) {
    assert(
      validiumDaProvider !== undefined,
      'polygonCDKStack requires a DA provider for validium variants.',
    )
  }

  const proofSystem =
    templateVars.nonTemplateProofSystem ??
    (isPessimistic
      ? undefined
      : { type: 'Validity', zkCatalogId: ProjectId('zkprover') })

  let dataAvailabilityConfig: ScalingProject['dataAvailability']
  let riskView: ScalingProject['riskView']
  if (isPessimistic) {
    dataAvailabilityConfig = {
      layer: DA_LAYERS.NONE,
      bridge: DA_BRIDGES.NONE,
      mode: { value: 'None' as const },
    }
    riskView = {
      stateValidation: {
        ...RISK_VIEW.STATE_NONE,
        description:
          "Currently the system permits invalid state roots. 'Pessimistic' proofs only validate the bridge accounting.",
      },
      dataAvailability: RISK_VIEW.DATA_EXTERNAL,
      exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
      sequencerFailure: SEQUENCER_NO_MECHANISM(isForcedBatchDisallowed),
      proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
    }
  } else {
    const provider = validiumDaProvider as DAProvider
    dataAvailabilityConfig = {
      layer: provider.layer,
      bridge: provider.bridge,
      mode: DA_MODES.TRANSACTION_DATA,
    }
    riskView = {
      stateValidation: {
        ...RISK_VIEW.STATE_ZKP_ST_SN_WRAP,
        executionDelay: finalizationPeriod,
      },
      dataAvailability: provider.riskView,
      exitWindow: exitWindowRisk,
      sequencerFailure: SEQUENCER_NO_MECHANISM(isForcedBatchDisallowed),
      proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
    }
  }

  const technologyDataAvailability =
    templateVars.nonTemplateTechnology?.dataAvailability ??
    (isPessimistic
      ? {
          name: 'Data is not stored on chain',
          description:
            'Transaction data is kept off-chain. Bridge accounting is protected by pessimistic proofs while L2 state transitions are not proven on Ethereum.',
          risks: [],
          references: [],
        }
      : validiumDaProvider?.technology)

  const operatorTechnology =
    templateVars.nonTemplateTechnology?.operator ??
    (isPessimistic
      ? undefined
      : {
          name: 'The system has a centralized sequencer',
          description:
            'Only a trusted sequencer is allowed to submit transaction batches.',
          risks: [
            FRONTRUNNING_RISK,
            {
              category: 'Funds can be frozen if',
              text: 'the sequencer refuses to include an exit transaction.',
              isCritical: true,
            },
          ],
          references: explorerReferences(explorerUrl, [
            {
              title: `${rollupModuleContract.name}.sol - source code, onlyTrustedSequencer modifier`,
              address: safeGetImplementation(rollupModuleContract),
            },
          ]),
        })

  const sharedBridgeConsiderations = [
    {
      name: 'Shared bridge and Pessimistic Proofs',
      description:
        "Polygon Agglayer uses a shared bridge escrow for Rollups, Validiums and external chains that opt in to participate in interoperability. Each participating chain needs to provide zk proofs to access any assets in the shared bridge. In addition to the full execution proofs that are used for the state validation of Rollups and Validiums, accounting proofs over the bridges state (Polygon calls them 'Pessimistic Proofs') are used by external chains ('cdk-sovereign'). Using the SP1 zkVM by Succinct, projects without a full proof system on Ethereum are able to share the bridge with the zkEVM Agglayer projects.",
      risks: [
        {
          category: 'Funds can be lost if' as const,
          text: 'the accounting proof system for the bridge (pessimistic proofs, SP1) is implemented incorrectly.',
        },
        ...(isPessimistic
          ? [
              {
                category: 'Funds can be stolen if' as const,
                text: 'the operator manipulates the L2 state, which is not validated on Ethereum.',
                isCritical: true,
              } as const,
            ]
          : []),
      ],
      references: [
        {
          title: 'Pessimistic Proof - Polygon Knowledge Layer',
          url: 'https://docs.polygon.technology/cdk/concepts/pessimistic-proofs',
        },
        {
          title:
            'Etherscan: AgglayerManager.sol - verifyPessimisticTrustedAggregator() function',
          url: `https://etherscan.io/address/${safeGetImplementation(templateVars.discovery.getContract('AgglayerManager'))}#code#F1#L1300`,
        },
      ],
    },
  ]

  const technology = {
    dataAvailability: technologyDataAvailability,
    operator: operatorTechnology,
    forceTransactions:
      templateVars.nonTemplateTechnology?.forceTransactions ??
      FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
    exitMechanisms: templateVars.nonTemplateTechnology?.exitMechanisms ?? [
      {
        ...EXITS.REGULAR_MESSAGING('zk'),
        references: explorerReferences(explorerUrl, [
          {
            title: 'AgglayerBridge.sol - source code, claimAsset function',
            address: safeGetImplementation(bridge),
          },
        ]),
      },
    ],
    sequencing: templateVars.nonTemplateTechnology?.sequencing,
    otherConsiderations:
      templateVars.nonTemplateTechnology?.otherConsiderations ??
      sharedBridgeConsiderations,
  }

  const stateDerivation = isPessimistic
    ? templateVars.stateDerivation
    : (templateVars.stateDerivation ?? {
        nodeSoftware:
          'Node software can be found [here](https://github.com/0xPolygonHermez/zkevm-node) and [here](https://github.com/0xPolygonHermez/cdk-erigon). The cdk-erigon node is the more recent implementation.',
        compressionScheme: 'No compression scheme is used.',
        genesisState:
          'The genesis state, whose corresponding root is accessible as Batch 0 root in the `_legacyBatchNumToStateRoot` variable of AgglayerManager, is available [here](https://github.com/agglayer/agglayer-contracts/blob/0d0e69a6f299e273343461f6350343cf4b048269/deployment/genesis.json).',
        dataFormat:
          'The trusted sequencer batches transactions according to the specifications documented [here](https://docs.polygon.technology/zkEVM/architecture/protocol/transaction-life-cycle/transaction-batching/). Only /signed hashes of batches are posted to the Validium contract.',
      })

  const stateValidation = isPessimistic
    ? templateVars.stateValidation
    : (templateVars.stateValidation ?? {
        description:
          'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
        categories: [
          {
            title: 'Prover Architecture',
            description:
              'Polygon zkEVM proof system PIL-STARK can be found [here](https://github.com/0xPolygonHermez/pil-stark).',
          },
          {
            title: 'ZK Circuits',
            description:
              'Polygon zkEVM circuits are built from PIL (polynomial identity language) and are designed to replicate the behavior of the EVM. The source code can be found [here](https://github.com/0xPolygonHermez/zkevm-rom).',
            risks: [
              {
                category: 'Funds can be lost if',
                text: 'the proof system is implemented incorrectly.',
              },
            ],
          },
          {
            title: 'Verification Keys Generation',
            description:
              'SNARK verification keys can be generated and checked against the Ethereum verifier contract using [this guide](https://github.com/0xPolygonHermez/zkevm-contracts/blob/main/verifyMainnetDeployment/verifyMainnetProofVerifier.md). The system requires a trusted setup.',
          },
          {
            title: 'Pessimistic Proofs',
            description:
              'The pessimistic proofs that are used to prove correct accounting in the Agglayer shared bridge are using the [SP1 zkVM by Succinct](https://github.com/succinctlabs/sp1).',
          },
          {
            ...STATE_VALIDATION.VALIDITY_PROOFS,
            references: explorerReferences(explorerUrl, [
              {
                title:
                  'AgglayerManager.sol - source code, _verifyAndRewardBatches function',
                address: safeGetImplementation(agglayerManagerContract),
              },
            ]),
          },
        ],
      })

  const contractsRisks = isPessimistic
    ? [CONTRACTS.UPGRADE_NO_DELAY_RISK]
    : [
        CONTRACTS.UPGRADE_WITH_DELAY_RISK_WITH_EXCEPTION(
          upgradeDelayString,
          'PolygonSecurityCouncil',
        ),
      ]

  const zkProgramHashes = isPessimistic
    ? getPessimisticVKeys(templateVars.discovery).map((el) =>
        ZK_PROGRAM_HASHES(el),
      )
    : []

  const architectureImage = isPessimistic
    ? (templateVars.architectureImage ?? 'polygon-cdk-validium')
    : ''

  const upgradesAndGovernance =
    templateVars.upgradesAndGovernance ??
    `
The regular upgrade process for shared system contracts and L2-specific validium contracts starts at the PolygonAdminMultisig. For the shared contracts, they schedule a transaction that targets the ProxyAdmin via the Timelock, wait for ${upgradeDelayString} and then execute the upgrade. An upgrade of the Layer 2 specific validium contract requires first adding a new rollupType through the Timelock and the AgglayerManager (defining the new implementation and verifier contracts). Now that the rollupType is created, either the local admin or the PolygonAdminMultisig can immediately upgrade the local system contracts to it. Chains using pessimistic proofs often have completely sovereign upgrade paths from the ones described here, but the shared contracts still remain relevant to them because they use them as escrow.

The PolygonSecurityCouncil can expedite the upgrade process by declaring an emergency state. This state pauses both the shared bridge and the AgglayerManager and allows for instant upgrades through the timelock. Accordingly, instant upgrades for all system contracts are possible with the cooperation of the SecurityCouncil. The emergency state has been activated ${emergencyActivatedCount} time(s) since inception.

Furthermore, the PolygonAdminMultisig is permissioned to manage the shared trusted aggregator (proposer and prover) for all participating Layer 2s, deactivate the emergency state, obsolete rollupTypes and manage operational parameters and fees in the AgglayerManager directly. The local admin of a specific Validium can manage their chain by choosing the trusted sequencer, manage forced batches and set the data availability config. For sovereign chains using pessimistic proofs they can manage any proof logic that might be used on top of the minimal pessimistic one. Creating new Layer 2s (of existing rollupType) is outsourced to the PolygonCreateRollupMultisig but can also be done by the PolygonAdminMultisig. Custom non-shared bridge escrows have their custom upgrade admins listed in the permissions section.`

  return {
    type: 'layer2',
    addedAt: templateVars.addedAt,
    id: ProjectId(templateVars.discovery.projectName),
    capability: templateVars.capability ?? 'universal',
    archivedAt: templateVars.archivedAt,
    ecosystemInfo: {
      id: ProjectId('agglayer'),
    },
    display: {
      ...templateVars.display,
      upgradesAndGovernanceImage: 'polygoncdk',
      purposes: templateVars.overridingPurposes ?? [
        'Universal',
        ...(templateVars.additionalPurposes ?? []),
      ],
      architectureImage,
      stacks: ['Agglayer CDK'],
      tvsWarning: templateVars.display.tvsWarning,
    },
    proofSystem,
    config: {
      associatedTokens: templateVars.associatedTokens,
      escrows: templateVars.nonTemplateEscrows,
      activityConfig: getActivityConfig(
        templateVars.activityConfig,
        templateVars.chainConfig,
        {
          type: 'block',
          startBlock: 1,
        },
      ),
    },
    chainConfig: templateVars.chainConfig && {
      ...templateVars.chainConfig,
      gasTokens: templateVars.chainConfig?.gasTokens ?? ['ETH'],
    },
    dataAvailability: dataAvailabilityConfig,
    riskView,
    stage: { stage: 'NotApplicable' },
    technology,
    stateDerivation,
    stateValidation,
    permissions: generateDiscoveryDrivenPermissions([templateVars.discovery]),
    contracts: {
      addresses: generateDiscoveryDrivenContracts([templateVars.discovery]),
      risks: contractsRisks,
      ...(zkProgramHashes.length > 0 ? { zkProgramHashes } : {}),
    },
    upgradesAndGovernance,
    milestones: templateVars.milestones,
    badges: mergeBadges(baseBadges, additionalBadges),
    customDa,
    reasonsForBeingOther,
    scopeOfAssessment: templateVars.scopeOfAssessment,
    discoveryInfo: getDiscoveryInfo(discoveries),
  }
}

function getPessimisticVKeys(discovery: ProjectDiscovery): string[] {
  type ProgramHashDict = Record<string, Record<string, string>[]>
  if (!discovery.hasContract('AgglayerGateway')) {
    return []
  }
  const pessimisticVKeyDict = discovery.getContractValue<ProgramHashDict>(
    'AgglayerGateway',
    'routes',
  )

  return Object.values(pessimisticVKeyDict).flatMap((arr) =>
    arr.map((el) => el['pessimisticVKey']),
  )
}
