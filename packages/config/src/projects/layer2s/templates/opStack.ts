import {
  ContractParameters,
  get$Implementations,
} from '@l2beat/discovery-types'
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
  DataAvailabilityBridge,
  DataAvailabilityLayer,
  EXITS,
  FORCE_TRANSACTIONS,
  KnowledgeNugget,
  Milestone,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  ScalingProjectContract,
  ScalingProjectEscrow,
  ScalingProjectPermission,
  ScalingProjectPurpose,
  ScalingProjectRiskView,
  ScalingProjectRiskViewEntry,
  ScalingProjectStateDerivation,
  ScalingProjectTechnology,
  ScalingProjectTechnologyChoice,
  ScalingProjectTransactionApi,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
  pickWorseRisk,
  sumRisk,
} from '../../../common'
import { ChainConfig } from '../../../common/ChainConfig'
import { subtractOne } from '../../../common/assessCount'
import {
  formatChallengePeriod,
  formatDelay,
} from '../../../common/formatDelays'
import { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../../discovery/values/hardcoded'
import { Badge, BadgeId, badges } from '../../badges'
import { type Layer3, type Layer3Display } from '../../layer3s/types'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from '../common/liveness'
import { getStage } from '../common/stages/getStage'
import { StageConfig } from '../common/stages/types'
import {
  type Layer2,
  type Layer2Display,
  Layer2FinalityConfig,
  Layer2TxConfig,
} from '../types'
import { generateDiscoveryDrivenSections } from './generateDiscoveryDrivenSections'
import { mergeBadges } from './utils'

export const CELESTIA_DA_PROVIDER: DAProvider = {
  layer: DA_LAYERS.CELESTIA,
  riskView: RISK_VIEW.DATA_CELESTIA(false),
  technology: TECHNOLOGY_DATA_AVAILABILITY.CELESTIA_OFF_CHAIN(false),
  bridge: DA_BRIDGES.NONE,
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
  }
}

interface DAProvider {
  layer: DataAvailabilityLayer
  fallback?: DataAvailabilityLayer
  riskView: ScalingProjectRiskViewEntry
  technology: ScalingProjectTechnologyChoice
  bridge: DataAvailabilityBridge
}

interface OpStackConfigCommon {
  isArchived?: true
  createdAt: UnixTime
  daProvider?: DAProvider
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
  transactionApi?: ScalingProjectTransactionApi
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
  nonTemplateEscrows?: ScalingProjectEscrow[]
  nonTemplateExcludedTokens?: string[]
  nonTemplateOptimismPortalEscrowTokens?: string[]
  nonTemplateTrackedTxs?: Layer2TxConfig[]
  nonTemplateTechnology?: Partial<ScalingProjectTechnology>
  associatedTokens?: string[]
  isNodeAvailable?: boolean | 'UnderReview'
  nodeSourceLink?: string
  chainConfig?: ChainConfig
  upgradesAndGovernance?: string
  hasProperSecurityCouncil?: boolean
  usesBlobs?: boolean
  isUnderReview?: boolean
  stage?: StageConfig
  additionalBadges?: BadgeId[]
  discoveryDrivenData?: boolean
  additionalPurposes?: ScalingProjectPurpose[]
}

export interface OpStackConfigL2 extends OpStackConfigCommon {
  display: Omit<Layer2Display, 'provider' | 'category' | 'purposes'> & {
    category?: Layer2Display['category']
  }
}

export interface OpStackConfigL3 extends OpStackConfigCommon {
  display: Omit<Layer3Display, 'provider' | 'category' | 'purposes'> & {
    category?: Layer3Display['category']
  }
  stackedRiskView?: ScalingProjectRiskView
  hostChain: ProjectId
  nativeToken?: string
}

