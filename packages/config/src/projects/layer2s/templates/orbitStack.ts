import type { ContractParameters } from '@l2beat/discovery'
import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { isEmpty, unionBy } from 'lodash'
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
  pickWorseRisk,
  sumRisk,
} from '../../../common'
import {
  formatChallengePeriod,
  formatDelay,
} from '../../../common/formatDelays'
import type { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import type {
  Badge,
  ChainConfig,
  CustomDa,
  Layer2,
  Layer2Display,
  Layer2FinalityConfig,
  Layer2TxConfig,
  Layer3,
  Milestone,
  ProjectActivityConfig,
  ProjectDaTrackingConfig,
  ProjectDataAvailability,
  ProjectEscrow,
  ProjectPermission,
  ProjectTechnologyChoice,
  ProjectUpgradeableActor,
  ReasonForBeingInOther,
  ScalingProject,
  ScalingProjectCapability,
  ScalingProjectDisplay,
  ScalingProjectPurpose,
  ScalingProjectRisk,
  ScalingProjectRiskView,
  ScalingProjectStateDerivation,
  ScalingProjectStateValidation,
  ScalingProjectStateValidationCategory,
  ScalingProjectTechnology,
  StageConfig,
  TableReadyValue,
} from '../../../types'
import { BADGES } from '../../badges'
import { EXPLORER_URLS } from '../../chains/explorerUrls'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from '../common/liveness'
import { getStage } from '../common/stages/getStage'
import { getActivityConfig } from './activity'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from './generateDiscoveryDrivenSections'
import { explorerReferences, mergeBadges, safeGetImplementation } from './utils'

type DAProvider = ProjectDataAvailability & {
  riskViewDA: TableReadyValue
  riskViewExitWindow: TableReadyValue
  technology: ProjectTechnologyChoice
  badge: Badge
}

const EVM_OTHER_CONSIDERATIONS: ProjectTechnologyChoice[] = [
  {
    name: 'EVM compatible smart contracts are supported',
    description:
      'Arbitrum One uses Nitro technology that allows running fraud proofs by executing EVM code on top of WASM.',
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'there are mistakes in the highly complex Nitro and WASM one-step prover implementation.',
      },
    ],
    references: [
      {
        title: 'Inside Arbitrum Nitro',
        url: 'https://developer.offchainlabs.com/inside-arbitrum-nitro/',
      },
    ],
  },
]

export const WASMVM_OTHER_CONSIDERATIONS: ProjectTechnologyChoice[] = [
  {
    name: 'EVM compatible and Stylus smart contracts are supported',
    description:
      'Arbitrum One supports smart contracts written in Solidity and other programming languages (Rust, C++) that compile to WASM. Such smart contracts are executed by nodes using either a geth fork or [a fork of wasmer](https://github.com/OffchainLabs/wasmer) inside the Nitro node, and can be proven with the onchain WASM VM.',
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'there are mistakes in the highly complex Nitro and WASM one-step prover implementation.',
      },
    ],
    references: [
      {
        title: 'Inside Arbitrum Nitro',
        url: 'https://developer.offchainlabs.com/inside-arbitrum-nitro/',
      },
      {
        title: 'A gentle introduction: Stylus',
        url: 'https://docs.arbitrum.io/stylus/stylus-gentle-introduction',
      },
    ],
  },
]

interface OrbitStackConfigCommon {
  addedAt: UnixTime
  capability?: ScalingProjectCapability
  discovery: ProjectDiscovery
  additionalDiscoveries?: { [chain: string]: ProjectDiscovery }
  stateValidationImage?: string
  associatedTokens?: string[]
  isNodeAvailable?: boolean | 'UnderReview'
  nodeSourceLink?: string
  nonTemplateEscrows?: ProjectEscrow[]
  overrideEscrows?: ProjectEscrow[]
  upgradeability?: {
    upgradableBy?: ProjectUpgradeableActor[]
  }
  display: Omit<ScalingProjectDisplay, 'provider' | 'category' | 'purposes'> & {
    category?: ScalingProjectDisplay['category']
  }
  bridge: ContractParameters
  blockNumberOpcodeTimeSeconds?: number
  finality?: Layer2FinalityConfig
  rollupProxy: ContractParameters
  sequencerInbox: ContractParameters
  nonTemplateTechnology?: Partial<ScalingProjectTechnology>
  additiveConsiderations?: ProjectTechnologyChoice[]
  nonTemplateRiskView?: Partial<ScalingProjectRiskView>
  activityConfig?: ProjectActivityConfig
  milestones?: Milestone[]
  trackedTxs?: Layer2TxConfig[]
  chainConfig?: ChainConfig
  usesBlobs?: boolean
  additionalBadges?: Badge[]
  stage?: StageConfig
  stateValidation?: ScalingProjectStateValidation
  stateDerivation?: ScalingProjectStateDerivation
  nonTemplateContractRisks?: ScalingProjectRisk[]
  additionalPurposes?: ScalingProjectPurpose[]
  overridingPurposes?: ScalingProjectPurpose[]
  isArchived?: boolean
  /** Gas tokens that are applicable yet cannot be added to tokens.jsonc for some reason (e.g. lack of CG support) */
  untrackedGasTokens?: string[]
  customDa?: CustomDa
  hasAtLeastFiveExternalChallengers?: boolean
  reasonsForBeingOther?: ReasonForBeingInOther[]
  /** Configure to enable DA metrics tracking for chain using Celestia DA */
  celestiaDa?: {
    namespace: string
    sinceBlock: number // Block number on Celestia Network
  }
  /** Configure to enable DA metrics tracking for chain using Avail DA */
  availDa?: {
    appId: string
    sinceBlock: number // Block number on Avail Network
  }
  /** Configure to enable custom DA tracking e.g. project that switched DA */
  nonTemplateDaTracking?: ProjectDaTrackingConfig[]
}

