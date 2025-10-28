import type { EntryParameters } from '@l2beat/discovery'
import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import isEmpty from 'lodash/isEmpty'
import unionBy from 'lodash/unionBy'
import {
  CONTRACTS,
  compareRisk,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  pickWorseRisk,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  sumRisk,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../common'
import { BADGES } from '../common/badges'
import { EXPLORER_URLS } from '../common/explorerUrls'
import { formatDelay } from '../common/formatDelays'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from '../common/liveness'
import { getStage } from '../common/stages/getStage'
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
  Milestone,
  ProjectActivityConfig,
  ProjectCustomDa,
  ProjectDaTrackingConfig,
  ProjectEscrow,
  ProjectPermission,
  ProjectRisk,
  ProjectScalingCapability,
  ProjectScalingDa,
  ProjectScalingProofSystem,
  ProjectScalingPurpose,
  ProjectScalingScopeOfAssessment,
  ProjectScalingStage,
  ProjectScalingStateDerivation,
  ProjectScalingStateValidation,
  ProjectScalingStateValidationCategory,
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
import { getDiscoveryInfo } from './getDiscoveryInfo'
import {
  asArray,
  explorerReferences,
  mergeBadges,
  safeGetImplementation,
} from './utils'

type DAProvider = ProjectScalingDa & {
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
    risks: [],
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
    risks: [],
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
  capability?: ProjectScalingCapability
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
  display: Omit<ProjectScalingDisplay, 'provider' | 'category' | 'purposes'>
  nonTemplateProofSystem?: ProjectScalingProofSystem
  bridge: EntryParameters
  blockNumberOpcodeTimeSeconds?: number
  rollupProxy: EntryParameters
  sequencerInbox: EntryParameters
  nonTemplateTechnology?: Partial<ProjectScalingTechnology>
  additiveConsiderations?: ProjectTechnologyChoice[]
  nonTemplateRiskView?: Partial<ProjectScalingRiskView>
  activityConfig?: ProjectActivityConfig
  milestones?: Milestone[]
  trackedTxs?: Layer2TxConfig[]
  chainConfig?: ChainConfig
  additionalBadges?: Badge[]
  stage?: ProjectScalingStage
  stateValidation?: ProjectScalingStateValidation
  stateDerivation?: ProjectScalingStateDerivation
  nonTemplateContractRisks?: ProjectRisk[]
  additionalPurposes?: ProjectScalingPurpose[]
  overridingPurposes?: ProjectScalingPurpose[]
  archivedAt?: UnixTime
  /** Gas tokens that are applicable yet cannot be added to tokens.jsonc for some reason (e.g. lack of CG support) */
  untrackedGasTokens?: string[]
  customDa?: ProjectCustomDa
  hasAtLeastFiveExternalChallengers?: boolean
  reasonsForBeingOther?: ReasonForBeingInOther[]
  /** Set to true if projects posts blobs to Ethereum */
  usesEthereumBlobs?: boolean
  /** Configure to enable DA metrics tracking for chain using Celestia DA */
  celestiaDa?: {
    namespace: string
    sinceBlock: number // Block number on Celestia Network
  }
  /** Configure to enable DA metrics tracking for chain using Avail DA */
  availDa?: {
    appIds: string[]
    sinceBlock: number // Block number on Avail Network
  }
  /** Configure to enable custom DA tracking e.g. project that switched DA */
  nonTemplateDaTracking?: ProjectDaTrackingConfig[]
  scopeOfAssessment?: ProjectScalingScopeOfAssessment
  celestiaProofSystemInactive?: boolean
}

export interface OrbitStackConfigL3 extends OrbitStackConfigCommon {
  stackedRiskView?: Partial<ProjectScalingRiskView>
  hostChain: string
}

export interface OrbitStackConfigL2 extends OrbitStackConfigCommon {
  display: Omit<ProjectScalingDisplay, 'provider' | 'category' | 'purposes'>
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
  }
  return result
}

