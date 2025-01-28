import type { ContractParameters } from '@l2beat/discovery-types'
import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import { ethereum } from '../../../chains/ethereum'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
  pickWorseRisk,
  sumRisk,
} from '../../../common'
import {
  formatChallengePeriod,
  formatDelay,
} from '../../../common/formatDelays'
import type { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../../discovery/values/hardcoded'
import type {
  ChainConfig,
  DataAvailabilityBridge,
  DataAvailabilityLayer,
  KnowledgeNugget,
  Milestone,
  ProjectDataAvailability,
  ProjectEscrow,
  ProjectTechnologyChoice,
  ReasonForBeingInOther,
  ScalingProject,
  ScalingProjectCategory,
  ScalingProjectContract,
  ScalingProjectDisplay,
  ScalingProjectPermission,
  ScalingProjectPurpose,
  ScalingProjectRiskView,
  ScalingProjectRiskViewEntry,
  ScalingProjectStateDerivation,
  ScalingProjectTechnology,
  TransactionApiConfig,
} from '../../../types'
import { Badge, type BadgeId } from '../../badges'
import type { DacDaLayer } from '../../da-beat/types'
import type { Layer3 } from '../../layer3s/types'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from '../common/liveness'
import { getStage } from '../common/stages/getStage'
import type { StageConfig } from '../common/stages/types'
import type {
  Layer2,
  Layer2Display,
  Layer2FinalityConfig,
  Layer2TxConfig,
} from '../types'
import { generateDiscoveryDrivenSections } from './generateDiscoveryDrivenSections'
import { explorerReferences, mergeBadges, safeGetImplementation } from './utils'

export const CELESTIA_DA_PROVIDER: DAProvider = {
  layer: DA_LAYERS.CELESTIA,
  riskView: RISK_VIEW.DATA_CELESTIA(false),
  technology: TECHNOLOGY_DATA_AVAILABILITY.CELESTIA_OFF_CHAIN(false),
  bridge: DA_BRIDGES.NONE,
  badge: Badge.DA.Celestia,
}

export const EIGENDA_DA_PROVIDER: DAProvider = {
  layer: DA_LAYERS.EIGEN_DA,
  riskView: RISK_VIEW.DATA_EIGENDA(false),
  technology: TECHNOLOGY_DATA_AVAILABILITY.EIGENDA_OFF_CHAIN(false),
  bridge: DA_BRIDGES.NONE,
  badge: Badge.DA.EigenDA,
}

export function DACHALLENGES_DA_PROVIDER(
  daChallengeWindow: string,
  daResolveWindow: string,
  nodeSourceLink?: string,
  daLayer: DataAvailabilityLayer = DA_LAYERS.NONE,
): DAProvider {
  return {
    layer: daLayer,
    riskView: RISK_VIEW.DATA_EXTERNAL_CHALLENGES,
    technology: TECHNOLOGY_DATA_AVAILABILITY.DACHALLENGES_OFF_CHAIN(
      daChallengeWindow,
      daResolveWindow,
      nodeSourceLink,
    ),
    bridge: DA_BRIDGES.NONE_WITH_DA_CHALLENGES,
    badge: Badge.DA.DAC,
  }
}

interface DAProvider {
  layer: DataAvailabilityLayer
  fallback?: DataAvailabilityLayer
  riskView: ScalingProjectRiskViewEntry
  technology: ProjectTechnologyChoice
  bridge: DataAvailabilityBridge
  badge: BadgeId
}

interface OpStackConfigCommon {
  architectureImage?: string
  isArchived?: true
  addedAt: UnixTime
  daProvider?: DAProvider
  dataAvailabilitySolution?: DacDaLayer
  discovery: ProjectDiscovery
  additionalDiscoveries?: { [chain: string]: ProjectDiscovery }
  upgradeability?: {
    upgradableBy: string[] | undefined
    upgradeDelay: string | undefined
  }
  l1StandardBridgeEscrow?: EthereumAddress
  l1StandardBridgeTokens?: string[]
  l1StandardBridgePremintedTokens?: string[]
  rpcUrl?: string
  transactionApi?: TransactionApiConfig
  genesisTimestamp: UnixTime
  finality?: Layer2FinalityConfig
  l2OutputOracle?: ContractParameters
  portal?: ContractParameters
  stateDerivation?: ScalingProjectStateDerivation
  milestones?: Milestone[]
  knowledgeNuggets?: KnowledgeNugget[]
  roleOverrides?: Record<string, string>
  nonTemplatePermissions?: ScalingProjectPermission[]
  nonTemplateNativePermissions?: Record<string, ScalingProjectPermission[]>
  nonTemplateContracts?: ScalingProjectContract[]
  nonTemplateNativeContracts?: Record<string, ScalingProjectContract[]>
  nonTemplateEscrows?: ProjectEscrow[]
  nonTemplateExcludedTokens?: string[]
  nonTemplateOptimismPortalEscrowTokens?: string[]
  nonTemplateTrackedTxs?: Layer2TxConfig[]
  nonTemplateTechnology?: Partial<ScalingProjectTechnology>
  associatedTokens?: string[]
  isNodeAvailable?: boolean | 'UnderReview'
  nodeSourceLink?: string
  chainConfig?: ChainConfig
  hasProperSecurityCouncil?: boolean
  usesBlobs?: boolean
  isUnderReview?: boolean
  stage?: StageConfig
  additionalBadges?: BadgeId[]
  discoveryDrivenData?: boolean
  additionalPurposes?: ScalingProjectPurpose[]
  riskView?: ScalingProjectRiskView
  gasTokens?: string[]
  usingAltVm?: boolean
  reasonsForBeingOther?: ReasonForBeingInOther[]
  display: Omit<ScalingProjectDisplay, 'provider' | 'category' | 'purposes'> & {
    category?: ScalingProjectCategory
  }
}

export interface OpStackConfigL2 extends OpStackConfigCommon {
  upgradesAndGovernance?: string
  display: Omit<Layer2Display, 'provider' | 'category' | 'purposes'> & {
    category?: Layer2Display['category']
  }
}

export interface OpStackConfigL3 extends OpStackConfigCommon {
  stackedRiskView?: ScalingProjectRiskView
  hostChain: ProjectId
}

function opStackCommon(
  type: (Layer2 | Layer3)['type'],
  templateVars: OpStackConfigCommon,
  explorerUrl: string | undefined,
  incomingNativeDA?: ProjectDataAvailability,
): Omit<ScalingProject, 'type' | 'display'> & {
  display: Pick<
    ScalingProjectDisplay,
    'architectureImage' | 'purposes' | 'stack' | 'category' | 'warning'
  >
} {
  const nativeContractRisks = [CONTRACTS.UPGRADE_NO_DELAY_RISK]
  const discoveryDrivenSections = templateVars.discoveryDrivenData
    ? generateDiscoveryDrivenSections(
        templateVars.discovery,
        nativeContractRisks,
        templateVars.additionalDiscoveries,
      )
    : undefined

  const optimismPortalTokens = [
    'ETH',
    ...(templateVars.nonTemplateOptimismPortalEscrowTokens ?? []),
  ]

  const sequencerInbox = EthereumAddress(
    templateVars.discovery.getContractValue('SystemConfig', 'sequencerInbox'),
  )

  const daProvider = getDAProvider(templateVars)
  const postsToEthereum = daProvider === undefined

  const usesBlobs =
    templateVars.usesBlobs ??
    templateVars.discovery.getContractValue<{
      isSequencerSendingBlobTx: boolean
    }>('SystemConfig', 'opStackDA').isSequencerSendingBlobTx

  let daBadge: BadgeId | undefined = daProvider?.badge
  if (postsToEthereum) {
    daBadge = usesBlobs ? Badge.DA.EthereumBlobs : Badge.DA.EthereumCalldata
  }

  assert(daBadge !== undefined, 'DA badge must be defined')

  const automaticBadges = templateVars.usingAltVm
    ? [Badge.Stack.OPStack, daBadge]
    : [Badge.Stack.OPStack, Badge.VM.EVM, daBadge]

  const nativeDA =
    incomingNativeDA ??
    addSentimentToDataAvailability({
      layers: [
        usesBlobs ? DA_LAYERS.ETH_BLOBS_OR_CALLDATA : DA_LAYERS.ETH_CALLDATA,
      ],
      bridge: DA_BRIDGES.ENSHRINED,
      mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
    })

  const portal =
    templateVars.portal ?? templateVars.discovery.getContract('OptimismPortal')
  const l2OutputOracle =
    templateVars.l2OutputOracle ??
    templateVars.discovery.getContract('L2OutputOracle')
  const l1StandardBridgeEscrow =
    templateVars.l1StandardBridgeEscrow ??
    templateVars.discovery.getContract('L1StandardBridge').address
  const upgradeability = templateVars.upgradeability ?? {
    upgradableBy: ['ProxyAdmin'],
    upgradeDelay: 'No delay',
  }

  // 4 cases: Optimium, Optimium + Superchain, Rollup, Rollup + Superchain
  // archi images defined locally in the project.ts take precedence over this one
  const architectureImage = `opstack-${postsToEthereum ? 'rollup' : 'optimium'}${templateVars.discovery.hasContract('SuperchainConfig') ? '-superchain' : ''}`

  return {
    isArchived: templateVars.isArchived,
    id: ProjectId(templateVars.discovery.projectName),
    addetAt: templateVars.addedAt,
    isUnderReview: templateVars.isUnderReview ?? false,
    display: {
      purposes: ['Universal', ...(templateVars.additionalPurposes ?? [])],
      architectureImage: templateVars.architectureImage ?? architectureImage,
      stack: 'OP Stack',
      category:
        templateVars.display.category ??
        (postsToEthereum ? 'Optimistic Rollup' : 'Optimium'),
      warning:
        templateVars.display.warning === undefined
          ? 'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.'
          : templateVars.display.warning,
    },
    chainConfig: templateVars.chainConfig,
    config: {
      associatedTokens: templateVars.associatedTokens,
      gasTokens: templateVars.gasTokens,
      transactionApi:
        templateVars.transactionApi ??
        (templateVars.rpcUrl !== undefined
          ? {
              type: 'rpc',
              startBlock: 1,
              defaultUrl: templateVars.rpcUrl,
              defaultCallsPerMinute: 1500,
              adjustCount: { type: 'SubtractOne' },
            }
          : undefined),
      escrows: [
        templateVars.discovery.getEscrowDetails({
          includeInTotal: type === 'layer2',
          address: portal.address,
          tokens: optimismPortalTokens,
          description: `Main entry point for users depositing ${optimismPortalTokens.join(
            ', ',
          )}.`,
          ...upgradeability,
        }),
        templateVars.discovery.getEscrowDetails({
          includeInTotal: type === 'layer2',
          address: l1StandardBridgeEscrow,
          tokens: templateVars.l1StandardBridgeTokens ?? '*',
          premintedTokens: templateVars.l1StandardBridgePremintedTokens,
          excludedTokens: templateVars.nonTemplateExcludedTokens,
          description:
            'Main entry point for users depositing ERC20 token that do not require custom gateway.',
          ...upgradeability,
        }),
        ...(templateVars.nonTemplateEscrows ?? []),
      ],
    },
    technology: {
      stateCorrectness: templateVars.nonTemplateTechnology
        ?.stateCorrectness ?? {
        name: 'Fraud proofs are not enabled',
        description:
          'OP Stack projects can use the OP fault proof system, already being deployed on some. This project though is not using fault proofs yet and is relying on the honesty of the permissioned Proposer and Challengers to ensure state correctness. The smart contract system permits invalid state roots.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'an invalid state root is submitted to the system.',
            isCritical: true,
          },
        ],
        references: explorerReferences(explorerUrl, [
          {
            title: 'L2OutputOracle.sol - source code, deleteL2Outputs function',
            address: safeGetImplementation(l2OutputOracle),
          },
        ]),
      },
      dataAvailability: templateVars.nonTemplateTechnology
        ?.dataAvailability ?? {
        ...technologyDA(daProvider, usesBlobs),
        references: [
          ...technologyDA(daProvider, usesBlobs).references,
          {
            title: 'Derivation: Batch submission - OP Mainnet specs',
            url: 'https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/derivation.md#batch-submission',
          },
          ...explorerReferences(explorerUrl, [
            { title: 'BatchInbox - address', address: sequencerInbox },
            {
              title:
                'OptimismPortal.sol - source code, depositTransaction function',
              address: safeGetImplementation(portal),
            },
          ]),
        ],
      },
      operator: templateVars.nonTemplateTechnology?.operator ?? {
        ...OPERATOR.CENTRALIZED_OPERATOR,
        references: explorerReferences(explorerUrl, [
          {
            title: 'L2OutputOracle.sol - source code, CHALLENGER address',
            address: safeGetImplementation(l2OutputOracle),
          },
          {
            title: 'L2OutputOracle.sol - source code, PROPOSER address',
            address: safeGetImplementation(l2OutputOracle),
          },
        ]),
      },
      forceTransactions: templateVars.nonTemplateTechnology
        ?.forceTransactions ?? {
        ...FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract'),
        references: [
          {
            title: 'Sequencing Window - OP Mainnet Specs',
            url: 'https://github.com/ethereum-optimism/optimism/blob/51eeb76efeb32b3df3e978f311188aa29f5e3e94/specs/glossary.md#sequencing-window',
          },
          ...explorerReferences(explorerUrl, [
            {
              title:
                'OptimismPortal.sol - source code, depositTransaction function',
              address: safeGetImplementation(portal),
            },
          ]),
        ],
      },
      exitMechanisms: templateVars.nonTemplateTechnology?.exitMechanisms ?? [
        {
          ...EXITS.REGULAR(
            'optimistic',
            'merkle proof',
            templateVars.discovery.getContractValue<number>(
              'L2OutputOracle',
              'FINALIZATION_PERIOD_SECONDS',
            ),
          ),
          references: explorerReferences(explorerUrl, [
            {
              title:
                'OptimismPortal.sol - source code, proveWithdrawalTransaction function',
              address: safeGetImplementation(portal),
            },
            {
              title:
                'OptimismPortal.sol - source code, finalizeWithdrawalTransaction function',
              address: safeGetImplementation(portal),
            },
            {
              title: 'L2OutputOracle.sol - source code, PROPOSER check',
              address: safeGetImplementation(l2OutputOracle),
            },
          ]),
          risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
        },
        {
          ...EXITS.FORCED('all-withdrawals'),
          references: [
            {
              title: 'Forced withdrawal from an OP Stack blockchain',
              url: 'https://stack.optimism.io/docs/security/forced-withdrawal/',
            },
          ],
        },
      ],
      otherConsiderations: templateVars.nonTemplateTechnology
        ?.otherConsiderations ?? [
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
    permissions: discoveryDrivenSections
      ? discoveryDrivenSections.permissions
      : [
          ...templateVars.discovery.getOpStackPermissions({
            batcherHash: 'Sequencer',
            PROPOSER: 'Proposer',
            GUARDIAN: 'Guardian',
            CHALLENGER: 'Challenger',
            ...(templateVars.roleOverrides ?? {}),
          }),
          ...(templateVars.nonTemplatePermissions ?? []),
        ],
    nativePermissions: discoveryDrivenSections
      ? discoveryDrivenSections.nativePermissions
      : templateVars.nonTemplateNativePermissions,
    contracts: discoveryDrivenSections
      ? discoveryDrivenSections.contracts
      : {
          addresses: [
            ...templateVars.discovery.getOpStackContractDetails(upgradeability),
            ...(templateVars.nonTemplateContracts ?? []),
          ],
          risks: nativeContractRisks,
          nativeAddresses: templateVars.nonTemplateNativeContracts,
        },
    milestones: templateVars.milestones ?? [],
    knowledgeNuggets: [
      ...(templateVars.knowledgeNuggets ?? []),
      {
        title: 'How Optimism compresses data',
        url: 'https://twitter.com/bkiepuszewski/status/1508740414492323840?s=20&t=vMgR4jW1ssap-A-MBsO4Jw',
        thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
      },
      {
        title: 'Superchain Explainer',
        url: 'https://docs.optimism.io/stack/explainer',
        thumbnail: NUGGETS.THUMBNAILS.OPTIMISM_03,
      },
      {
        title: 'Modular Rollup Theory',
        url: 'https://www.youtube.com/watch?v=jnVjhp41pcc',
        thumbnail: NUGGETS.THUMBNAILS.MODULAR_ROLLUP,
      },
    ],
    badges: mergeBadges(automaticBadges, templateVars.additionalBadges ?? []),
    dataAvailabilitySolution: templateVars.dataAvailabilitySolution,
    reasonsForBeingOther: templateVars.reasonsForBeingOther,
    stateDerivation: templateVars.stateDerivation,
    riskView:
      templateVars.riskView ?? getRiskView(templateVars, daProvider, portal),
    stage: templateVars.stage ?? computedStage(templateVars, postsToEthereum),
    dataAvailability: decideDA(daProvider, nativeDA),
  }
}

export function opStackL2(templateVars: OpStackConfigL2): Layer2 {
  const sequencerInbox = EthereumAddress(
    templateVars.discovery.getContractValue('SystemConfig', 'sequencerInbox'),
  )
  const sequencerAddress = EthereumAddress(
    templateVars.discovery.getContractValue('SystemConfig', 'batcherHash'),
  )

  const l2OutputOracle =
    templateVars.l2OutputOracle ??
    templateVars.discovery.getContract('L2OutputOracle')

  const FINALIZATION_PERIOD_SECONDS =
    templateVars.discovery.getContractValue<number>(
      l2OutputOracle.address,
      'FINALIZATION_PERIOD_SECONDS',
    )

  const common = opStackCommon('layer2', templateVars, ethereum.explorerUrl)
  return {
    type: 'layer2',
    ...common,
    display: {
      ...common.display,
      ...templateVars.display,
      warning: templateVars.display.warning,
      liveness: ifPostsToEthereum(templateVars, {
        warnings: {
          stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
        },
        explanation: `${
          templateVars.display.name
        } is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
          HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
        )} or until it gets published. The state root gets finalized ${formatSeconds(
          FINALIZATION_PERIOD_SECONDS,
        )} after it has been posted.`,
      }),
      finality: ifPostsToEthereum(templateVars, {
        warnings: {
          timeToInclusion: {
            sentiment: 'neutral',
            value:
              "It's assumed that transaction data batches are submitted sequentially.",
          },
        },
        finalizationPeriod: FINALIZATION_PERIOD_SECONDS,
      }),
    },
    config: {
      ...common.config,
      trackedTxs: ifPostsToEthereum(
        templateVars,
        templateVars.nonTemplateTrackedTxs ?? [
          {
            uses: [
              { type: 'liveness', subtype: 'batchSubmissions' },
              { type: 'l2costs', subtype: 'batchSubmissions' },
            ],
            query: {
              formula: 'transfer',
              from: sequencerAddress,
              to: sequencerInbox,
              sinceTimestamp: templateVars.genesisTimestamp,
            },
          },
          {
            uses: [
              { type: 'liveness', subtype: 'stateUpdates' },
              { type: 'l2costs', subtype: 'stateUpdates' },
            ],
            query: {
              formula: 'functionCall',
              address: l2OutputOracle.address,
              selector: '0x9aaab648',
              functionSignature:
                'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)',
              sinceTimestamp: new UnixTime(
                l2OutputOracle.sinceTimestamp ??
                  templateVars.genesisTimestamp.toNumber(),
              ),
            },
          },
        ],
      ),
      finality: ifPostsToEthereum(templateVars, templateVars.finality),
    },
    upgradesAndGovernance: templateVars.upgradesAndGovernance,
  }
}

export function opStackL3(templateVars: OpStackConfigL3): Layer3 {
  const layer2s = require('..').layer2s as Layer2[]
  const baseChain = layer2s.find((l2) => l2.id === templateVars.hostChain)
  assert(
    baseChain,
    `Could not find base chain ${templateVars.hostChain} in layer2s`,
  )

  const common = opStackCommon(
    'layer3',
    templateVars,
    baseChain.chainConfig?.explorerUrl,
    baseChain.dataAvailability,
  )

  const stackedRisk = {
    stateValidation: pickWorseRisk(
      common.riskView.stateValidation,
      baseChain.riskView.stateValidation,
    ),
    dataAvailability: pickWorseRisk(
      common.riskView.dataAvailability,
      baseChain.riskView.dataAvailability,
    ),
    exitWindow: pickWorseRisk(
      common.riskView.exitWindow,
      baseChain.riskView.exitWindow,
    ),
    sequencerFailure: sumRisk(
      common.riskView.sequencerFailure,
      baseChain.riskView.sequencerFailure,
      RISK_VIEW.SEQUENCER_SELF_SEQUENCE,
    ),
    proposerFailure: sumRisk(
      common.riskView.proposerFailure,
      baseChain.riskView.proposerFailure,
      RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED,
    ),
  }

  return {
    type: 'layer3',
    ...common,
    hostChain: templateVars.hostChain,
    display: { ...common.display, ...templateVars.display },
    stackedRiskView: templateVars.stackedRiskView ?? stackedRisk,
  }
}

function getRiskView(
  templateVars: OpStackConfigCommon,
  daProvider: DAProvider | undefined,
  portal: ContractParameters,
): ScalingProjectRiskView {
  const FINALIZATION_PERIOD_SECONDS: number =
    templateVars.discovery.getContractValue<number>(
      'L2OutputOracle',
      'FINALIZATION_PERIOD_SECONDS',
    )

  const l2OutputOracle =
    templateVars.l2OutputOracle ??
    templateVars.discovery.getContract('L2OutputOracle')

  return {
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      secondLine: formatChallengePeriod(FINALIZATION_PERIOD_SECONDS),
    },
    dataAvailability: {
      ...(daProvider === undefined
        ? RISK_VIEW.DATA_ON_CHAIN
        : daProvider.riskView),
      sources: [{ contract: portal.name, references: [] }],
    },
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW(0, FINALIZATION_PERIOD_SECONDS),
      sources: [{ contract: portal.name, references: [] }],
    },
    sequencerFailure: {
      // the value is inside the node config, but we have no reference to it
      // so we assume it to be the same value as in other op stack chains
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      ),
      secondLine: formatDelay(HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS),
      sources: [{ contract: portal.name, references: [] }],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [{ contract: l2OutputOracle.name, references: [] }],
    },
  }
}