export interface OrbitStackConfigL3 extends OrbitStackConfigCommon {
  stackedRiskView?: Partial<ScalingProjectRiskView>
}

export interface OrbitStackConfigL2 extends OrbitStackConfigCommon {
  display: Omit<Layer2Display, 'provider' | 'category' | 'purposes'> & {
    category?: Layer2Display['category']
  }
  upgradesAndGovernance?: string
}

function ensureMaxTimeVariationObjectFormat(discovery: ProjectDiscovery) {
  // some orbit chains represent maxTimeVariation as an array, others an object
  const result = discovery.getContractValue<
    | {
        delayBlocks: number
        futureBlocks: number
        delaySeconds: number
        futureSeconds: number
      }
    | number[]
  >('SequencerInbox', 'maxTimeVariation')

  if (Array.isArray(result)) {
    return {
      delayBlocks: result[0],
      futureBlocks: result[1],
      delaySeconds: result[2],
      futureSeconds: result[3],
    }
  } else {
    return result
  }
}

export function getNitroGovernance(
  l2CoreQuorumPercent: number,
  l2TimelockDelay: number,
  challengeWindowSeconds: number,
  l1TimelockDelay: number,
  treasuryTimelockDelay: number,
  l2TreasuryQuorumPercent: number,
): string {
  return `
All critical system smart contracts are upgradeable (can be arbitrarily changed). This permission is governed by the Arbitrum Decentralized Autonomous Organization (DAO)
and their elected Security Council. The Arbitrum DAO controls Arbitrum One and Arbitrum Nova through upgrades and modifications to their smart contracts on Layer 1 Ethereum and the Layer 2s.
While the DAO governs through token-weighted governance in their associated ARB token, the Security Council can directly act through
multisigs on all three chains. Although they are technically separate and connect to different target permissions,
their member- and threshold configuration is kept in sync by a manager contract on Arbitrum One sending crosschain transactions.

Regular upgrades, Admin- and Owner actions originate from either the Arbitrum DAO or the non-emergency (Proposer-) Security Council on Arbitrum One
and pass through multiple delays and timelocks before being executed at their destination. Contrarily, the three Emergency Security Council multisigs
(one on each chain: Arbitrum One, Ethereum, Arbitrum Nova) can skip delays and directly access all admin- and upgrade functions of all smart contracts.
These two general paths have the same destination: the respective UpgradeExecutor smart contract.

Regular upgrades are scheduled in the L2 Timelock. The proposer Security Council can do this directly and the Arbitrum DAO (ARB token holders and delegates) must meet a
CoreGovernor-enforced ${l2CoreQuorumPercent}% threshold of the votable tokens. The L2 Timelock queues the transaction for a ${formatSeconds(
    l2TimelockDelay,
  )} delay and then sends it to the Outbox contract on Ethereum. This incurs another delay (the challenge period) of ${formatSeconds(
    challengeWindowSeconds,
  )}.
When that has passed, the L1 Timelock delays for additional ${formatSeconds(
    l1TimelockDelay,
  )}. Both timelocks serve as delays during which the transparent transaction contents can be audited,
and, in the case of the final L1 timelock, cancelled by the Emergency Security Council. Finally, the transaction can be executed, calling Admin- or Owner restricted functions of the respective destination smart contracts
through the UpgradeExecutor on Ethereum. If the predefined  transaction destination is Arbitrum One or -Nova, this last call is executed on L2 through the canonical bridge and the aliased address of the L1 Timelock.

Operator roles like the Sequencers and Validators are managed using the same paths.
Sequencer changes can be delegated to a Batch Poster Manager role.

Transactions targeting the Arbitrum DAO Treasury can be scheduled in the ${formatSeconds(
    treasuryTimelockDelay,
  )}
Treasury Timelock by meeting a TreasuryGovernor-enforced ${l2TreasuryQuorumPercent}% threshold of votable ARB tokens. The Security Council cannot regularly cancel
these transactions or schedule different ones but can overwrite them anyway by having upgrade permissions for all the underlying smart contracts.`
}