export function getNitroGovernance(
  l2CoreQuorumPercent: number,
  l2TimelockDelay: number,
  challengeWindowSeconds: number,
  l1TimelockDelay: number,
  treasuryTimelockDelay: number,
  l2TreasuryQuorumPercent: number,
  challengeGracePeriodSeconds: number,
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
  )}, which is extended by an additional ${formatSeconds(challengeGracePeriodSeconds)} if the top-level assertion has been challenged.
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
  existFastConfirmer = false,
): ProjectScalingStateValidation {
  const categories: ProjectScalingStateValidationCategory[] = [
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
          url: 'https://docs.arbitrum.io/how-arbitrum-works/validation-and-proving/validation-and-proving',
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
  '0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3',
  '0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d',
]

// TODO: Add blobstream delay when timelock is enabled
const BLOBSTREAM_DELAY_SECONDS = 0

function orbitStackCommon(
  type: ScalingProject['type'],
  templateVars: OrbitStackConfigCommon,
  explorerUrl: string | undefined,
  hostChainDA?: DAProvider,
): Omit<ScalingProject, 'type' | 'display'> & {
  display: Pick<
    ProjectScalingDisplay,
    | 'stateValidationImage'
    | 'architectureImage'
    | 'purposes'
    | 'stacks'
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

  const daProviders = getDAProviders(
    type,
    templateVars,
    explorerUrl,
    hostChainDA,
  )
  assert(daProviders.length > 0)

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

  const isPostBoLD = templateVars.discovery.getContractValue<boolean>(
    'RollupProxy',
    'isPostBoLD',
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
    templateVars.discovery.getContractValueOrUndefined<ChainSpecificAddress>(
      'RollupProxy',
      'anyTrustFastConfirmer',
    ) ?? ChainSpecificAddress.from('eth', EthereumAddress.ZERO)
  const existFastConfirmer =
    ChainSpecificAddress.address(fastConfirmer) !== EthereumAddress.ZERO

  // const validatorWhitelistDisabled =
  //   templateVars.discovery.getContractValue<boolean>(
  //     'RollupProxy',
  //     'validatorWhitelistDisabled',
  //   )

  const automaticBadges = [
    BADGES.Stack.Orbit,
    BADGES.VM.EVM,
    ...daProviders.map((p) => p.badge),
  ]

  const isUsingEspressoSequencer = daProviders.some(
    (p) => p.layer === DA_LAYERS.ESPRESSO,
  )
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

  const hasNoProofs = templateVars.reasonsForBeingOther?.some(
    (e) => e.label === REASON_FOR_BEING_OTHER.NO_PROOFS.label,
  )

  return {
    id: ProjectId(templateVars.discovery.projectName),
    addedAt: templateVars.addedAt,
    capability: templateVars.capability ?? 'universal',
    archivedAt: templateVars.archivedAt ?? undefined,
    display: {
      architectureImage,
      stateValidationImage: isPostBoLD ? 'bold' : 'orbit',
      purposes: templateVars.overridingPurposes ?? [
        'Universal',
        ...(templateVars.additionalPurposes ?? []),
      ],
      ...templateVars.display,
      warning:
        'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
      stacks: ['Arbitrum'],
    },
    proofSystem:
      templateVars.nonTemplateProofSystem ??
      (hasNoProofs ? undefined : { type: 'Optimistic' }),
    riskView: getRiskView(templateVars, daProviders, isPostBoLD),
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
                : 'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
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
      sequencing:
        templateVars.nonTemplateTechnology?.sequencing ??
        (() => {
          const commonDescription = `To force transactions from the host chain, users must first enqueue "delayed" messages in the "delayed" inbox of the Bridge contract. Only authorized Inboxes are allowed to enqueue delayed messages, and the so-called Inbox contract is the one used as the entry point by calling the \`sendMessage\` or \`sendMessageFromOrigin\` functions. If the centralized sequencer doesn't process the request within some time bound, users can call the \`forceInclusion\` function on the SequencerInbox contract to include the message in the canonical chain.`
          if (!isPostBoLD) {
            return {
              name: 'Delayed forced transactions',
              description:
                commonDescription +
                ` The time bound is hardcoded to be ${formatSeconds(selfSequencingDelaySeconds)}.`,
              references: [],
              risks: [],
            } as ProjectTechnologyChoice
          }
          const buffer = templateVars.discovery.getContractValue<{
            bufferBlocks: number
            max: number
            threshold: number
            prevBlockNumber: number
            replenishRateInBasis: number
            prevSequencedBlockNumber: number
          }>('SequencerInbox', 'buffer')

          const basis = 10000 // hardcoded in SequencerInbox

          return {
            name: 'Buffered forced transactions',
            description:
              commonDescription +
              ` The time bound is defined to be the minimum between ${formatSeconds(selfSequencingDelaySeconds)} and the time left in the delay buffer. The delay buffer gets replenished over time and gets consumed every time the sequencer doesn't timely process a message. Only messages processed with a delay greater than ${formatSeconds(buffer.threshold * blockNumberOpcodeTimeSeconds)} consume the buffer. The buffer is capped at ${formatSeconds(buffer.max * blockNumberOpcodeTimeSeconds)}. The replenish rate is currently set at ${formatSeconds((buffer.replenishRateInBasis / basis) * 1200)} every ${formatSeconds(1200)}. Even if the buffer is fully consumed, messages are still allowed to be delayed up to ${formatSeconds(buffer.threshold * blockNumberOpcodeTimeSeconds)}.`,
            references: [
              {
                title:
                  'Sequencer and censorship resistance - Arbitrum documentation',
                url: 'https://docs.arbitrum.io/how-arbitrum-works/sequencer',
              },
            ],
            risks: [],
          } as ProjectTechnologyChoice
        })(),
      dataAvailability:
        templateVars.nonTemplateTechnology?.dataAvailability ??
        daProviders.map((p) => p.technology),
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
        if (isPostBoLD) {
          const validatorWhitelistDisabled =
            templateVars.discovery.getContractValue<boolean>(
              'RollupProxy',
              'validatorWhitelistDisabled',
            )

          const baseStake = templateVars.discovery.getContractValue<number>(
            'RollupProxy',
            'baseStake',
          )

          const blockTime = templateVars.blockNumberOpcodeTimeSeconds ?? 12

          const assertionsChallengePeriod =
            templateVars.discovery.getContractValue<number>(
              'RollupProxy',
              'confirmPeriodBlocks',
            )

          const edgesChallengePeriod =
            templateVars.discovery.getContractValue<number>(
              'EdgeChallengeManager',
              'challengePeriodBlocks',
            )

          const numBigStepLevels =
            templateVars.discovery.getContractValue<number>(
              'EdgeChallengeManager',
              'NUM_BIGSTEP_LEVEL',
            )

          const stakeAmounts = templateVars.discovery.getContractValue<
            number[]
          >('EdgeChallengeManager', 'stakeAmounts')

          return BoLDStateValidation(
            validatorWhitelistDisabled,
            baseStake,
            minimumAssertionPeriod,
            assertionsChallengePeriod * blockTime,
            edgesChallengePeriod * blockTime,
            numBigStepLevels,
            stakeAmounts,
          )
        }
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
    dataAvailability: extractDAs(daProviders),
    scopeOfAssessment: templateVars.scopeOfAssessment,
    discoveryInfo: getDiscoveryInfo(allDiscoveries),
  }
}

export function orbitStackL3(templateVars: OrbitStackConfigL3): ScalingProject {
  const layer2s = require('../processing/layer2s').layer2s as ScalingProject[]
  const hostChain = templateVars.hostChain

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
    ecosystemInfo: {
      id: ProjectId('arbitrum-orbit'),
    },
    hostChain: ProjectId(hostChain),
    display: { ...common.display, ...templateVars.display },
    stackedRiskView: getStackedRisks(),
  }
}

export function orbitStackL2(templateVars: OrbitStackConfigL2): ScalingProject {
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
      liveness: ifPostsToEthereum(
        templateVars,
        templateVars.display.liveness ?? {
          warnings: {
            stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
          },
          explanation: `${
            templateVars.display.name
          } posts transaction data to the L1. For a transaction to be considered final, it has to be posted to the L1. Forced txs can be delayed up to ${formatSeconds(
            selfSequencingDelaySeconds,
          )}. The state root is settled ${formatSeconds(
            challengePeriodSeconds,
          )} after it has been posted.`,
        },
      ),
    },
    config: {
      ...common.config,
      trackedTxs: getTrackedTxs(templateVars),
    },
    ecosystemInfo: {
      id: ProjectId('arbitrum-orbit'),
    },
    upgradesAndGovernance: templateVars.upgradesAndGovernance,
  }
}

