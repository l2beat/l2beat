import type { EntryParameters } from '@l2beat/discovery'
import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
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
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../common'
import { BADGES } from '../common/badges'
import { PROGRAM_HASHES } from '../common/programHashes'
import { getAltDaStage } from '../common/stages/getAltDaStage'
import { getRollupStage } from '../common/stages/getRollupStage'
import type { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import type {
  Layer2TxConfig,
  ProjectScalingDisplay,
  ProjectScalingRiskView,
  ProjectScalingTechnology,
  ScalingProject,
} from '../internalTypes'
import type {
  Badge,
  ChainConfig,
  InteropConfig,
  Milestone,
  ProjectActivityConfig,
  ProjectContract,
  ProjectDaTrackingConfig,
  ProjectEcosystemInfo,
  ProjectEscrow,
  ProjectPermissions,
  ProjectScalingCapability,
  ProjectScalingProofSystem,
  ProjectScalingPurpose,
  ProjectScalingScopeOfAssessment,
  ProjectScalingStage,
  ProjectTechnologyChoice,
  ProjectUpgradeableActor,
  ReasonForBeingInOther,
  TableReadyValue,
} from '../types'

import { readMarkdown } from '../utils/readMarkdown'
import { getActivityConfig } from './activity'
import { getDiscoveryInfo } from './getDiscoveryInfo'
import { getSP1Verifiers } from './opStack'
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
  display: Omit<ProjectScalingDisplay, 'provider' | 'category' | 'purposes'>
  daProvider?: DAProvider
  upgradeability?: {
    upgradableBy: string[] | undefined
    upgradeDelay: string | undefined
  }
  l1StandardBridgeEscrow?: EthereumAddress
  l1StandardBridgeTokens?: string[]
  l1StandardBridgePremintedTokens?: string[]
  activityConfig?: ProjectActivityConfig
  nonTemplateProofSystem?: ProjectScalingProofSystem
  nonTemplateTrackedTxs?: Layer2TxConfig[]
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
  chainId: number
  isUnderReview?: boolean
  stage?: ProjectScalingStage
  additionalBadges?: Badge[]
  useDiscoveryMetaOnly?: boolean
  additionalPurposes?: ProjectScalingPurpose[]
  overridingPurposes?: ProjectScalingPurpose[]
  archivedAt?: UnixTime
  nonTemplateRiskView?: Partial<ProjectScalingRiskView>
  nonTemplateTechnology?: Partial<ProjectScalingTechnology>
  reasonsForBeingOther?: ReasonForBeingInOther[]
  ecosystemInfo?: ProjectEcosystemInfo
  validatorTimelockOnGateway?: EntryParameters
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
  scopeOfAssessment?: ProjectScalingScopeOfAssessment
  interopConfig?: InteropConfig
  // For Stage 1 requirement. In theory could also be determined from discovery and zk catalog
  zkVerifierContractsReproducible?: boolean
  // altDA stage inputs (used when the project is a Validium/Optimium)
  daAttestedByIndependentParty?: boolean
  daVerifierSecureOnL1?: boolean
  daVerifier7DayExitWindow?: boolean
  daVerifier30DayExitWindow?: boolean
  daCommitteeDecentralized?: boolean
  /** Override for the static economic-security check derived from the DA layer. */
  daMechanismEconomicSecurity?: boolean
  daVerifierLink?: string
  proverSourceLink?: string
  securityCouncilReference?: string
  /** Override for altDA Stage 1 principle description (rollup keeps hardcoded). */
  stage1PrincipleDescription?: string
  /** Manual altDA Stage 1 principle verdict (defaults to false, matching rollup). */
  stage1Principle?: boolean | 'UnderReview'
  /** Stage 1: is the chain's own Security Council / ChainAdmin properly set up? */
  hasProperSecurityCouncil?: boolean
}

export type Upgradeability = {
  upgradableBy?: ProjectUpgradeableActor[]
}