function defaultStateValidation(
  minimumAssertionPeriod: number,
  currentRequiredStake: number,
  challengePeriod: number,
  existFastConfirmer: boolean = false,
): ScalingProjectStateValidation {
  const categories: ScalingProjectStateValidationCategory[] = [
    {
      title: 'State root proposals',
      description: `Whitelisted validators propose state roots as children of a previous state root. A state root can have multiple conflicting children. This structure forms a graph, and therefore, in the contracts, state roots are referred to as nodes. Each proposal requires a stake, currently set to ${utils.formatEther(
        currentRequiredStake,
      )} ETH, that can be slashed if the proposal is proven incorrect via a fraud proof. Stakes can be moved from one node to one of its children, either by calling \`stakeOnExistingNode\` or \`stakeOnNewNode\`. New nodes cannot be created faster than the minimum assertion period by the same validator, currently set to ${formatSeconds(
        minimumAssertionPeriod,
      )}. The oldest unconfirmed node can be confirmed if the challenge period has passed and there are no siblings, and rejected if the parent is not a confirmed node or if the challenge period has passed and no one is staked on it.`,
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'none of the whitelisted verifiers checks the published state. Fraud proofs assume at least one honest and able validator.',
          isCritical: true,
        },
      ],
      references: [
        {
          title: 'How is fraud proven - Arbitrum documentation FAQ',
          url: 'https://docs.arbitrum.io/welcome/arbitrum-gentle-introduction#q-and-how-exactly-is-fraud-proven-sounds-complicated',
        },
      ],
    },
    {
      title: 'Challenges',
      description: `A challenge can be started between two siblings, i.e. two different state roots that share the same parent, by calling the \`startChallenge\` function. Validators cannot be in more than one challenge at the same time, meaning that the protocol operates with [partial concurrency](https://medium.com/l2beat/fraud-proof-wars-b0cb4d0f452a). Since each challenge lasts ${formatSeconds(
        challengePeriod,
      )}, this implies that the protocol can be subject to [delay attacks](https://medium.com/offchainlabs/solutions-to-delay-attacks-on-rollups-434f9d05a07a), where a malicious actor can delay withdrawals as long as they are willing to pay the cost of losing their stakes. If the protocol is delayed attacked, the new stake requirement increases exponentially for each challenge period of delay. Challenges are played via a bisection game, where asserter and challenger play together to find the first instruction of disagreement. Such instruction is then executed onchain in the WASM OneStepProver contract to determine the winner, who then gets half of the stake of the loser. As said before, a state root is rejected only when no one left is staked on it. The protocol does not enforces valid bisections, meaning that actors can propose correct initial claim and then provide incorrect midpoints.`,
      references: [
        {
          title: 'Fraud Proof Wars: Arbitrum Classic',
          url: 'https://medium.com/l2beat/fraud-proof-wars-b0cb4d0f452a',
        },
      ],
    },
  ]

  if (existFastConfirmer) {
    categories.push({
      title: 'Fast confirmations',
      description: `Whitelisted validators can fast-confirm state-roots after the initial ${formatSeconds(
        minimumAssertionPeriod,
      )} minimum assertion period has passed on a state root and skip the ${formatSeconds(
        challengePeriod,
      )} challenge period. This finalizes the fast-confirmed state root an permits withdrawals based on it.`,
      risks: [
        {
          category: 'Funds can be stolen if',
          text: "validators with the 'fast-confirmer' permission finalize a malicious state root before the challenge period has passed.",
          isCritical: true,
        },
      ],
      references: [
        {
          title:
            'Fast withdrawals for AnyTrust chains - Arbitrum documentation',
          url: 'https://docs.arbitrum.io/launch-orbit-chain/how-tos/fast-withdrawals#fast-withdrawals-for-anytrust-chains',
        },
      ],
    })
  }

  return {
    description:
      'Updates to the system state can be proposed and challenged by a set of whitelisted validators. If a state root passes the challenge period, it is optimistically considered correct and made actionable for withdrawals.',
    categories,
  }
}

const wmrValidForBlobstream = [
  '0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287',
]

// TODO: Add blobstream delay when timelock is enabled
const BLOBSTREAM_DELAY_SECONDS = 0