function getDaTracking(
  templateVars: OrbitStackConfigL2 | OrbitStackConfigL3,
): ProjectDaTrackingConfig[] | undefined {
  // Return non-template tracking if it exists
  if (templateVars.nonTemplateDaTracking) {
    return templateVars.nonTemplateDaTracking
  }

  if (templateVars.usesEthereumBlobs) {
    const batchPosters = templateVars.discovery
      .getContractValue<ChainSpecificAddress[]>(
        'SequencerInbox',
        'batchPosters',
      )
      .map((a) => ChainSpecificAddress.address(a))

    const inboxDeploymentBlockNumber =
      templateVars.discovery.getContract('SequencerInbox').sinceBlock ?? 0

    return [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: inboxDeploymentBlockNumber,
        inbox: ChainSpecificAddress.address(
          templateVars.sequencerInbox.address,
        ),
        sequencers: batchPosters,
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

function postsToEthereum(templateVars: OrbitStackConfigCommon): boolean {
  const sequencerVersion = templateVars.discovery.getContractValue<string>(
    'SequencerInbox',
    'sequencerVersion',
  )
  return sequencerVersion === '0x00'
}

function postsToDAC(templateVars: OrbitStackConfigCommon): boolean {
  const sequencerVersion = templateVars.discovery.getContractValue<string>(
    'SequencerInbox',
    'sequencerVersion',
  )
  return sequencerVersion === '0x88'
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
  daProviders: DAProvider[],
  isPostBoLD = false,
): ProjectScalingRiskView {
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

  const challengeGracePeriodBlocks =
    templateVars.discovery.getContractValueOrUndefined(
      'RollupProxy',
      'challengeGracePeriodBlocks',
    )

  const validatorWhitelistDisabled =
    templateVars.discovery.getContractValue<boolean>(
      'RollupProxy',
      'validatorWhitelistDisabled',
    )

  const theLeastRiskyDaProvider = daProviders.sort((dap1, dap2) =>
    compareRisk(dap2.riskViewDA, dap1.riskViewDA),
  )[0]
  assert(theLeastRiskyDaProvider)

  return {
    stateValidation:
      templateVars.nonTemplateRiskView?.stateValidation ??
      (() => {
        if (validatorWhitelistDisabled) {
          return RISK_VIEW.STATE_FP_INT(
            challengePeriodSeconds,
            challengeGracePeriodBlocks
              ? Number(challengeGracePeriodBlocks) *
                  blockNumberOpcodeTimeSeconds
              : undefined,
          )
        }

        const nOfChallengers = isPostBoLD
          ? templateVars.discovery.getContractValue<string[]>(
              'RollupProxy',
              'getValidators',
            ).length
          : templateVars.discovery.getContractValue<string[]>(
              'RollupProxy',
              'validators',
            ).length

        return {
          ...RISK_VIEW.STATE_ARBITRUM_PERMISSIONED_FRAUD_PROOFS(
            nOfChallengers,
            templateVars.hasAtLeastFiveExternalChallengers ?? false,
            challengePeriodSeconds,
            challengeGracePeriodBlocks
              ? Number(challengeGracePeriodBlocks) *
                  blockNumberOpcodeTimeSeconds
              : undefined,
          ),
          initialBond: isPostBoLD
            ? formatEther(
                templateVars.discovery.getContractValue<number>(
                  'RollupProxy',
                  'baseStake',
                ),
              )
            : formatEther(
                templateVars.discovery.getContractValue<number>(
                  'RollupProxy',
                  'currentRequiredStake',
                ),
              ),
        }
      })(),
    dataAvailability:
      templateVars.nonTemplateRiskView?.dataAvailability ??
      theLeastRiskyDaProvider.riskViewDA,
    exitWindow:
      templateVars.nonTemplateRiskView?.exitWindow ??
      theLeastRiskyDaProvider.riskViewExitWindow,
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
            isPostBoLD ? 'validatorAfkBlocks' : 'VALIDATOR_AFK_BLOCKS',
          )
        const validatorAfkTimeSeconds =
          validatorAfkBlocks * blockNumberOpcodeTimeSeconds

        const totalDelay = isPostBoLD
          ? validatorAfkTimeSeconds
          : challengePeriodSeconds + validatorAfkTimeSeconds // see `_validatorIsAfk()` https://basescan.org/address/0xB7202d306936B79Ba29907b391faA87D3BEec33A#code#F1#L50

        return {
          ...RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(totalDelay),
          secondLine: formatDelay(totalDelay),
        }
      })(),
  }
}

