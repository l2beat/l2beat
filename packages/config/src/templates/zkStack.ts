import type { EntryParameters } from '@l2beat/discovery'
import {
  assert,
  ChainId,
  EthereumAddress,
  ProjectId,
  type UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  type DaProjectTableValue,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../common'
import { BADGES } from '../common/badges'
import { formatExecutionDelay } from '../common/formatDelays'
import { PROOFS } from '../common/proofSystems'
import { getStage } from '../common/stages/getStage'
import type { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import type {
  Layer2TxConfig,
  ProjectScalingDisplay,
  ProjectScalingTechnology,
  ScalingProject,
} from '../internalTypes'
import type {
  Badge,
  ChainConfig,
  Milestone,
  ProjectActivityConfig,
  ProjectContract,
  ProjectDaTrackingConfig,
  ProjectEscrow,
  ProjectFinalityConfig,
  ProjectPermissions,
  ProjectScalingCapability,
  ProjectScalingPurpose,
  ProjectScalingRiskView,
  ProjectScalingScopeOfAssessment,
  ProjectScalingStage,
  ProjectTechnologyChoice,
  ProjectUpgradeableActor,
  ReasonForBeingInOther,
  TableReadyValue,
} from '../types'
import { getActivityConfig } from './activity'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from './generateDiscoveryDrivenSections'
import { mergeBadges, mergePermissions } from './utils'

export interface DAProvider {
  layer: DaProjectTableValue
  riskView: TableReadyValue
  technology: ProjectTechnologyChoice
  bridge: TableReadyValue
}

export interface ZkStackConfigCommon {
  addedAt: UnixTime
  capability?: ProjectScalingCapability
  discovery: ProjectDiscovery
  discovery_ZKstackGovL2: ProjectDiscovery
  display: Omit<ProjectScalingDisplay, 'provider' | 'category' | 'purposes'>
  daProvider?: DAProvider
  upgradeability?: {
    upgradableBy: string[] | undefined
    upgradeDelay: string | undefined
  }
  l1StandardBridgeEscrow?: EthereumAddress
  l1StandardBridgeTokens?: string[]
  l1StandardBridgePremintedTokens?: string[]
  diamondContract: EntryParameters
  activityConfig?: ProjectActivityConfig
  nonTemplateTrackedTxs?: Layer2TxConfig[]
  finality?: ProjectFinalityConfig
  l2OutputOracle?: EntryParameters
  portal?: EntryParameters
  milestones?: Milestone[]
  roleOverrides?: Record<string, string>
  nonTemplatePermissions?: Record<string, ProjectPermissions>
  nonTemplateContracts?: ProjectContract[]
  nonTemplateEscrows?: ProjectEscrow[]
  associatedTokens?: string[]
  isNodeAvailable?: boolean | 'UnderReview'
  nodeSourceLink?: string
  chainConfig?: ChainConfig
  usesBlobs?: boolean
  isUnderReview?: boolean
  stage?: ProjectScalingStage
  additionalBadges?: Badge[]
  useDiscoveryMetaOnly?: boolean
  additionalPurposes?: ProjectScalingPurpose[]
  overridingPurposes?: ProjectScalingPurpose[]
  nonTemplateRiskView?: Partial<ProjectScalingRiskView>
  nonTemplateTechnology?: Partial<ProjectScalingTechnology>
  reasonsForBeingOther?: ReasonForBeingInOther[]
  /** Configure to enable DA metrics tracking for chain using Celestia DA */
  celestiaDa?: {
    namespace: string
    /* IMPORTANT: Block number on Celestia Network */
    sinceBlock: number
  }
  /** Configure to enable DA metrics tracking for chain using Avail DA */
  availDa?: {
    appId: string
    /* IMPORTANT: Block number on Avail Network */
    sinceBlock: number
  }
  /** Configure to enable custom DA tracking e.g. project that switched DA */
  nonTemplateDaTracking?: ProjectDaTrackingConfig[]
  scopeOfAssessment?: ProjectScalingScopeOfAssessment
}

export type Upgradeability = {
  upgradableBy?: ProjectUpgradeableActor[]
}

export function zkStackL2(templateVars: ZkStackConfigCommon): ScalingProject {
  const { discovery, discovery_ZKstackGovL2 } = templateVars
  const daProvider = templateVars.daProvider
  if (daProvider) {
    assert(
      templateVars.additionalBadges?.find((b) => b.type === 'DA') !== undefined,
      'DA badge missing',
    )
  }

  const protVotingDelayS = discovery_ZKstackGovL2.getContractValue<number>(
    'ZkProtocolGovernor',
    'votingDelay',
  )
  const protVotingPeriodS = discovery_ZKstackGovL2.getContractValue<number>(
    'ZkProtocolGovernor',
    'votingPeriod',
  )

  const protLateQuorumVoteExtensionS =
    discovery_ZKstackGovL2.getContractValue<number>(
      'ZkProtocolGovernor',
      'lateQuorumVoteExtension',
    )
  const protTlMinDelayS = discovery_ZKstackGovL2.getContractValue<number>(
    'ProtocolTimelockController',
    'getMinDelay',
  )
  const executionDelayS = discovery.getContractValue<number>(
    'ValidatorTimelock',
    'executionDelay',
  )
  const executionDelay = executionDelayS > 0 && formatSeconds(executionDelayS)

  const legalVetoStandardS = discovery.getContractValue<number>(
    'ProtocolUpgradeHandler',
    'STANDARD_LEGAL_VETO_PERIOD',
  )
  const legalVetoExtendedS = discovery.getContractValue<number>(
    'ProtocolUpgradeHandler',
    'EXTENDED_LEGAL_VETO_PERIOD',
  )
  const upgradeDelayPeriodS = discovery.getContractValue<number>(
    'ProtocolUpgradeHandler',
    'UPGRADE_DELAY_PERIOD',
  )
  const upgradeWaitOrExpireS = discovery.getContractValue<number>(
    'ProtocolUpgradeHandler',
    'UPGRADE_WAIT_OR_EXPIRE_PERIOD',
  )
  // protTlMinDelayS + executionDelayS + legalVetoExtendedS + upgradeDelayPeriodS
  //       0                21h                7d                 1d         = 8d 21h
  // assumption: active guardians (2/8)
  const upgradeDelayWithScApprovalExtendedLegalVotingS =
    protTlMinDelayS + executionDelayS + legalVetoExtendedS + upgradeDelayPeriodS
  const upgradeDelayWithScApprovalS =
    protTlMinDelayS + executionDelayS + legalVetoStandardS + upgradeDelayPeriodS
  const upgradeDelayNoScS =
    protTlMinDelayS +
    executionDelayS +
    legalVetoStandardS +
    upgradeWaitOrExpireS +
    upgradeDelayPeriodS

  const softFreezeS = discovery.getContractValue<number>(
    'ProtocolUpgradeHandler',
    'SOFT_FREEZE_PERIOD',
  )
  const hardFreezeS = discovery.getContractValue<number>(
    'ProtocolUpgradeHandler',
    'HARD_FREEZE_PERIOD',
  )

  const scMemberCount = discovery.getContractValue<string[]>(
    'SecurityCouncil',
    '$members',
  ).length
  const scApprovalThreshold = discovery.getContractValue<number>(
    'SecurityCouncil',
    'APPROVE_UPGRADE_SECURITY_COUNCIL_THRESHOLD',
  )
  const scMainThreshold = discovery.getContractValue<number>(
    'SecurityCouncil',
    'EIP1271_THRESHOLD',
  )
  const guardiansMemberCount = discovery.getContractValue<string[]>(
    'Guardians',
    '$members',
  ).length
  const guardiansMainThreshold = discovery.getContractValue<number>(
    'Guardians',
    'EIP1271_THRESHOLD',
  )
  const guardiansExtendThreshold = discovery.getContractValue<number>(
    'Guardians',
    'EXTEND_LEGAL_VETO_THRESHOLD',
  )
  const protocolStartProposalThresholdM =
    discovery_ZKstackGovL2.getContractValueBigInt(
      'ZkProtocolGovernor',
      'proposalThreshold',
    ) / 1000000000000000000000000n // result: M of tokens
  const protocolQuorumM =
    discovery_ZKstackGovL2.getContractValueBigInt(
      'ZkProtocolGovernor',
      'currentQuorum',
    ) / 1000000000000000000000000n // result: M of tokens
  const scThresholdString = `${scMainThreshold}/${scMemberCount}`
  const guardiansThresholdString = `${guardiansMainThreshold}/${guardiansMemberCount}`

  const allDiscoveries = [templateVars.discovery, discovery_ZKstackGovL2]
  return {
    type: 'layer2',
    id: ProjectId(templateVars.discovery.projectName),
    addedAt: templateVars.addedAt,
    capability: templateVars.capability ?? 'universal',
    badges: mergeBadges(
      [
        BADGES.Stack.ZKStack,
        BADGES.Infra.ElasticChain,
        BADGES.VM.EVM,
        BADGES.DA.EthereumBlobs,
      ],
      templateVars.additionalBadges ?? [],
    ),
    display: {
      purposes: templateVars.overridingPurposes ?? [
        'Universal',
        ...(templateVars.additionalPurposes ?? []),
      ],
      upgradesAndGovernanceImage: 'zk-stack',
      ...templateVars.display,
      stack: 'ZK Stack',
      category: daProvider !== undefined ? 'Validium' : 'ZK Rollup',
      liveness: {
        explanation: executionDelay
          ? `${templateVars.display.name} is a ${
              daProvider !== undefined
                ? 'Validium that posts commitments'
                : 'ZK rollup that posts state diffs'
            } to the L1. Transactions within a state diff can be considered final when proven on L1 using a ZK proof, except that an operator can revert them if not executed yet. Currently, there is at least a ${executionDelay} delay between state diffs verification and the execution of the corresponding state actions.`
          : undefined,
      },
      finality: {
        finalizationPeriod: executionDelayS,
        warnings: {
          timeToInclusion: {
            sentiment: 'warning',
            value:
              'Proven but not executed batches can be reverted by the validator(s) or the StateTransitionManager.',
          },
        },
      },
      tvlWarning: templateVars.display.tvlWarning,
    },
    config: {
      associatedTokens: templateVars.associatedTokens,
      escrows: [
        ...(templateVars.nonTemplateEscrows !== undefined
          ? templateVars.nonTemplateEscrows
          : []),
      ],
      activityConfig: getActivityConfig(
        templateVars.activityConfig,
        templateVars.chainConfig,
        {
          type: 'block',
          startBlock: 1,
        },
      ),
      daTracking: getDaTracking(templateVars),
      trackedTxs:
        daProvider !== undefined
          ? undefined
          : (templateVars.nonTemplateTrackedTxs ?? []),
      finality: daProvider !== undefined ? undefined : templateVars.finality,
    },
    chainConfig: templateVars.chainConfig && {
      ...templateVars.chainConfig,
      gasTokens: templateVars.chainConfig?.gasTokens ?? ['ETH'],
    },
    dataAvailability: {
      layer: daProvider?.layer ?? DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
      bridge: daProvider?.bridge ?? DA_BRIDGES.ENSHRINED,
      mode: DA_MODES.STATE_DIFFS_COMPRESSED,
    },
    riskView: {
      stateValidation: templateVars.nonTemplateRiskView?.stateValidation ?? {
        ...RISK_VIEW.STATE_ZKP_ST_SN_WRAP,
        secondLine: formatExecutionDelay(executionDelayS),
      },
      dataAvailability:
        (templateVars.nonTemplateRiskView?.dataAvailability ??
        daProvider !== undefined)
          ? RISK_VIEW.DATA_EXTERNAL
          : RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
      exitWindow:
        templateVars.nonTemplateRiskView?.exitWindow ??
        RISK_VIEW.EXIT_WINDOW_ZKSTACK(upgradeDelayWithScApprovalS),
      sequencerFailure:
        templateVars.nonTemplateRiskView?.sequencerFailure ??
        RISK_VIEW.SEQUENCER_ENQUEUE_VIA('L1'),
      proposerFailure:
        templateVars.nonTemplateRiskView?.proposerFailure ??
        RISK_VIEW.PROPOSER_WHITELIST_GOVERNANCE,
    },
    stage:
      templateVars.stage ??
      (templateVars.daProvider !== undefined
        ? {
            stage: 'NotApplicable',
          }
        : getStage(
            {
              stage0: {
                callsItselfRollup: true,
                stateRootsPostedToL1: true,
                dataAvailabilityOnL1: true,
                rollupNodeSourceAvailable: true,
              },
              stage1: {
                principle: false,
                stateVerificationOnL1: true,
                fraudProofSystemAtLeast5Outsiders: null,
                usersHave7DaysToExit: false,
                usersCanExitWithoutCooperation: false,
                securityCouncilProperlySetUp: null,
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
          )),
    technology: {
      sequencing: templateVars.nonTemplateTechnology?.sequencing,
      dataAvailability:
        templateVars.nonTemplateTechnology?.dataAvailability ??
        technologyDA(daProvider),
      operator:
        templateVars.nonTemplateTechnology?.operator ??
        OPERATOR.CENTRALIZED_OPERATOR,
      forceTransactions: templateVars.nonTemplateTechnology
        ?.forceTransactions ?? {
        name: 'Users can force any transaction via L1',
        description:
          'If a user is censored by the L2 Sequencer, they can try to force their transaction via an L1 queue. Right now there is no mechanism that forces L2 Sequencer to include\
        transactions from the queue in an L2 block. The operator can implement a TransactionFilterer that censors forced transactions.',
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
            url: 'https://docs.zksync.io/build/developer-reference/l1-l2-interoperability#priority-queue',
          },
        ],
      },
      exitMechanisms: templateVars.nonTemplateTechnology?.exitMechanisms ?? [
        {
          ...EXITS.REGULAR_MESSAGING('zk'),
          references: [
            {
              title: 'Withdrawing funds - ZKsync documentation',
              url: 'https://docs.zksync.io/build/developer-reference/bridging-assets',
            },
          ],
        },
        EXITS.FORCED_MESSAGING('forced-messages'),
      ],
    },
    upgradesAndGovernance: (() => {
      const description = `
There are two main paths for contract upgrades in the shared ZK stack ecosystem - standard and emergency - both converging on the shared upgrade proxy contract ProtocolUpgradeHandler.
The standard path involves a governance proposal and voting through the DAO, multiple timelock delays and finally approval by the Guardians or ${scApprovalThreshold} SecurityCouncil participants.
The emergency path allows for contract upgrades without any delay by the EmergencyUpgradeBoard, which acts as a 3/3 Multisig between SecurityCouncil, Guardians and the FoundationMultisig.
## Standard path
### On ZKsync Era
Delegates can start new proposals by reaching a threshold of ${protocolStartProposalThresholdM}M ZK tokens on the ZKsync Era Rollup's ZkProtocolGovernor contract.
This launches a ${formatSeconds(
        protVotingDelayS,
      )} 'voting delay' after which the ${formatSeconds(protVotingPeriodS)} voting period starts. During these first two periods, the proposal can be canceled by the proposer or if it falls below the proposing threshold.
A proposal is only successful if it reaches both quorum (${protocolQuorumM}M ZK tokens) and simple majority. When it reaches quorum, a remaining voting period of ${formatSeconds(
        protLateQuorumVoteExtensionS,
      )} is guaranteed by a potential late quorum vote extension.
In the successful case, it can be queued in the ${formatSeconds(
        protTlMinDelayS,
      )} timelock which forwards it to Ethereum as an L2->L1 log.
### On Ethereum
After the execution of the proposal-containing batch (${executionDelay} delay), the proposal is now picked up by the ProtocolUpgradeHandler and enters the ${formatSeconds(
        legalVetoStandardS,
      )} 'legal veto period'.
This serves as a window in which a veto could be coordinated offchain, to be then enforced by non-approval of Guardians and SecurityCouncil. A threshold of ${guardiansExtendThreshold} Guardians can extend the veto period to ${formatSeconds(
        legalVetoExtendedS,
      )}.
After this a proposal enters a \*waiting\* state of ${formatSeconds(
        upgradeWaitOrExpireS,
      )}, from which it can be immediately approved (cancelling the delay) by ${scApprovalThreshold} participants of the SecurityCouncil.
For the unlikely case that the SC does not approve here, the Guardians can instead approve the proposal, or nobody. In the two latter cases, the waiting period is enforced in full.
A proposal cannot be actively cancelled in the ProtocolUpgradeHandler, but will be expired if not approved within the waiting period. An approved proposal now enters the \*pendingExecution\* state for a final delay of 1d, and can then be executed.
### Other governance tracks
There are two other tracks of Governance also starting with DAO Delegate proposals the ZKsync Era rollup: 1) Token Program Proposals that add new minters, allocations or upgrade the ZK token and
2) Governance Advisory Proposals that e.g. change the ZK Credo or other offchain Governance Procedures without onchain targets.
The protocol for these two other tracks is similar to the first part of the standard path described above (albeit having different quorum and timelock values), and not passing over to the Ethereum L1.
Further customizations are that the ZkFoundationMultisig can propose to the ZkTokenGovernor without a threshold and that the Guardians' L2 alias can cancel proposals in the ZkTokenGovernor and the ZkGovOpsGovernor.
## Emergency path
SecurityCouncil (${scThresholdString}), Guardians (${guardiansThresholdString}) and ZkFoundationMultisig (${discovery.getMultisigStats(
        'ZkFoundationMultisig',
      )}) form a de-facto 3/3 Multisig
by pushing an immediate upgrade proposal through the EmergencyUpgradeBoard, which circumvents all delays and executes immediately via the ProtocolUpgradeHandler.
## Upgrade Delays
The cumulative duration of the upgrade paths from the moment of a voted 'successful' proposal is ${formatSeconds(
        upgradeDelayWithScApprovalS,
      )} or ${formatSeconds(
        upgradeDelayWithScApprovalExtendedLegalVotingS,
      )} (depending on Guardians extending the LegalVetoPeriod) for Standard, 0 for Emergency and ${formatSeconds(
        upgradeDelayNoScS,
      )} for the path in which the SecurityCouncil is not approving the proposal.
## Freezing
The SecurityCouncil can freeze (pause withdrawals and settlement) all chains connected to the current StateTransitionManager.
Either for a softFreeze of ${formatSeconds(
        softFreezeS,
      )} or a hardFreeze of ${formatSeconds(hardFreezeS)}.
After a softFreeze and / or a hardFreeze, a proposal from the EmergencyUpgradeBoard has to be passed before subsequent freezes are possible.
Only the SecurityCouncil can unfreeze an active freeze.
## Elastic Chain Operator and ChainAdmin
Apart from the paths that can upgrade all shared implementations, the ZK stack governance system defines other roles that can modify the system:
A single *Elastic Chain operator* role that governs parameters in the shared contracts and a *ChainAdmin* role (in the chain-specific diamond contract) for managing parameters of each individual Hyperchain that builds on the stack.
These chain-specific actions include setting a transaction filterer that can censor L1 -> L2 messages, setting fee parameters and adding / removing Validators in the ValidatorTimelock.
ZKsync Era's ChainAdmin differs from the others as it also has the above *Elastic Chain Operator* role in the shared ZK stack contracts.`
      return description
    })(),
    permissions: mergePermissions(
      generateDiscoveryDrivenPermissions(allDiscoveries),
      templateVars.nonTemplatePermissions ?? {},
    ),
    contracts: {
      addresses: generateDiscoveryDrivenContracts(allDiscoveries),
      risks: [
        CONTRACTS.UPGRADE_WITH_DELAY_RISK_WITH_EXCEPTION(
          // a bit hacky, but re-using the function from arbitrum (3 cases: standard (with or without extension by Guardians), emergency)
          `${formatSeconds(upgradeDelayWithScApprovalS)} - ${formatSeconds(
            upgradeDelayWithScApprovalExtendedLegalVotingS,
          )}`,
          'EmergencyUpgradeBoard',
        ),
      ],
    },
    stateDerivation:
      daProvider !== undefined
        ? undefined
        : {
            nodeSoftware: `The node software is open-source, and its source code can be found [here](https://github.com/matter-labs/zksync-era).
    The main node software does not rely on Layer 1 (L1) to reconstruct the state, but you can use [this tool](https://github.com/eqlabs/zksync-state-reconstruct) for that purpose. Currently, there is no straightforward method to inject the state into the main node, but ZKsync is actively working on a solution for this.`,
            compressionScheme:
              'Bytecodes undergo compression before deployment on Layer 1 (L1). You can find additional information on this process [here](https://github.com/matter-labs/zksync-era/blob/main/docs/guides/advanced/11_compression.md).',
            genesisState:
              'There have been neither genesis states nor regenesis.',
            dataFormat:
              'Details on data format can be found [here](https://github.com/matter-labs/zksync-era/blob/main/docs/guides/advanced/09_pubdata.md).',
          },
    stateValidation: {
      description:
        'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
      categories: [
        {
          title: 'Prover Architecture',
          description:
            'ZKsync Era proof system Boojum can be found [here](https://github.com/matter-labs/era-boojum/tree/main) and contains essential tools like the Prover, the Verifier, and other backend components. The specs of the system can be found [here](https://github.com/matter-labs/zksync-era/tree/main/docs/specs/prover).',
        },
        {
          title: 'ZK Circuits',
          description:
            'ZKsync Era circuits are built from Boojum and are designed to replicate the behavior of the EVM. The source code can be found [here](https://github.com/matter-labs/era-zkevm_circuits/tree/main). The circuits are checked against tests that can be found [here](https://github.com/matter-labs/era-zkevm_test_harness/tree/main).',
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
            'SNARK verification keys can be generated and checked against the Ethereum verifier contract using [this tool](https://github.com/matter-labs/zksync-era/tree/main/prover/crates/bin/vk_setup_data_generator_server_fri). The system requires a trusted setup.',
        },
      ],
      proofVerification: {
        shortDescription: 'ZKsync Era is a ZK-EVM rollup on Ethereum.',
        aggregation: true,
        requiredTools: [
          {
            name: 'Custom tool',
            version: 'v14.2.0',
            link: 'https://github.com/matter-labs/zksync-era/tree/prover-v14.2.0/prover/vk_setup_data_generator_server_fri',
          },
        ],
        verifiers: [
          {
            name: 'ZKsyncEraVerifier',
            description:
              'ZKsync Era utilizes [Boojum](https://github.com/matter-labs/era-boojum/tree/main) as the main proving stack for their system. Boojum is an implementation of the [Redshift](https://eprint.iacr.org/2019/1400.pdf) protocol. The protocol makes use of recursive proof aggregation. The final Redshift proof is wrapped in a SNARK (Plonk + KZG) proof.',
            verified: 'no',
            contractAddress: EthereumAddress(
              '0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66',
            ),
            chainId: ChainId.ETHEREUM,
            subVerifiers: [
              {
                name: 'Final wrap',
                ...PROOFS.PLONKSNARK('Aztec ceremony'),
                link: 'https://github.com/matter-labs/era-zkevm_test_harness/blob/v1.5.0/circuit_definitions/src/circuit_definitions/aux_layer/wrapper.rs',
              },
              {
                name: 'Aggregation circuit',
                proofSystem: 'Redshift',
                mainArithmetization: 'Plonkish',
                mainPCS: 'LPC',
                trustedSetup: 'None',
                link: 'https://github.com/matter-labs/era-zkevm_test_harness/blob/v1.5.0/circuit_definitions/src/circuit_definitions/recursion_layer/mod.rs#L45',
              },
              {
                name: 'Main circuit',
                proofSystem: 'Redshift',
                mainArithmetization: 'Plonkish',
                mainPCS: 'LPC',
                trustedSetup: 'None',
                link: 'https://github.com/matter-labs/era-zkevm_circuits',
              },
            ],
          },
        ],
      },
    },
    milestones: templateVars.milestones ?? [],
    reasonsForBeingOther: templateVars.reasonsForBeingOther,
    scopeOfAssessment: templateVars.scopeOfAssessment,
  }
}

function technologyDA(DA: DAProvider | undefined): ProjectTechnologyChoice {
  if (DA !== undefined) {
    return DA.technology
  }

  return TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA
}

function getDaTracking(
  templateVars: ZkStackConfigCommon,
): ProjectDaTrackingConfig[] | undefined {
  if (templateVars.nonTemplateDaTracking) {
    return templateVars.nonTemplateDaTracking
  }

  const validatorTimelock =
    templateVars.discovery.getContractDetails('ValidatorTimelock').address

  const validatorsVTL = templateVars.discovery.getContractValue<string[]>(
    'ValidatorTimelock',
    'validatorsVTL',
  )

  const inboxDeploymentBlockNumber =
    templateVars.discovery.getContract('ValidatorTimelock').sinceBlock ?? 0

  return templateVars.usesBlobs
    ? [
        {
          type: 'ethereum',
          daLayer: ProjectId('ethereum'),
          sinceBlock: inboxDeploymentBlockNumber,
          inbox: validatorTimelock,
          sequencers: validatorsVTL,
        },
      ]
    : templateVars.celestiaDa
      ? [
          {
            type: 'celestia',
            daLayer: ProjectId('celestia'),
            // TODO: update to value from discovery
            sinceBlock: templateVars.celestiaDa.sinceBlock,
            namespace: templateVars.celestiaDa.namespace,
          },
        ]
      : templateVars.availDa
        ? [
            {
              type: 'avail',
              daLayer: ProjectId('avail'),
              // TODO: update to value from discovery
              sinceBlock: templateVars.availDa.sinceBlock,
              appId: templateVars.availDa.appId,
            },
          ]
        : undefined
}