function orbitStackCommon(
  type: (Layer2 | Layer3)['type'],
  templateVars: OrbitStackConfigCommon,
  explorerUrl: string | undefined,
  hostChainDA?: DAProvider,
): Omit<ScalingProject, 'type' | 'display'> & {
  display: Pick<
    ScalingProjectDisplay,
    | 'stateValidationImage'
    | 'architectureImage'
    | 'purposes'
    | 'stack'
    | 'category'
    | 'warning'
  >
} {
  const nativeContractRisks = templateVars.nonTemplateContractRisks ?? [
    CONTRACTS.UPGRADE_NO_DELAY_RISK,
  ]

  const allDiscoveries = [
    templateVars.discovery,
    ...Object.values(templateVars.additionalDiscoveries ?? {}),
  ]

  const maxTimeVariation = ensureMaxTimeVariationObjectFormat(
    templateVars.discovery,
  )

  const upgradeability = templateVars.upgradeability ?? {
    upgradableBy: [{ name: 'ProxyAdmin', delay: 'no' }],
  }

  const selfSequencingDelaySeconds = maxTimeVariation.delaySeconds

  const wasmModuleRoot = templateVars.discovery.getContractValue<string>(
    'RollupProxy',
    'wasmModuleRoot',
  )
  const isUsingValidBlobstreamWmr =
    wmrValidForBlobstream.includes(wasmModuleRoot)
  const daProvider = getDAProvider(type, templateVars, explorerUrl, hostChainDA)

  const isUsingEspressoSequencer =
    templateVars.discovery.getContractValueOrUndefined<string>(
      'SequencerInbox',
      'espressoTEEVerifier',
    ) !== undefined &&
    templateVars.discovery.getContractValue<string>(
      'SequencerInbox',
      'espressoTEEVerifier',
    ) !== EthereumAddress.ZERO

  const blockNumberOpcodeTimeSeconds =
    templateVars.blockNumberOpcodeTimeSeconds ?? 12

  const minimumAssertionPeriod =
    templateVars.discovery.getContractValue<number>(
      'RollupProxy',
      'minimumAssertionPeriod',
    ) * blockNumberOpcodeTimeSeconds

  const postsToExternalDA = !postsToEthereum(templateVars)

  const sequencers: ProjectPermission =
    templateVars.discovery.getPermissionDetails(
      'Sequencers',
      templateVars.discovery.getPermissionsByRole('sequence'),
      'Central actors allowed to submit transaction batches to L1.',
    )

  if (sequencers.accounts.length === 0) {
    throw new Error(
      `No sequencers found for ${templateVars.discovery.projectName}. Assign 'Sequencer' role to at least one account.`,
    )
  }

  const challengePeriodBlocks = templateVars.discovery.getContractValue<number>(
    'RollupProxy',
    'confirmPeriodBlocks',
  )
  const challengePeriodSeconds =
    challengePeriodBlocks * blockNumberOpcodeTimeSeconds

  const fastConfirmer =
    templateVars.discovery.getContractValueOrUndefined<EthereumAddress>(
      'RollupProxy',
      'anyTrustFastConfirmer',
    ) ?? EthereumAddress.ZERO
  const existFastConfirmer = fastConfirmer !== EthereumAddress.ZERO

  // const validatorWhitelistDisabled =
  //   templateVars.discovery.getContractValue<boolean>(
  //     'RollupProxy',
  //     'validatorWhitelistDisabled',
  //   )

  const automaticBadges = [BADGES.Stack.Orbit, BADGES.VM.EVM, daProvider.badge]

  if (isUsingEspressoSequencer) {
    automaticBadges.push(BADGES.Other.EspressoPreconfs)
  }

  const architectureImage = existFastConfirmer
    ? 'orbit-optimium-fastconfirm'
    : isUsingEspressoSequencer && isUsingValidBlobstreamWmr
      ? 'orbit-optimium-blobstream-espresso'
      : isUsingValidBlobstreamWmr
        ? 'orbit-optimium-blobstream'
        : postsToExternalDA
          ? 'orbit-optimium'
          : 'orbit-rollup'

  const trackedGasTokens = templateVars.chainConfig?.gasTokens?.filter(
    (t) => !templateVars.untrackedGasTokens?.includes(t),
  )

  if (templateVars.untrackedGasTokens) {
    assert(
      templateVars.untrackedGasTokens?.every((t) =>
        templateVars.chainConfig?.gasTokens?.includes(t),
      ),
      `${templateVars.discovery.projectName}: Every token configured in untrackedGasTokens has to be configured in chainConfig`,
    )
  }

  return {
    id: ProjectId(templateVars.discovery.projectName),
    addedAt: templateVars.addedAt,
    capability: templateVars.capability ?? 'universal',
    isArchived: templateVars.isArchived ?? undefined,
    display: {
      architectureImage,
      stateValidationImage: 'orbit',
      purposes: templateVars.overridingPurposes ?? [
        'Universal',
        ...(templateVars.additionalPurposes ?? []),
      ],
      ...templateVars.display,
      warning:
        'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
      stack: 'Arbitrum',
      category:
        templateVars.display.category ??
        (postsToExternalDA ? 'Optimium' : 'Optimistic Rollup'),
    },
    riskView: getRiskView(templateVars, daProvider),
    stage: computedStage(templateVars),
    config: {
      associatedTokens: templateVars.associatedTokens,
      escrows:
        templateVars.overrideEscrows ??
        unionBy(
          [
            templateVars.discovery.getEscrowDetails({
              includeInTotal: type === 'layer2',
              address: templateVars.bridge.address,
              tokens: trackedGasTokens ?? ['ETH'],
              description: trackedGasTokens
                ? `Contract managing Inboxes and Outboxes. It escrows ${trackedGasTokens?.join(', ')} sent to L2.`
                : `Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.`,
              ...upgradeability,
            }),
            ...(templateVars.nonTemplateEscrows ?? []),
          ],
          'address',
        ),
      activityConfig: getActivityConfig(
        templateVars.activityConfig,
        templateVars.chainConfig,
        {
          type: 'block',
          startBlock: 1,
          adjustCount: { type: 'SubtractOne' },
        },
      ),
      daTracking: getDaTracking(templateVars),
    },
    contracts: {
      addresses: generateDiscoveryDrivenContracts(allDiscoveries),
      risks: nativeContractRisks,
    },
    chainConfig: templateVars.chainConfig && {
      ...templateVars.chainConfig,
      gasTokens: !isEmpty(templateVars.chainConfig?.gasTokens)
        ? templateVars.chainConfig?.gasTokens
        : ['ETH'],
    },
    technology: {
      sequencing: templateVars.nonTemplateTechnology?.sequencing,
      stateCorrectness:
        templateVars.nonTemplateTechnology?.stateCorrectness ?? undefined,
      dataAvailability:
        templateVars.nonTemplateTechnology?.dataAvailability ??
        daProvider.technology,
      operator: templateVars.nonTemplateTechnology?.operator ?? {
        ...OPERATOR.CENTRALIZED_SEQUENCER,
        references: [
          {
            title: 'Sequencer - Arbitrum documentation',
            url: 'https://docs.arbitrum.io/how-arbitrum-works/inside-arbitrum-nitro#the-sequencer',
          },
        ],
      },
      forceTransactions: templateVars.nonTemplateTechnology
        ?.forceTransactions ?? {
        ...FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract'),
        description:
          FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract').description +
          ` After a delay of ${formatSeconds(
            selfSequencingDelaySeconds,
          )} in which a Sequencer has failed to include a transaction that was directly posted to the smart contract, it can be forcefully included by anyone on the host chain, which finalizes its ordering.`,
        references: [
          ...explorerReferences(explorerUrl, [
            {
              title:
                'SequencerInbox.sol - source code, forceInclusion function',
              address: safeGetImplementation(templateVars.sequencerInbox),
            },
          ]),
          {
            title: "Sequencer Isn't Doing Its Job - Arbitrum documentation",
            url: 'https://docs.arbitrum.io/how-arbitrum-works/sequencer#unhappyuncommon-case-sequencer-isnt-doing-its-job',
          },
        ],
      },
      exitMechanisms: templateVars.nonTemplateTechnology?.exitMechanisms ?? [
        {
          ...EXITS.REGULAR_MESSAGING('optimistic'),
          references: [
            {
              title: 'Transaction lifecycle - Arbitrum documentation',
              url: 'https://developer.offchainlabs.com/tx-lifecycle',
            },
            {
              title: 'L2 to L1 Messages - Arbitrum documentation',
              url: 'https://developer.offchainlabs.com/arbos/l2-to-l1-messaging',
            },
            {
              title: 'Mainnet for everyone - Arbitrum Blog',
              url: 'https://offchain.medium.com/mainnet-for-everyone-27ce0f67c85e',
            },
          ],
          risks: [],
        },
        EXITS.AUTONOMOUS,
      ],
      otherConsiderations:
        templateVars.nonTemplateTechnology?.otherConsiderations ??
        EVM_OTHER_CONSIDERATIONS,
    },
    permissions: generateDiscoveryDrivenPermissions(allDiscoveries),
    stateDerivation: templateVars.stateDerivation,
    stateValidation:
      templateVars.stateValidation ??
      (() => {
        const currentRequiredStake =
          templateVars.discovery.getContractValue<number>(
            'RollupProxy',
            'currentRequiredStake',
          )
        return defaultStateValidation(
          minimumAssertionPeriod,
          currentRequiredStake,
          challengePeriodSeconds,
          existFastConfirmer,
        )
      })(),
    milestones: templateVars.milestones ?? [],
    badges: mergeBadges(automaticBadges, templateVars.additionalBadges ?? []),
    customDa: templateVars.customDa,
    reasonsForBeingOther: templateVars.reasonsForBeingOther,
    dataAvailability: extractDA(daProvider),
  }
}