function computedStage(
  templateVars: OpStackConfigCommon,
  postsToEthereum: boolean,
): StageConfig {
  if (!postsToEthereum || templateVars.isNodeAvailable === undefined) {
    return { stage: 'NotApplicable' }
  }

  return getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: templateVars.isNodeAvailable,
      },
      stage1: {
        stateVerificationOnL1: false,
        fraudProofSystemAtLeast5Outsiders: null,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp:
          templateVars.hasProperSecurityCouncil ?? null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink:
        templateVars.isNodeAvailable === true
          ? (templateVars.nodeSourceLink ??
            'https://github.com/ethereum-optimism/optimism/tree/develop/op-node')
          : '',
    },
  )
}

function decideDA(
  daProvider: DAProvider | undefined,
  nativeDA: ProjectDataAvailability | undefined,
): ProjectDataAvailability | undefined {
  if (daProvider !== undefined) {
    return addSentimentToDataAvailability({
      layers: daProvider.fallback
        ? [daProvider.layer, daProvider.fallback]
        : [daProvider.layer],
      bridge: daProvider.bridge,
      mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
    })
  }

  return nativeDA
}

function technologyDA(
  DA: DAProvider | undefined,
  usesBlobs: boolean | undefined,
): ProjectTechnologyChoice {
  if (DA !== undefined) {
    return DA.technology
  }

  if (usesBlobs) {
    return TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA
  }

  return TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA
}

function getDAProvider(
  templateVars: OpStackConfigCommon,
): DAProvider | undefined {
  const postsToCelestia =
    templateVars.usesBlobs ??
    templateVars.discovery.getContractValue<{
      isSomeTxsLengthEqualToCelestiaDAExample: boolean
    }>('SystemConfig', 'opStackDA').isSomeTxsLengthEqualToCelestiaDAExample
  const daProvider =
    templateVars.daProvider ??
    (postsToCelestia ? CELESTIA_DA_PROVIDER : undefined)

  if (daProvider === undefined) {
    assert(
      templateVars.isNodeAvailable !== undefined,
      'isNodeAvailable must be defined if no DA provider is defined',
    )
  }

  return daProvider
}

function ifPostsToEthereum<T>(
  templateVars: OpStackConfigCommon,
  value: T,
): T | undefined {
  return getDAProvider(templateVars) === undefined ? value : undefined
}