export function zkStackL2(templateVars: ZkStackConfigCommon): ScalingProject {
  const daProvider = templateVars.daProvider
  if (daProvider) {
    assert(
      templateVars.additionalBadges?.find((b) => b.type === 'DA') !== undefined,
      'DA badge missing',
    )
  }

  const protVotingDelayS = templateVars.discovery.getContractValue<number>(
    'ZkProtocolGovernor',
    'votingDelay',
  )
  const protVotingPeriodS = templateVars.discovery.getContractValue<number>(
    'ZkProtocolGovernor',
    'votingPeriod',
  )

  const protLateQuorumVoteExtensionS =
    templateVars.discovery.getContractValue<number>(
      'ZkProtocolGovernor',
      'lateQuorumVoteExtension',
    )
  const protTlMinDelayS = templateVars.discovery.getContractValue<number>(
    'ProtocolTimelockController',
    'getMinDelay',
  )

  const diamondContract = templateVars.discovery.getContract('Diamond')

  // chainid diamond address sanity check
  const zkChainsChainIdArr = templateVars.discovery.getContractValue<number[]>(
    'BridgeHub',
    'getAllZKChainChainIDs',
  )
  const zkChainsAddressArr = templateVars.discovery.getContractValue<
    ChainSpecificAddress[]
  >('BridgeHub', 'getAllZKChains')

  // Map chainId <-> diamond address
  const chainIdToDiamondAddress: Record<number, ChainSpecificAddress> = {}
  for (let i = 0; i < zkChainsChainIdArr.length; i++) {
    chainIdToDiamondAddress[zkChainsChainIdArr[i]] = zkChainsAddressArr[i]
  }

  assert(
    chainIdToDiamondAddress[templateVars.chainId] === diamondContract.address,
    `Diamond address ${chainIdToDiamondAddress[templateVars.chainId]} does not match for the given chainId ${templateVars.chainId} in project ${templateVars.discovery.projectName}`,
  )

  const settlesOnGateway =
    templateVars.discovery.getContractValue<string>(
      diamondContract.name ?? 'ZKsync',
      'getSettlementLayer',
    ) === 'eth:0x6E96D1172a6593D5027Af3c2664C5112Ca75F2B9'
  let executionDelayS = templateVars.discovery.getContractValue<number>(
    'ValidatorTimelock',
    'executionDelay',
  )
  if (settlesOnGateway) {
    // add gateway VTL delay (usually 0)
    executionDelayS += Number(
      templateVars.validatorTimelockOnGateway?.values?.executionDelay,
    )
  }
  const executionDelay =
    executionDelayS > 0 ? formatSeconds(executionDelayS) : undefined

  const legalVetoStandardS = templateVars.discovery.getContractValue<number>(
    'ProtocolUpgradeHandler',
    'STANDARD_LEGAL_VETO_PERIOD',
  )
  const legalVetoExtendedS = templateVars.discovery.getContractValue<number>(
    'ProtocolUpgradeHandler',
    'EXTENDED_LEGAL_VETO_PERIOD',
  )
  const upgradeDelayPeriodS = templateVars.discovery.getContractValue<number>(
    'ProtocolUpgradeHandler',
    'UPGRADE_DELAY_PERIOD',
  )
  const upgradeWaitOrExpireS = templateVars.discovery.getContractValue<number>(
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

  const softFreezeS = templateVars.discovery.getContractValue<number>(
    'ProtocolUpgradeHandler',
    'SOFT_FREEZE_PERIOD',
  )
  const hardFreezeS = templateVars.discovery.getContractValue<number>(
    'ProtocolUpgradeHandler',
    'HARD_FREEZE_PERIOD',
  )

  const scMemberCount = templateVars.discovery.getContractValue<string[]>(
    'SecurityCouncil',
    '$members',
  ).length
  const scApprovalThreshold = templateVars.discovery.getContractValue<number>(
    'SecurityCouncil',
    'APPROVE_UPGRADE_SECURITY_COUNCIL_THRESHOLD',
  )
  const scMainThreshold = templateVars.discovery.getContractValue<number>(
    'SecurityCouncil',
    'EIP1271_THRESHOLD',
  )
  const guardiansMemberCount = templateVars.discovery.getContractValue<
    string[]
  >('Guardians', '$members').length
  const guardiansMainThreshold =
    templateVars.discovery.getContractValue<number>(
      'Guardians',
      'EIP1271_THRESHOLD',
    )
  const guardiansExtendThreshold =
    templateVars.discovery.getContractValue<number>(
      'Guardians',
      'EXTEND_LEGAL_VETO_THRESHOLD',
    )
  const protocolStartProposalThresholdM =
    templateVars.discovery.getContractValueBigInt(
      'ZkProtocolGovernor',
      'proposalThreshold',
    ) / 1000000000000000000000000n // result: M of tokens
  const protocolQuorumM =
    templateVars.discovery.getContractValueBigInt(
      'ZkProtocolGovernor',
      'currentQuorum',
    ) / 1000000000000000000000000n // result: M of tokens
  const scThresholdString = `${scMainThreshold}/${scMemberCount}`
  const guardiansThresholdString = `${guardiansMainThreshold}/${guardiansMemberCount}`

  const hasNoProofs = templateVars.reasonsForBeingOther?.some(
    (e) => e.label === REASON_FOR_BEING_OTHER.NO_PROOFS.label,
  )

  const l2BootloaderHash = templateVars.discovery.getContractValue<string>(
    diamondContract.address,
    'getL2BootloaderBytecodeHash',
  )

  const baseBadges = [
    BADGES.Stack.ZKStack,
    BADGES.Infra.ElasticChain,
    BADGES.VM.EVM,
  ]

  if (!daProvider) {
    baseBadges.push(BADGES.DA.EthereumBlobs)
  }

  return {
    type: 'layer2',
    id: ProjectId(templateVars.discovery.projectName),
    addedAt: templateVars.addedAt,
    capability: templateVars.capability ?? 'universal',
    archivedAt: templateVars.archivedAt,
    badges: mergeBadges(baseBadges, templateVars.additionalBadges ?? []),
    display: {
      purposes: templateVars.overridingPurposes ?? [
        'Universal',
        ...(templateVars.additionalPurposes ?? []),
      ],
      stacks: ['ZK Stack'],
      architectureImage:
        templateVars.daProvider !== undefined
          ? 'zkstack-validium'
          : settlesOnGateway
            ? 'zkstack-rollup-gateway'
            : 'zkstack-rollup',
      liveness: {
        explanation: executionDelay
          ? `${templateVars.display.name} is a ${
              daProvider !== undefined
                ? 'Validium that posts commitments'
                : 'ZK rollup that posts state diffs'
            } to the L1. Transactions within a state diff can be considered final when proven on L1 using a ZK proof, except that an operator can revert them if not executed yet. Currently, there is at least a ${executionDelay} delay between state diffs verification and the execution of the corresponding state actions.`
          : undefined,
      },
      tvsWarning: templateVars.display.tvsWarning,
      ...templateVars.display,
    },
    proofSystem:
      templateVars.nonTemplateProofSystem ??
      (hasNoProofs
        ? undefined
        : { type: 'Validity', zkCatalogId: ProjectId('boojum') }),
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
      trackedTxs: templateVars.nonTemplateTrackedTxs, // difficult to templatize as upgrades are not synced
    },
    chainConfig: templateVars.chainConfig && {
      ...templateVars.chainConfig,
      gasTokens: templateVars.chainConfig?.gasTokens ?? ['ETH'],
    },
    ecosystemInfo: templateVars.ecosystemInfo,
    dataAvailability: {
      layer: daProvider?.layer ?? DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
      bridge: daProvider?.bridge ?? DA_BRIDGES.ENSHRINED,
      mode: DA_MODES.STATE_DIFFS_COMPRESSED,
    },
    interopConfig: templateVars.interopConfig
      ? {
          description:
            'The canonical or trust-minimized bridge: ZK stack uses canonical bridges to and from Ethereum, based on the security of validity proofs. Native interop within the stack is not enabled',
          ...templateVars.interopConfig,
        }
      : undefined,
    riskView: {
      stateValidation: templateVars.nonTemplateRiskView?.stateValidation ?? {
        ...RISK_VIEW.STATE_ZKP_ST_SN_WRAP,
        executionDelay: executionDelayS,
      },
      dataAvailability:
        templateVars.nonTemplateRiskView?.dataAvailability ??
        (daProvider !== undefined
          ? daProvider?.riskView
          : RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS),
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
        ? getAltDaStage(
            {
              stage0: {
                callsItselfValidiumOrOptimium: true,
                stateRootsPostedToL1: true,
                stateVerificationOnL1: true,
                daAttestedByIndependentParty:
                  templateVars.daAttestedByIndependentParty ?? null,
                nodeSourceAvailable: true,
                fraudProofSystemAtLeast5Outsiders: null,
              },
              stage1: {
                principle: templateVars.stage1Principle ?? false,
                usersCanExitWithoutCooperation: false,
                usersHave7DaysToExit: false,
                securityCouncilProperlySetUp:
                  templateVars.hasProperSecurityCouncil ?? false,
                daVerifierSecureOnL1: templateVars.daVerifierSecureOnL1 ?? null,
                daVerifier7DayExitWindow:
                  templateVars.daVerifier7DayExitWindow ?? null,
                daCommitteeDecentralized:
                  templateVars.daCommitteeDecentralized ?? null,
                noRedTrustedSetups: true,
                proverSourcePublished: true,
                verifierContractsReproducible:
                  templateVars.zkVerifierContractsReproducible ?? null,
                programHashesReproducible:
                  programHashesReproducible(l2BootloaderHash),
              },
              stage2: {
                fraudProofSystemIsPermissionless: null,
                delayWith30DExitWindow: false,
                proofSystemOverriddenOnlyInCaseOfABug: null,
                daVerifier30DayExitWindow:
                  templateVars.daVerifier30DayExitWindow ?? null,
                daMechanismEconomicSecurity:
                  templateVars.daMechanismEconomicSecurity ?? null,
              },
            },
            {
              nodeSourceLink: 'https://github.com/matter-labs/zksync-era',
              proverSourceLink: templateVars.proverSourceLink,
              securityCouncilReference: templateVars.securityCouncilReference,
              stage1PrincipleDescription:
                templateVars.stage1PrincipleDescription,
              daVerifierLink: templateVars.daVerifierLink,
            },
          )
        : getRollupStage(
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
                securityCouncilProperlySetUp: true,
                noRedTrustedSetups: true,
                programHashesReproducible:
                  programHashesReproducible(l2BootloaderHash),
                proverSourcePublished: true,
                verifierContractsReproducible:
                  templateVars.zkVerifierContractsReproducible ?? null,
              },
              stage2: {
                proofSystemOverriddenOnlyInCaseOfABug: null,
                fraudProofSystemIsPermissionless: null,
                delayWith30DExitWindow: false,
              },
            },
            {
              rollupNodeLink: 'https://github.com/matter-labs/zksync-era',
              stage1PrincipleDescription:
                'While the Security Council is properly set up and is able to recover from a misbehaving operator, the majority is required, meaning that a compromised quorum-blocking minority can prevent users from exiting. Recovery actions are not straightforward and require complex protocol upgrades.',
            },
          )),
    technology: {
      sequencing: templateVars.nonTemplateTechnology?.sequencing,
      dataAvailability:
        templateVars.nonTemplateTechnology?.dataAvailability ??
        technologyDA(daProvider),
      operator: getTechnologyOperator(templateVars),
      forceTransactions: templateVars.nonTemplateTechnology
        ?.forceTransactions ?? {
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
      exitMechanisms: templateVars.nonTemplateTechnology?.exitMechanisms ?? [
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
      otherConsiderations:
        templateVars.nonTemplateTechnology?.otherConsiderations ??
        (settlesOnGateway
          ? [
              {
                name: 'Gateway - Intermediate Settlement Layer',
                description: `This chain settles on the Gateway, a validity rollup on Ethereum used as a specialized settlement layer. Chains settling on the Gateway keep the same overall architecture as when settling on Ethereum, but their main entrypoints and bridge messaging are replicated on both Ethereum and the Gateway. This abstracts away the intermediate settlement layer for users. Operators provide data and proofs on the Gateway as they would on Ethereum, and proofs are then aggregated into a single Gateway validity proof on Ethereum for all chains settling on the Gateway. Since ZK stack rollups use state diffs for data availability, pubdata posted to the Gateway must be relayed via L2->L1 messages by a 'RelayedSLDAValidator' contract. Unless stated otherwise, the permissions and governance for a given chain are synced between the Gateway and Ethereum.`,
                references: [
                  {
                    title: 'Gateway - ZKsync Era Documentation',
                    url: 'https://matter-labs.github.io/zksync-era/core/latest/specs/contracts/gateway/overview.html',
                  },
                ],
                risks: [
                  {
                    category: 'Funds can be stolen if',
                    text: "the Gateway settlement rollup's additional trust assumptions (different operators, separate rollup) are exploited.",
                  },
                ],
              },
            ]
          : undefined),
    },
    upgradesAndGovernance: {
      content: readMarkdown('templates/zkStack/upgradesAndGovernance.md', {
        scApprovalThreshold,
        protocolStartProposalThresholdM,
        protVotingDelayS: formatSeconds(protVotingDelayS),
        protVotingPeriodS: formatSeconds(protVotingPeriodS),
        protocolQuorumM,
        protLateQuorumVoteExtensionS: formatSeconds(
          protLateQuorumVoteExtensionS,
        ),
        protTlMinDelayS: formatSeconds(protTlMinDelayS),
        executionDelay,
        legalVetoStandardS: formatSeconds(legalVetoStandardS),
        guardiansExtendThreshold,
        legalVetoExtendedS: formatSeconds(legalVetoExtendedS),
        upgradeWaitOrExpireS: formatSeconds(upgradeWaitOrExpireS),
        upgradeDelayPeriodS: formatSeconds(upgradeDelayPeriodS),
        scThresholdString,
        guardiansThresholdString,
        zkFoundationStats: templateVars.discovery.getMultisigStats(
          'ZK Foundation Multisig',
        ),
        upgradeDelayWithScApprovalS: formatSeconds(upgradeDelayWithScApprovalS),
        upgradeDelayWithScApprovalExtendedLegalVotingS: formatSeconds(
          upgradeDelayWithScApprovalExtendedLegalVotingS,
        ),
        upgradeDelayNoScS: formatSeconds(upgradeDelayNoScS),
        softFreezeS: formatSeconds(softFreezeS),
        hardFreezeS: formatSeconds(hardFreezeS),
      }),
      image: 'zkstack',
    },
    permissions: mergePermissions(
      templateVars.discovery.getDiscoveredPermissions(),
      templateVars.nonTemplatePermissions ?? {},
    ),
    contracts: {
      addresses: templateVars.discovery.getDiscoveredContracts(),
      risks: [
        CONTRACTS.UPGRADE_WITH_DELAY_RISK_WITH_EXCEPTION(
          // a bit hacky, but re-using the function from arbitrum (3 cases: standard (with or without extension by Guardians), emergency)
          `${formatSeconds(upgradeDelayWithScApprovalS)} - ${formatSeconds(
            upgradeDelayWithScApprovalExtendedLegalVotingS,
          )}`,
          'EmergencyUpgradeBoard',
        ),
      ],
      programHashes: [PROGRAM_HASHES(l2BootloaderHash)],
      zkVerifiers: getZKStackVerifiers(
        templateVars.discovery,
        templateVars.archivedAt !== undefined,
      ),
    },
    stateDerivation:
      daProvider !== undefined
        ? undefined
        : {
            nodeSoftware: `The node software is open-source, and its source code can be found [here](https://github.com/matter-labs/zksync-era).
    The main node software does not rely on Layer 1 (L1) to reconstruct the state, but you can use [this tool](https://github.com/eqlabs/zksync-state-reconstruct) for that purpose. Currently, there is no straightforward method to inject the state into the main node, but ZKsync is actively working on a solution for this.`,
            compressionScheme:
              'Bytecodes undergo compression before deployment on Layer 1 (L1). You can find additional information on this process [here](https://github.com/matter-labs/zksync-era/blob/main/docs/src/guides/advanced/11_compression.md).',
            genesisState:
              'There have been neither genesis states nor regenesis.',
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
            'ZKsync Era proof system Boojum can be found [here](https://github.com/matter-labs/era-boojum/tree/main) and contains essential tools like the Prover, the Verifier, and other backend components. The specs of the system can be found [here](https://github.com/matter-labs/zksync-era/tree/main/prover).',
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
    },
    milestones: templateVars.milestones ?? [],
    reasonsForBeingOther: templateVars.reasonsForBeingOther,
    scopeOfAssessment: templateVars.scopeOfAssessment,
    discoveryInfo: getDiscoveryInfo([templateVars.discovery]),
  }
}