export function orbitStackL3(templateVars: OrbitStackConfigL3): Layer3 {
  const layer2s = require('..').layer2s as Layer2[]
  const hostChain = templateVars.discovery.chain

  const baseChain = layer2s.find((l2) => l2.id === hostChain)
  assert(baseChain, `Could not find base chain ${hostChain} in layer2s`)

  const common = orbitStackCommon(
    'layer3',
    templateVars,
    baseChain.chainConfig?.explorerUrl,
    hostChainDAProvider(baseChain),
  )

  const getStackedRisks = () => {
    return {
      stateValidation:
        templateVars.stackedRiskView?.stateValidation ??
        pickWorseRisk(
          common.riskView.stateValidation,
          baseChain.riskView.stateValidation,
        ),
      dataAvailability:
        templateVars.stackedRiskView?.dataAvailability ??
        pickWorseRisk(
          common.riskView.dataAvailability,
          baseChain.riskView.dataAvailability,
        ),
      exitWindow:
        templateVars.stackedRiskView?.exitWindow ??
        pickWorseRisk(
          common.riskView.exitWindow,
          baseChain.riskView.exitWindow,
        ),
      sequencerFailure:
        templateVars.stackedRiskView?.sequencerFailure ??
        sumRisk(
          common.riskView.sequencerFailure,
          baseChain.riskView.sequencerFailure,
          RISK_VIEW.SEQUENCER_SELF_SEQUENCE,
        ),
      proposerFailure:
        templateVars.stackedRiskView?.sequencerFailure ??
        sumRisk(
          common.riskView.proposerFailure,
          baseChain.riskView.proposerFailure,
          RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED,
        ),
    }
  }

  return {
    type: 'layer3',
    ...common,
    hostChain: ProjectId(hostChain),
    display: { ...common.display, ...templateVars.display },
    stackedRiskView: getStackedRisks(),
  }
}