function opStackCommon(
  templateVars: OpStackConfigCommon,
): Omit<Layer2, 'type' | 'display' | 'config' | 'stage' | 'riskView'> {
  const nativeContractRisks = [CONTRACTS.UPGRADE_NO_DELAY_RISK]
  const discoveryDrivenSections = templateVars.discoveryDrivenData
    ? generateDiscoveryDrivenSections(
        templateVars.discovery,
        nativeContractRisks,
        templateVars.additionalDiscoveries,
      )
    : undefined

  const sequencerInbox = EthereumAddress(
    templateVars.discovery.getContractValue('SystemConfig', 'sequencerInbox'),
  )

  const postsToCelestia = templateVars.discovery.getContractValue<{
    isSomeTxsLengthEqualToCelestiaDAExample: boolean
  }>('SystemConfig', 'opStackDA').isSomeTxsLengthEqualToCelestiaDAExample
  const daProvider =
    templateVars.daProvider ??
    (postsToCelestia ? CELESTIA_DA_PROVIDER : undefined)

  let daBadge: BadgeId | undefined = postsToCelestia
    ? Badge.DA.Celestia
    : undefined

  const usesBlobs =
    templateVars.usesBlobs ??
    templateVars.discovery.getContractValue<{
      isSequencerSendingBlobTx: boolean
    }>('SystemConfig', 'opStackDA').isSequencerSendingBlobTx

  if (daProvider === undefined) {
    assert(
      templateVars.isNodeAvailable !== undefined,
      'isNodeAvailable must be defined if no DA provider is defined',
    )
    daBadge = usesBlobs ? Badge.DA.EthereumBlobs : Badge.DA.EthereumCalldata
  }

  if (daBadge === undefined) {
    daBadge = templateVars.additionalBadges?.find(
      (b) => badges[b].type === 'DA',
    )
  }
  assert(daBadge !== undefined, 'DA badge must be defined')

  const portal =
    templateVars.portal ?? templateVars.discovery.getContract('OptimismPortal')
  const l2OutputOracle =
    templateVars.l2OutputOracle ??
    templateVars.discovery.getContract('L2OutputOracle')
  const upgradeability = templateVars.upgradeability ?? {
    upgradableBy: ['ProxyAdmin'],
    upgradeDelay: 'No delay',
  }

  return {
    isArchived: templateVars.isArchived,
    id: ProjectId(templateVars.discovery.projectName),
    createdAt: templateVars.createdAt,
    isUnderReview: templateVars.isUnderReview ?? false,
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
        references: [
          {
            text: 'L2OutputOracle.sol - Etherscan source code, deleteL2Outputs function',
            href: `https://etherscan.io/address/${safeGetImplementation(
              l2OutputOracle,
            )}#code`,
          },
        ],
      },
      dataAvailability: templateVars.nonTemplateTechnology
        ?.dataAvailability ?? {
        ...technologyDA(daProvider, usesBlobs),
        references: [
          ...technologyDA(daProvider, usesBlobs).references,
          {
            text: 'Derivation: Batch submission - OP Mainnet specs',
            href: 'https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/derivation.md#batch-submission',
          },
          {
            text: 'BatchInbox - Etherscan address',
            href: `https://etherscan.io/address/${sequencerInbox.toString()}`,
          },
          {
            text: 'OptimismPortal.sol - Etherscan source code, depositTransaction function',
            href: `https://etherscan.io/address/${safeGetImplementation(
              portal,
            )}#code`,
          },
        ],
      },
      operator: templateVars.nonTemplateTechnology?.operator ?? {
        ...OPERATOR.CENTRALIZED_OPERATOR,
        references: [
          {
            text: 'L2OutputOracle.sol - Etherscan source code, CHALLENGER address',
            href: `https://etherscan.io/address/${safeGetImplementation(
              l2OutputOracle,
            )}#code`,
          },
          {
            text: 'L2OutputOracle.sol - Etherscan source code, PROPOSER address',
            href: `https://etherscan.io/address/${safeGetImplementation(
              l2OutputOracle,
            )}#code`,
          },
        ],
      },
      forceTransactions: templateVars.nonTemplateTechnology
        ?.forceTransactions ?? {
        ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
        references: [
          {
            text: 'Sequencing Window - OP Mainnet Specs',
            href: 'https://github.com/ethereum-optimism/optimism/blob/51eeb76efeb32b3df3e978f311188aa29f5e3e94/specs/glossary.md#sequencing-window',
          },
          {
            text: 'OptimismPortal.sol - Etherscan source code, depositTransaction function',
            href: `https://etherscan.io/address/${safeGetImplementation(
              portal,
            )}#code`,
          },
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
          references: [
            {
              text: 'OptimismPortal.sol - Etherscan source code, proveWithdrawalTransaction function',
              href: `https://etherscan.io/address/${safeGetImplementation(
                portal,
              )}#code`,
            },
            {
              text: 'OptimismPortal.sol - Etherscan source code, finalizeWithdrawalTransaction function',
              href: `https://etherscan.io/address/${safeGetImplementation(
                portal,
              )}#code`,
            },
            {
              text: 'L2OutputOracle.sol - Etherscan source code, PROPOSER check',
              href: `https://etherscan.io/address/${safeGetImplementation(
                l2OutputOracle,
              )}#code`,
            },
          ],
          risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
        },
        {
          ...EXITS.FORCED('all-withdrawals'),
          references: [
            {
              text: 'Forced withdrawal from an OP Stack blockchain',
              href: 'https://stack.optimism.io/docs/security/forced-withdrawal/',
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
              text: 'Introducing EVM Equivalence',
              href: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
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
    badges: mergeBadges(
      [Badge.Stack.OPStack, Badge.VM.EVM, daBadge],
      templateVars.additionalBadges ?? [],
    ),
    discoveryDrivenData: templateVars.discoveryDrivenData,
  }
}

export function opStackL2(templateVars: OpStackConfigL2): Layer2 {
  const sequencerInbox = EthereumAddress(
    templateVars.discovery.getContractValue('SystemConfig', 'sequencerInbox'),
  )
  const sequencerAddress = EthereumAddress(
    templateVars.discovery.getContractValue('SystemConfig', 'batcherHash'),
  )
  const optimismPortalTokens = [
    'ETH',
    ...(templateVars.nonTemplateOptimismPortalEscrowTokens ?? []),
  ]

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

  const usesBlobs =
    templateVars.usesBlobs ??
    templateVars.discovery.getContractValue<{
      isSequencerSendingBlobTx: boolean
    }>('SystemConfig', 'opStackDA').isSequencerSendingBlobTx

  const postsToCelestia = templateVars.discovery.getContractValue<{
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

  const FINALIZATION_PERIOD_SECONDS: number =
    templateVars.discovery.getContractValue<number>(
      'L2OutputOracle',
      'FINALIZATION_PERIOD_SECONDS',
    )

  // 4 cases: Optimium, Optimium + Superchain, Rollup, Rollup + Superchain
  // archi images defined locally in the project.ts take precedence over this one
  const architectureImage = `opstack-${daProvider !== undefined ? 'optimium' : 'rollup'}${templateVars.discovery.hasContract('SuperchainConfig') ? '-superchain' : ''}`

  return {
    type: 'layer2',
    ...opStackCommon(templateVars),
    display: {
      purposes: ['Universal', ...(templateVars.additionalPurposes ?? [])],
      architectureImage,
      ...templateVars.display,
      provider: 'OP Stack',
      category:
        templateVars.display.category ??
        (daProvider !== undefined ? 'Optimium' : 'Optimistic Rollup'),
      warning: templateVars.display.warning,
      liveness:
        daProvider !== undefined
          ? undefined
          : {
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
            },
      finality:
        daProvider !== undefined
          ? undefined
          : {
              warnings: {
                timeToInclusion: {
                  sentiment: 'neutral',
                  value:
                    "It's assumed that transaction data batches are submitted sequentially.",
                },
              },
              finalizationPeriod: FINALIZATION_PERIOD_SECONDS,
            },
    },
    chainConfig: templateVars.chainConfig,
    config: {
      associatedTokens: templateVars.associatedTokens,
      escrows: [
        templateVars.discovery.getEscrowDetails({
          address: portal.address,
          tokens: optimismPortalTokens,
          description: `Main entry point for users depositing ${optimismPortalTokens.join(
            ', ',
          )}.`,
          ...upgradeability,
        }),
        templateVars.discovery.getEscrowDetails({
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
      transactionApi:
        templateVars.transactionApi ??
        (templateVars.rpcUrl !== undefined
          ? {
              type: 'rpc',
              startBlock: 1,
              defaultUrl: templateVars.rpcUrl,
              defaultCallsPerMinute: 1500,
              assessCount: subtractOne,
            }
          : undefined),
      trackedTxs:
        daProvider !== undefined
          ? undefined
          : (templateVars.nonTemplateTrackedTxs ?? [
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
            ]),
      finality: daProvider !== undefined ? undefined : templateVars.finality,
    },
    dataAvailability: [
      daProvider !== undefined
        ? addSentimentToDataAvailability({
            layers: daProvider.fallback
              ? [daProvider.layer, daProvider.fallback]
              : [daProvider.layer],
            bridge: daProvider.bridge,
            mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
          })
        : addSentimentToDataAvailability({
            layers: [
              usesBlobs
                ? DA_LAYERS.ETH_BLOBS_OR_CALLDATA
                : DA_LAYERS.ETH_CALLDATA,
            ],
            bridge: DA_BRIDGES.ENSHRINED,
            mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
          }),
    ],
    riskView: {
      stateValidation: {
        ...RISK_VIEW.STATE_NONE,
        secondLine: formatChallengePeriod(FINALIZATION_PERIOD_SECONDS),
      },
      dataAvailability: {
        ...riskViewDA(daProvider),
        sources: [
          {
            contract: portal.name,
            references: [],
          },
        ],
      },
      exitWindow: {
        ...RISK_VIEW.EXIT_WINDOW(0, FINALIZATION_PERIOD_SECONDS),
        sources: [
          {
            contract: portal.name,
            references: [],
          },
        ],
      },
      sequencerFailure: {
        ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
          // the value is inside the node config, but we have no reference to it
          // so we assume it to be the same value as in other op stack chains
          HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
        ),
        secondLine: formatDelay(HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS),
        sources: [
          {
            contract: portal.name,
            references: [],
          },
        ],
      },
      proposerFailure: {
        ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
        sources: [
          {
            contract: l2OutputOracle.name,
            references: [],
          },
        ],
      },
    },
    stage:
      templateVars.stage === undefined
        ? daProvider !== undefined || templateVars.isNodeAvailable === undefined
          ? {
              stage: 'NotApplicable',
            }
          : getStage(
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
        : templateVars.stage,
    stateDerivation: templateVars.stateDerivation,
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

  const optimismPortalTokens = [
    'ETH',
    ...(templateVars.nonTemplateOptimismPortalEscrowTokens ?? []),
  ]

  const postsToCelestia = templateVars.discovery.getContractValue<{
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

  const FINALIZATION_PERIOD_SECONDS: number =
    templateVars.discovery.getContractValue<number>(
      'L2OutputOracle',
      'FINALIZATION_PERIOD_SECONDS',
    )

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

  const riskView = {
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      secondLine: formatChallengePeriod(FINALIZATION_PERIOD_SECONDS),
    },
    dataAvailability: {
      ...riskViewDA(daProvider),
      sources: [
        {
          contract: portal.name,
          references: [],
        },
      ],
    },
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW(0, FINALIZATION_PERIOD_SECONDS),
      sources: [
        {
          contract: portal.name,
          references: [],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        // the value is inside the node config, but we have no reference to it
        // so we assume it to be the same value as in other op stack chains
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      ),
      secondLine: formatDelay(HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS),
      sources: [
        {
          contract: portal.name,
          references: [],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [
        {
          contract: l2OutputOracle.name,
          references: [],
        },
      ],
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }

  const getStackedRisks = () => {
    return {
      stateValidation: pickWorseRisk(
        riskView.stateValidation,
        baseChain.riskView.stateValidation,
      ),
      dataAvailability: pickWorseRisk(
        riskView.dataAvailability,
        baseChain.riskView.dataAvailability,
      ),
      exitWindow: pickWorseRisk(
        riskView.exitWindow,
        baseChain.riskView.exitWindow,
      ),
      sequencerFailure: sumRisk(
        riskView.sequencerFailure,
        baseChain.riskView.sequencerFailure,
        RISK_VIEW.SEQUENCER_SELF_SEQUENCE,
      ),
      proposerFailure: sumRisk(
        riskView.proposerFailure,
        baseChain.riskView.proposerFailure,
        RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED,
      ),
      validatedBy: riskView.validatedBy,
      destinationToken: riskView.destinationToken,
    }
  }

  const architectureImage = templateVars.discovery.hasContract(
    'SuperchainConfig',
  )
    ? 'bedrock-superchain'
    : 'opstack'

  return {
    type: 'layer3',
    ...opStackCommon(templateVars),
    hostChain: templateVars.hostChain,
    display: {
      architectureImage,
      purposes: ['Universal', ...(templateVars.additionalPurposes ?? [])],
      ...templateVars.display,
      provider: 'OP Stack',
      category:
        templateVars.display.category ??
        (daProvider !== undefined ? 'Optimium' : 'Optimistic Rollup'),
      warning:
        templateVars.display.warning === undefined
          ? 'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.'
          : templateVars.display.warning,
    },
    stackedRiskView: templateVars.stackedRiskView ?? getStackedRisks(),
    riskView,
    stage:
      templateVars.stage === undefined
        ? daProvider !== undefined || templateVars.isNodeAvailable === undefined
          ? {
              stage: 'NotApplicable',
            }
          : getStage(
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
        : templateVars.stage,
    dataAvailability:
      daProvider !== undefined
        ? [
            addSentimentToDataAvailability({
              layers: daProvider.fallback
                ? [daProvider.layer, daProvider.fallback]
                : [daProvider.layer],
              bridge: daProvider.bridge,
              mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
            }),
          ]
        : baseChain.dataAvailability,
    config: {
      associatedTokens: templateVars.associatedTokens,
      escrows: [
        templateVars.discovery.getEscrowDetails({
          includeInTotal: false,
          address: portal.address,
          tokens: optimismPortalTokens,
          description: `Main entry point for users depositing ${optimismPortalTokens.join(
            ', ',
          )}.`,
          ...upgradeability,
        }),
        templateVars.discovery.getEscrowDetails({
          includeInTotal: false,
          address: l1StandardBridgeEscrow,
          tokens: templateVars.l1StandardBridgeTokens ?? '*',
          excludedTokens: templateVars.nonTemplateExcludedTokens,
          description:
            'Main entry point for users depositing ERC20 token that do not require custom gateway.',
          ...upgradeability,
        }),
        ...(templateVars.nonTemplateEscrows ?? []),
      ],
      transactionApi:
        templateVars.transactionApi ??
        (templateVars.rpcUrl !== undefined
          ? {
              type: 'rpc',
              startBlock: 1,
              defaultUrl: templateVars.rpcUrl,
              defaultCallsPerMinute: 1500,
              assessCount: subtractOne,
            }
          : undefined),
    },
    stateDerivation: templateVars.stateDerivation,
  }
}

function safeGetImplementation(contract: ContractParameters): string {
  const implementation = get$Implementations(contract.values)[0]
  if (!implementation) {
    throw new Error(`No implementation found for ${contract.name}`)
  }
  return implementation.toString()
}

function riskViewDA(DA: DAProvider | undefined): ScalingProjectRiskViewEntry {
  return DA === undefined ? RISK_VIEW.DATA_ON_CHAIN : DA.riskView
}

function technologyDA(
  DA: DAProvider | undefined,
  usesBlobs: boolean | undefined,
): ScalingProjectTechnologyChoice {
  if (DA !== undefined) {
    return DA.technology
  }

  if (usesBlobs) {
    return TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA
  }

  return TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA
}