function getDAProviders(
  type: ScalingProject['type'],
  templateVars: OrbitStackConfigCommon,
  explorerUrl: string | undefined,
  hostChainDA?: DAProvider,
): DAProvider[] {
  const result: DAProvider[] = []
  const maxTimeVariation = ensureMaxTimeVariationObjectFormat(
    templateVars.discovery,
  )

  const selfSequencingDelaySeconds = maxTimeVariation.delaySeconds

  if (postsToEthereum(templateVars)) {
    const usesBlobs =
      templateVars.usesEthereumBlobs ??
      templateVars.discovery.getContractValueOrUndefined(
        'SequencerInbox',
        'postsBlobs',
      ) ??
      false

    // Return and don't even check for other DAs
    return [
      {
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
        riskViewExitWindow: RISK_VIEW.EXIT_WINDOW(
          0,
          selfSequencingDelaySeconds,
        ),
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
      },
    ]
  }

  const wasmModuleRoot = templateVars.discovery.getContractValue<string>(
    'RollupProxy',
    'wasmModuleRoot',
  )

  const isUsingValidBlobstreamWmr =
    wmrValidForBlobstream.includes(wasmModuleRoot)

  if (isUsingValidBlobstreamWmr) {
    if (templateVars.celestiaProofSystemInactive) {
      result.push({
        riskViewDA: RISK_VIEW.DATA_CELESTIA(false),
        riskViewExitWindow: RISK_VIEW.EXIT_WINDOW(
          0,
          selfSequencingDelaySeconds,
        ),
        technology: TECHNOLOGY_DATA_AVAILABILITY.CELESTIA_OFF_CHAIN(false),
        layer: DA_LAYERS.CELESTIA,
        bridge: DA_BRIDGES.NONE,
        mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
        badge: BADGES.DA.Celestia,
      })
    } else {
      result.push({
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
      })
    }
  }

  const isUsingEspressoSequencer =
    templateVars.discovery.getContractValueOrUndefined<string>(
      'SequencerInbox',
      'espressoTEEVerifier',
    ) !== undefined &&
    templateVars.discovery.getContractValue<string>(
      'SequencerInbox',
      'espressoTEEVerifier',
    ) !== EthereumAddress.ZERO

  const isUsingEspressonAndDac =
    isUsingEspressoSequencer && postsToDAC(templateVars)

  if (isUsingEspressoSequencer) {
    const isUsingLightClient = false
    result.push({
      riskViewDA: RISK_VIEW.DATA_ESPRESSO(isUsingLightClient),
      // TODO: when LightClient is used, modify what is added here
      riskViewExitWindow: RISK_VIEW.EXIT_WINDOW(0, selfSequencingDelaySeconds),
      technology:
        TECHNOLOGY_DATA_AVAILABILITY.ESPRESSO_OFF_CHAIN(isUsingLightClient),
      layer: DA_LAYERS.ESPRESSO,
      bridge: isUsingLightClient
        ? DA_BRIDGES.HOTSHOT_LIGHT_CLIENT
        : DA_BRIDGES.NONE,
      mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
      badge: isUsingLightClient
        ? BADGES.DA.EspressoHotShotLightClient
        : BADGES.DA.Espresso,
    })
  }

  if (result.length > 0 && !isUsingEspressonAndDac) {
    return result
  }

  const DAC = templateVars.discovery.getContractValue<{
    membersCount: number
    requiredSignatures: number
  }>('SequencerInbox', 'dacKeyset')

  result.push({
    riskViewDA: RISK_VIEW.DATA_EXTERNAL_DAC(DAC),
    riskViewExitWindow: RISK_VIEW.EXIT_WINDOW(0, selfSequencingDelaySeconds),
    technology: TECHNOLOGY_DATA_AVAILABILITY.ANYTRUST_OFF_CHAIN(DAC),
    layer: DA_LAYERS.DAC,
    bridge: DA_BRIDGES.DAC_MEMBERS(DAC),
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
    badge: BADGES.DA.DAC,
  })
  return result
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
        address: ChainSpecificAddress.address(sequencerInbox.address),
        selector: '0xe0bc9729',
        functionSignature:
          'function addSequencerL2Batch(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: UnixTime(genesisTimestamp),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(sequencerInbox.address),
        selector: '0x8f111f3c',
        functionSignature:
          'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: UnixTime(genesisTimestamp),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(sequencerInbox.address),
        selector: '0x37501551',
        functionSignature:
          'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber, bytes data, uint256 afterDelayedMessagesRead, address gasRefunder, uint256 prevMessageCount, uint256 newMessageCount, bytes quote)',
        sinceTimestamp: UnixTime(genesisTimestamp),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(sequencerInbox.address),
        selector: '0x3e5aa082',
        functionSignature:
          'function addSequencerL2BatchFromBlobs(uint256 sequenceNumber,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: UnixTime(genesisTimestamp),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(sequencerInbox.address),
        selector: '0x6e620055',
        functionSignature:
          'function addSequencerL2BatchDelayProof(uint256 sequenceNumber, bytes data, uint256 afterDelayedMessagesRead, address gasRefunder, uint256 prevMessageCount, uint256 newMessageCount, tuple(bytes32 beforeDelayedAcc, tuple(uint8 kind, address sender, uint64 blockNumber, uint64 timestamp, uint256 inboxSeqNum, uint256 baseFeeL1, bytes32 messageDataHash) delayedMessage) delayProof)',
        sinceTimestamp: UnixTime(genesisTimestamp),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(sequencerInbox.address),
        selector: '0x917cf8ac',
        functionSignature:
          'function addSequencerL2BatchFromBlobsDelayProof(uint256 sequenceNumber, uint256 afterDelayedMessagesRead, address gasRefunder, uint256 prevMessageCount, uint256 newMessageCount, tuple(bytes32 beforeDelayedAcc, tuple(uint8 kind, address sender, uint64 blockNumber, uint64 timestamp, uint256 inboxSeqNum, uint256 baseFeeL1, bytes32 messageDataHash) delayedMessage) delayProof)',
        sinceTimestamp: UnixTime(genesisTimestamp),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(sequencerInbox.address),
        selector: '0x69cacded',
        functionSignature:
          'function addSequencerL2BatchFromOriginDelayProof(uint256 sequenceNumber, bytes data, uint256 afterDelayedMessagesRead, address gasRefunder, uint256 prevMessageCount, uint256 newMessageCount, tuple(bytes32 beforeDelayedAcc, tuple(uint8 kind, address sender, uint64 blockNumber, uint64 timestamp, uint256 inboxSeqNum, uint256 baseFeeL1, bytes32 messageDataHash) delayedMessage) delayProof)',
        sinceTimestamp: UnixTime(genesisTimestamp),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(outbox.address),
        selector: '0xa04cee60',
        functionSignature:
          'function updateSendRoot(bytes32 root, bytes32 l2BlockHash) external',
        sinceTimestamp: UnixTime(genesisTimestamp),
      },
    },
  ]
}