function getTechnologyOperator(
  templateVars: ZkStackConfigCommon,
): ProjectTechnologyChoice {
  if (templateVars.nonTemplateTechnology?.operator !== undefined) {
    return templateVars.nonTemplateTechnology.operator
  }

  if (!templateVars.discovery.hasContract('EraMultisigValidator')) {
    return OPERATOR.CENTRALIZED_OPERATOR
  }

  const eraMultisigValidator = templateVars.discovery.getContract(
    'EraMultisigValidator',
  )

  return {
    ...OPERATOR.CENTRALIZED_OPERATOR,
    description:
      OPERATOR.CENTRALIZED_OPERATOR.description +
      '\n\n' +
      'Batch execution is initiated by permissioned executor EOAs, but each batch also requires approval from the sufficient number of EraMultisigValidator members before it can be executed on L1.',
    references: [
      {
        title: `${eraMultisigValidator.name} - Etherscan proxy contract`,
        url: `https://etherscan.io/address/${ChainSpecificAddress.address(
          eraMultisigValidator.address,
        )}`,
      },
    ],
    risks: [
      ...OPERATOR.CENTRALIZED_OPERATOR.risks,
      {
        category: 'Users can be censored if',
        text: 'the validator multisig does not approve batch execution.',
      },
    ],
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
  // Return non-template tracking if it exists
  if (templateVars.nonTemplateDaTracking) {
    return templateVars.nonTemplateDaTracking
  }

  if (templateVars.usesEthereumBlobs) {
    const validatorTimelockEntry =
      templateVars.discovery.getContract('ValidatorTimelock')
    const validatorTimelock = ChainSpecificAddress.address(
      validatorTimelockEntry.address,
    )

    const inboxDeploymentBlockNumber = validatorTimelockEntry.sinceBlock ?? 0
    const diamond = ChainSpecificAddress.address(
      templateVars.discovery.getContract('Diamond').address,
    )
    const protocolVersion = templateVars.discovery.getContractValue<number[]>(
      'Diamond',
      'getSemverProtocolVersion',
    )
    const isPostV29 = usesChainAddressForDaTracking(protocolVersion)

    return [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: inboxDeploymentBlockNumber,
        inbox: validatorTimelock,
        calls: [
          isPostV29
            ? {
                selector: '0x0db9eb87',
                firstParameter: diamond,
              }
            : {
                selector: '0x98f81962',
                firstParameter: templateVars.chainId,
              },
        ],
      },
    ]
  }

  if (templateVars.celestiaDa) {
    return [
      {
        type: 'celestia',
        daLayer: ProjectId('celestia'),
        // TODO: update to value from discovery
        sinceBlock: templateVars.celestiaDa.sinceBlock,
        namespace: templateVars.celestiaDa.namespace,
      },
    ]
  }

  if (templateVars.availDa) {
    return [
      {
        type: 'avail',
        daLayer: ProjectId('avail'),
        // TODO: update to value from discovery
        sinceBlock: templateVars.availDa.sinceBlock,
        appIds: templateVars.availDa.appIds,
      },
    ]
  }

  return undefined
}