export function orbitStackL2(templateVars: OrbitStackConfigL2): Layer2 {
  const assumedBlockTime = 12 // seconds, different from RollupUserLogic.sol#L35 which assumes 13.2 seconds

  const challengePeriodBlocks = templateVars.discovery.getContractValue<number>(
    'RollupProxy',
    'confirmPeriodBlocks',
  )
  const challengePeriodSeconds = challengePeriodBlocks * assumedBlockTime

  const maxTimeVariation = ensureMaxTimeVariationObjectFormat(
    templateVars.discovery,
  )

  const selfSequencingDelaySeconds = maxTimeVariation.delaySeconds

  const common = orbitStackCommon(
    'layer2',
    templateVars,
    EXPLORER_URLS['ethereum'],
  )

  return {
    type: 'layer2',
    ...common,
    display: {
      ...common.display,
      ...templateVars.display,
      finality: { finalizationPeriod: challengePeriodSeconds },
      liveness: ifPostsToEthereum(
        templateVars,
        templateVars.display.liveness ?? {
          warnings: {
            stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
          },
          explanation: `${
            templateVars.display.name
          } is an ${common.display.category} that posts transaction data to the L1. For a transaction to be considered final, it has to be posted to the L1. Forced txs can be delayed up to ${formatSeconds(
            selfSequencingDelaySeconds,
          )}. The state root gets finalized ${formatSeconds(
            challengePeriodSeconds,
          )} after it has been posted.`,
        },
      ),
    },
    config: {
      ...common.config,
      trackedTxs: getTrackedTxs(templateVars),
      finality: templateVars.finality,
    },
    upgradesAndGovernance: templateVars.upgradesAndGovernance,
  }
}