function extractDAs(daProviders: DAProvider[]): ProjectScalingDa[] {
  return daProviders.map((daProvider) => ({
    layer: daProvider.layer,
    bridge: daProvider.bridge,
    mode: daProvider.mode,
  }))
}

function computedStage(
  templateVars: OrbitStackConfigCommon,
): ProjectScalingStage {
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
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: false,
      },
      stage1: {
        principle: false,
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

function hostChainDAProvider(hostChain: ScalingProject): DAProvider {
  const DABadge = hostChain.badges?.find((b) => b.type === 'DA')
  assert(DABadge !== undefined, 'Host chain must have data availability badge')
  assert(
    hostChain.technology?.dataAvailability !== undefined,
    'Host chain must have technology data availability',
  )

  // Currently we don't support multiple-DAs on the host chain
  const hostChainDAs = asArray(hostChain.dataAvailability)
  const hostChainDaTechs = asArray(hostChain.technology.dataAvailability)
  assert(
    hostChainDAs.length === 1 && hostChainDaTechs.length === 1,
    'Only exactly one DA on the host chain is currently supported',
  )
  const hostDA = hostChainDAs[0]
  assert(hostDA !== undefined, 'Host chain must have data availability')
  const hostDaTech = hostChainDaTechs[0]
  assert(
    hostDaTech !== undefined,
    'Host chain must have data availability technology assigned',
  )

  return {
    layer: hostDA.layer,
    bridge: hostDA.bridge,
    mode: hostDA.mode,
    riskViewDA: hostChain.riskView.dataAvailability,
    riskViewExitWindow: hostChain.riskView.exitWindow,
    technology: hostDaTech,
    badge: DABadge,
  }
}
function BoLDStateValidation(
  isWhitelistDisabled: boolean,
  baseStake: number,
  minimumAssertionPeriod: number,
  assertionsChallengePeriod: number,
  edgesChallengePeriod: number,
  numBigStepLevels: number,
  stakeAmounts: number[],
): ProjectScalingStateValidation {
  let stakeDescription = ''
  for (let i = 0; i < numBigStepLevels + 2; i++) {
    if (i === 0) {
      stakeDescription += `Level ${i} (block level) requires a stake of ${utils.formatEther(stakeAmounts[i])} ETH`
    } else {
      stakeDescription += `, level ${i} requires a stake of ${utils.formatEther(stakeAmounts[i])} ETH`
    }
  }

  return {
    description: isWhitelistDisabled
      ? 'Updates to the system state can be proposed and challenged by anyone who has sufficient funds. If a state root passes the challenge period, it is optimistically considered correct and made actionable for withdrawals.'
      : 'Updates to the system state can be proposed and challenged by a set of whitelisted validators. If a state root passes the challenge period, it is optimistically considered correct and made actionable for withdrawals.',
    categories: [
      {
        title: 'State root proposals',
        description: `Validators propose state roots as children of a previous state root. A state root can have multiple conflicting children. State roots are referred to as "assertions" within the contracts. Each chain of assertions only requires one stake, and validators staked on assertions with a child are considered inactive and can either move their stake to a new node or withdraw it. The function used to propose a new assertion is the \`stakeOnNewAssertion\` function. The stake is currently set to ${utils.formatEther(baseStake)} ETH, and it can be slashed if the proposal is proven incorrect via a fraud proof. The protocol allows such funds to be trustlessly pooled together if necessary. New nodes cannot be created faster than the minimum assertion period, currently set to ${formatSeconds(
          minimumAssertionPeriod,
        )}. An assertion without "rivals" can be confirmed after the challenge period has passed, currently set to ${formatSeconds(
          assertionsChallengePeriod,
        )}. If a rival is present, then it is checked that the assertion is the winner in the challenge protocol.`,
        risks: [],
        references: [
          {
            title: 'BoLD paper',
            url: 'https://arxiv.org/pdf/2404.10491',
          },
        ],
      },
      {
        title: 'Challenges',
        description: `A challenge can be started between two siblings, i.e. two different state roots that share the same parent, by calling the \`createLayerZeroEdge\` function in the \`ChallengeManager\` contract. Edges represent assertions, or bisected assertions, within the challenge protocol. Challenges are played via a bisection game, where asserters and challengers play together to find the first instruction of disagreement. Such instruction is then executed onchain in the WASM OneStepProver contract to determine the winner. An edge can only be bisected when rivaled. The bisection process requires no new stake as their validity is checked against a parent "history root" that contains all intermediate states. An edge can also be confirmed if itself or its descendants spend enough time being unrivaled. Such time is set to ${formatSeconds(edgesChallengePeriod)}. If both actors play as slow as possible, the maximum time to confirm an edge is double such value, i.e. ${formatSeconds(
          edgesChallengePeriod * 2,
        )}. Due to the complexities of maintaining the history root, the challenge protocol is divided into ${numBigStepLevels + 2} levels, where the lowest level represents assertions over blocks, the highest level represents assertions over single WASM instructions, and intermediate levels represent assertions over chunks of WASM instructions. When moving between levels, a new stake is required. ${stakeDescription}. The ratio between such stakes can be exploited to perform resource exhaustion attacks.`,
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'an attacker successfully performs a resource exhaustion attack.',
          },
        ],
        references: [
          {
            title: 'Fraud Proof Wars: Arbitrum BoLD',
            url: 'https://medium.com/l2beat/fraud-proof-wars-b0cb4d0f452a',
          },
        ],
      },
    ],
  }
}