export function usesChainAddressForDaTracking(
  protocolVersion: number[],
): boolean {
  const protocolMinorVersion = protocolVersion[1]
  assert(
    protocolMinorVersion === 28 || protocolMinorVersion === 29,
    `Unsupported zkStack protocol version for DA tracking: ${protocolVersion.join('.')}`,
  )
  return protocolMinorVersion === 29
}

function programHashesReproducible(l2BootloaderHash: string): boolean | null {
  const vStatus = PROGRAM_HASHES(l2BootloaderHash).verificationStatus
  if (vStatus === 'unsuccessful') return false
  if (vStatus === 'successful') return true
  return null
}

// get all verifiers that can prove STF of an L2
// export because adi is not currently set up as a template but should get verifiers by this logic
export function getZKStackVerifiers(
  discovery: ProjectDiscovery,
  isArchived: boolean,
): ChainSpecificAddress[] {
  const result: ChainSpecificAddress[] = []
  if (isArchived) {
    // don't want to bother setting up archived projects
    return result
  }
  if (discovery.hasContract('DualVerifier')) {
    result.push(
      discovery.getContractValue<ChainSpecificAddress>(
        'DualVerifier',
        'FFLONK_VERIFIER',
      ),
    )
    result.push(
      discovery.getContractValue<ChainSpecificAddress>(
        'DualVerifier',
        'PLONK_VERIFIER',
      ),
    )
  } else if (discovery.hasContract('Verifier')) {
    // currently only Treasury has this setup
    result.push(discovery.getContract('Verifier').address)
  } else if (discovery.hasContract('ZKsyncOSDualVerifier')) {
    // probably all aibender-based chains will fall under this case
    const fflonk0 = discovery.getContractValue<ChainSpecificAddress>(
      'ZKsyncOSDualVerifier',
      'fflonkVerifier0',
    )
    if (ChainSpecificAddress.address(fflonk0) !== EthereumAddress.ZERO) {
      result.push(fflonk0)
    }
    const plonk0 = discovery.getContractValue<ChainSpecificAddress>(
      'ZKsyncOSDualVerifier',
      'plonkVerifier0',
    )
    if (ChainSpecificAddress.address(plonk0) !== EthereumAddress.ZERO) {
      result.push(plonk0)
    }
    const fflonk1 = discovery.getContractValue<ChainSpecificAddress>(
      'ZKsyncOSDualVerifier',
      'fflonkVerifier1',
    )
    const plonk1 = discovery.getContractValue<ChainSpecificAddress>(
      'ZKsyncOSDualVerifier',
      'plonkVerifier1',
    )
    if (
      ChainSpecificAddress.address(fflonk1) !== EthereumAddress.ZERO ||
      ChainSpecificAddress.address(plonk1) !== EthereumAddress.ZERO
    ) {
      throw new Error(
        `Verifier discovery for ${discovery.projectName} is misconfigured: both plonk1 and fflonk1 are expected to be zero addresses. Manually review and setup verifiers for zk catalog.`,
      )
    }
  } else {
    throw new Error(
      `Cannot configure ZK Stack project verifiers (${discovery.projectName}), edit template file`,
    )
  }
  if (discovery.hasContract('SP1VerifierGateway')) {
    // happens for vector projects
    return result.concat(getSP1Verifiers(discovery))
  }
  return result
}