function getDaTracking(
  templateVars: OrbitStackConfigL2 | OrbitStackConfigL3,
): ProjectDaTrackingConfig[] | undefined {
  if (templateVars.nonTemplateDaTracking) {
    return templateVars.nonTemplateDaTracking
  }

  const usesBlobs =
    templateVars.usesBlobs ??
    templateVars.discovery.getContractValueOrUndefined(
      'SequencerInbox',
      'postsBlobs',
    ) ??
    false

  const batchPosters = templateVars.discovery.getContractValue<string[]>(
    'SequencerInbox',
    'batchPosters',
  )

  const inboxDeploymentBlockNumber =
    templateVars.discovery.getContract('SequencerInbox').sinceBlock ?? 0

  return usesBlobs
    ? [
        {
          type: 'ethereum',
          daLayer: ProjectId('ethereum'),
          sinceBlock: inboxDeploymentBlockNumber,
          inbox: templateVars.sequencerInbox.address,
          sequencers: batchPosters,
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

function postsToEthereum(templateVars: OrbitStackConfigCommon): boolean {
  const sequencerVersion = templateVars.discovery.getContractValue<string>(
    'SequencerInbox',
    'sequencerVersion',
  )
  return sequencerVersion === '0x00'
}

function ifPostsToEthereum<T>(
  templateVars: OrbitStackConfigCommon,
  value: T,
): T | undefined {
  const sequencerVersion = templateVars.discovery.getContractValue<string>(
    'SequencerInbox',
    'sequencerVersion',
  )
  const postsToEthereum = sequencerVersion === '0x00'

  return postsToEthereum ? value : undefined
}

function getRiskView(
  templateVars: OrbitStackConfigCommon,
  daProvider: DAProvider,
): ScalingProjectRiskView {
  const maxTimeVariation = ensureMaxTimeVariationObjectFormat(
    templateVars.discovery,
  )

  const selfSequencingDelaySeconds = maxTimeVariation.delaySeconds

  const blockNumberOpcodeTimeSeconds =
    templateVars.blockNumberOpcodeTimeSeconds ?? 12 // currently only for the case of Degen Chain (built on OP stack chain which returns `block.number` based on 2 second block times, orbit host chains do not do this)

  const challengePeriodBlocks = templateVars.discovery.getContractValue<number>(
    'RollupProxy',
    'confirmPeriodBlocks',
  )
  const challengePeriodSeconds =
    challengePeriodBlocks * blockNumberOpcodeTimeSeconds

  const validatorWhitelistDisabled =
    templateVars.discovery.getContractValue<boolean>(
      'RollupProxy',
      'validatorWhitelistDisabled',
    )

  return {
    stateValidation:
      templateVars.nonTemplateRiskView?.stateValidation ??
      (() => {
        if (validatorWhitelistDisabled) {
          return RISK_VIEW.STATE_FP_INT
        }

        const nOfChallengers = templateVars.discovery.getContractValue<
          string[]
        >('RollupProxy', 'validators').length

        return {
          ...RISK_VIEW.STATE_ARBITRUM_PERMISSIONED_FRAUD_PROOFS(
            nOfChallengers,
            templateVars.hasAtLeastFiveExternalChallengers ?? false,
            challengePeriodSeconds,
          ),
          secondLine: formatChallengePeriod(challengePeriodSeconds),
        }
      })(),
    dataAvailability:
      templateVars.nonTemplateRiskView?.dataAvailability ??
      daProvider.riskViewDA,
    exitWindow:
      templateVars.nonTemplateRiskView?.exitWindow ??
      daProvider.riskViewExitWindow,
    sequencerFailure: templateVars.nonTemplateRiskView?.sequencerFailure ?? {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(selfSequencingDelaySeconds),
      secondLine: formatDelay(selfSequencingDelaySeconds),
    },
    proposerFailure:
      templateVars.nonTemplateRiskView?.proposerFailure ??
      (() => {
        if (validatorWhitelistDisabled) {
          return RISK_VIEW.PROPOSER_SELF_PROPOSE_ROOTS
        }

        const validatorAfkBlocks =
          templateVars.discovery.getContractValue<number>(
            'RollupProxy',
            'VALIDATOR_AFK_BLOCKS',
          )
        const validatorAfkTimeSeconds =
          validatorAfkBlocks * blockNumberOpcodeTimeSeconds

        return {
          ...RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(
            challengePeriodSeconds + validatorAfkTimeSeconds,
          ), // see `_validatorIsAfk()` https://basescan.org/address/0xB7202d306936B79Ba29907b391faA87D3BEec33A#code#F1#L50
          secondLine: formatDelay(
            challengePeriodSeconds + validatorAfkTimeSeconds,
          ),
        }
      })(),
  }
}

function getDAProvider(
  type: (Layer2 | Layer3)['type'],
  templateVars: OrbitStackConfigCommon,
  explorerUrl: string | undefined,
  hostChainDA?: DAProvider,
): DAProvider {
  const maxTimeVariation = ensureMaxTimeVariationObjectFormat(
    templateVars.discovery,
  )

  const selfSequencingDelaySeconds = maxTimeVariation.delaySeconds

  if (postsToEthereum(templateVars)) {
    const usesBlobs =
      templateVars.usesBlobs ??
      templateVars.discovery.getContractValueOrUndefined(
        'SequencerInbox',
        'postsBlobs',
      ) ??
      false

    return {
      layer:
        (hostChainDA?.layer ?? usesBlobs)
          ? DA_LAYERS.ETH_BLOBS_OR_CALLDATA
          : DA_LAYERS.ETH_CALLDATA,
      bridge: hostChainDA?.layer ?? DA_BRIDGES.ENSHRINED,
      mode: hostChainDA?.layer ?? DA_MODES.TRANSACTION_DATA_COMPRESSED,
      badge:
        hostChainDA?.badge ??
        (usesBlobs ? BADGES.DA.EthereumBlobs : BADGES.DA.EthereumCalldata),
      riskViewDA:
        type === 'layer2'
          ? RISK_VIEW.DATA_ON_CHAIN
          : RISK_VIEW.DATA_ON_CHAIN_L3,
      riskViewExitWindow: RISK_VIEW.EXIT_WINDOW(0, selfSequencingDelaySeconds),
      technology: {
        ...(usesBlobs
          ? TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA
          : TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CANONICAL),
        references: [
          {
            title:
              'Sequencing followed by deterministic execution - Arbitrum documentation',
            url: 'https://developer.offchainlabs.com/inside-arbitrum-nitro/#sequencing-followed-by-deterministic-execution',
          },
          ...explorerReferences(explorerUrl, [
            {
              title:
                'SequencerInbox.sol - source code, addSequencerL2BatchFromOrigin function',
              address: safeGetImplementation(templateVars.sequencerInbox),
            },
          ]),
        ],
      },
    }
  }

  const wasmModuleRoot = templateVars.discovery.getContractValue<string>(
    'RollupProxy',
    'wasmModuleRoot',
  )

  const isUsingValidBlobstreamWmr =
    wmrValidForBlobstream.includes(wasmModuleRoot)

  if (isUsingValidBlobstreamWmr) {
    return {
      riskViewDA: RISK_VIEW.DATA_CELESTIA(true),
      riskViewExitWindow: pickWorseRisk(
        RISK_VIEW.EXIT_WINDOW(0, selfSequencingDelaySeconds),
        RISK_VIEW.EXIT_WINDOW(0, BLOBSTREAM_DELAY_SECONDS),
      ),
      technology: TECHNOLOGY_DATA_AVAILABILITY.CELESTIA_OFF_CHAIN(true),
      layer: DA_LAYERS.CELESTIA,
      bridge: DA_BRIDGES.BLOBSTREAM,
      mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
      badge: BADGES.DA.CelestiaBlobstream,
    }
  } else {
    const DAC = templateVars.discovery.getContractValue<{
      membersCount: number
      requiredSignatures: number
    }>('SequencerInbox', 'dacKeyset')

    return {
      riskViewDA: RISK_VIEW.DATA_EXTERNAL_DAC(DAC),
      riskViewExitWindow: RISK_VIEW.EXIT_WINDOW(0, selfSequencingDelaySeconds),
      technology: TECHNOLOGY_DATA_AVAILABILITY.ANYTRUST_OFF_CHAIN(DAC),
      layer: DA_LAYERS.DAC,
      bridge: DA_BRIDGES.DAC_MEMBERS(DAC),
      mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
      badge: BADGES.DA.DAC,
    }
  }
}

function getTrackedTxs(templateVars: OrbitStackConfigCommon): Layer2TxConfig[] {
  const sequencerInbox = templateVars.discovery.getContract('SequencerInbox')
  const outbox = templateVars.discovery.getContract('Outbox')

  assert(
    sequencerInbox.sinceTimestamp !== undefined,
    'SequencerInbox must have a sinceTimestamp',
  )
  assert(
    outbox.sinceTimestamp !== undefined,
    'Outbox must have a sinceTimestamp',
  )

  const genesisTimestamp = Math.min(
    sequencerInbox.sinceTimestamp,
    outbox.sinceTimestamp,
  )

  return [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: sequencerInbox.address,
        selector: '0xe0bc9729',
        functionSignature:
          'function addSequencerL2Batch(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: new UnixTime(genesisTimestamp),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: sequencerInbox.address,
        selector: '0x8f111f3c',
        functionSignature:
          'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: new UnixTime(genesisTimestamp),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: sequencerInbox.address,
        selector: '0x3e5aa082',
        functionSignature:
          'function addSequencerL2BatchFromBlobs(uint256 sequenceNumber,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: new UnixTime(genesisTimestamp),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: sequencerInbox.address,
        selector: '0x6e620055',
        functionSignature:
          'function addSequencerL2BatchDelayProof(uint256 sequenceNumber, bytes data, uint256 afterDelayedMessagesRead, address gasRefunder, uint256 prevMessageCount, uint256 newMessageCount, tuple(bytes32 beforeDelayedAcc, tuple(uint8 kind, address sender, uint64 blockNumber, uint64 timestamp, uint256 inboxSeqNum, uint256 baseFeeL1, bytes32 messageDataHash) delayedMessage) delayProof)',
        sinceTimestamp: new UnixTime(genesisTimestamp),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: sequencerInbox.address,
        selector: '0x917cf8ac',
        functionSignature:
          'function addSequencerL2BatchFromBlobsDelayProof(uint256 sequenceNumber, uint256 afterDelayedMessagesRead, address gasRefunder, uint256 prevMessageCount, uint256 newMessageCount, tuple(bytes32 beforeDelayedAcc, tuple(uint8 kind, address sender, uint64 blockNumber, uint64 timestamp, uint256 inboxSeqNum, uint256 baseFeeL1, bytes32 messageDataHash) delayedMessage) delayProof)',
        sinceTimestamp: new UnixTime(genesisTimestamp),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: sequencerInbox.address,
        selector: '0x69cacded',
        functionSignature:
          'function addSequencerL2BatchFromOriginDelayProof(uint256 sequenceNumber, bytes data, uint256 afterDelayedMessagesRead, address gasRefunder, uint256 prevMessageCount, uint256 newMessageCount, tuple(bytes32 beforeDelayedAcc, tuple(uint8 kind, address sender, uint64 blockNumber, uint64 timestamp, uint256 inboxSeqNum, uint256 baseFeeL1, bytes32 messageDataHash) delayedMessage) delayProof)',
        sinceTimestamp: new UnixTime(genesisTimestamp),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: outbox.address,
        selector: '0xa04cee60',
        functionSignature:
          'function updateSendRoot(bytes32 root, bytes32 l2BlockHash) external',
        sinceTimestamp: new UnixTime(genesisTimestamp),
      },
    },
  ]
}

function extractDA(daProvider: DAProvider): ProjectDataAvailability {
  return {
    layer: daProvider.layer,
    bridge: daProvider.bridge,
    mode: daProvider.mode,
  }
}

function computedStage(templateVars: OrbitStackConfigCommon): StageConfig {
  const postsToL1 = postsToEthereum(templateVars)

  if (templateVars.stage !== undefined) {
    return templateVars.stage
  }
  if (!postsToL1) {
    return { stage: 'NotApplicable' }
  }

  return getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable:
          templateVars.isNodeAvailable ?? 'UnderReview',
      },
      stage1: {
        principle: false,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: false,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: false,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: false,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: templateVars.nodeSourceLink,
    },
  )
}

function hostChainDAProvider(hostChain: Layer2): DAProvider {
  const DABadge = hostChain.badges?.find((b) => b.type === 'DA')
  assert(DABadge !== undefined, 'Host chain must have data availability badge')
  assert(
    hostChain.technology.dataAvailability !== undefined,
    'Host chain must have technology data availability',
  )
  assert(
    hostChain.dataAvailability !== undefined,
    'Host chain must have data availability',
  )

  return {
    layer: hostChain.dataAvailability.layer,
    bridge: hostChain.dataAvailability.bridge,
    mode: hostChain.dataAvailability.mode,
    riskViewDA: hostChain.riskView.dataAvailability,
    riskViewExitWindow: hostChain.riskView.exitWindow,
    technology: hostChain.technology.dataAvailability,
    badge: DABadge,
  }
}
