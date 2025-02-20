import type { ContractParameters } from '@l2beat/discovery-types'
import {
  assert,
  EthereumAddress,
  ProjectId,
  type UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { unionBy } from 'lodash'
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
  ChainConfig,
  CustomDa,
  KnowledgeNugget,
  Layer2,
  Layer2Display,
  Layer2FinalityConfig,
  Layer2TxConfig,
  Layer3,
  Milestone,
  ProjectDaTrackingConfig,
  ProjectEscrow,
  ProjectPermission,
  ProjectTechnologyChoice,
  ProjectUpgradeableActor,
  ReasonForBeingInOther,
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
  TransactionApiConfig,
} from '../../../types'
import { Badge, type BadgeId, badges } from '../../badges'
import { EXPLORER_URLS } from '../../chains/explorerUrls'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from '../common/liveness'
import { getStage } from '../common/stages/getStage'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from './generateDiscoveryDrivenSections'
import { explorerReferences, mergeBadges, safeGetImplementation } from './utils'

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
  bridge: ContractParameters
  blockNumberOpcodeTimeSeconds?: number
  finality?: Layer2FinalityConfig
  rollupProxy: ContractParameters
  sequencerInbox: ContractParameters
  nonTemplateTechnology?: Partial<ScalingProjectTechnology>
  additiveConsiderations?: ProjectTechnologyChoice[]
  nonTemplateRiskView?: Partial<ScalingProjectRiskView>
  rpcUrl?: string
  transactionApi?: TransactionApiConfig
  milestones?: Milestone[]
  knowledgeNuggets?: KnowledgeNugget[]
  trackedTxs?: Layer2TxConfig[]
  chainConfig?: ChainConfig
  usesBlobs?: boolean
  additionalBadges?: BadgeId[]
  stage?: StageConfig
  stateValidation?: ScalingProjectStateValidation
  stateDerivation?: ScalingProjectStateDerivation
  upgradesAndGovernance?: string
  nonTemplateContractRisks?: ScalingProjectRisk[]
  additionalPurposes?: ScalingProjectPurpose[]
  overridingPurposes?: ScalingProjectPurpose[]
  isArchived?: boolean
  gasTokens?: string[]
  customDa?: CustomDa
  hasAtLeastFiveExternalChallengers?: boolean
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
}

export interface OrbitStackConfigL3 extends OrbitStackConfigCommon {
  display: Omit<ScalingProjectDisplay, 'provider' | 'category' | 'purposes'> & {
    category?: ScalingProjectDisplay['category']
  }
  stackedRiskView?: Partial<ScalingProjectRiskView>
}

export interface OrbitStackConfigL2 extends OrbitStackConfigCommon {
  display: Omit<Layer2Display, 'provider' | 'category' | 'purposes'> & {
    category?: Layer2Display['category']
  }
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

// TO DO: Add blobstream delay when timelock is enabled
const BLOBSTREAM_DELAY_SECONDS = 0

function orbitStackCommon(
  templateVars: OrbitStackConfigCommon,
  explorerUrl: string | undefined,
  blockNumberOpcodeTimeSeconds: number,
): Omit<Layer2, 'type' | 'display' | 'config' | 'stage' | 'riskView'> {
  const nativeContractRisks = templateVars.nonTemplateContractRisks ?? [
    CONTRACTS.UPGRADE_NO_DELAY_RISK,
  ]

  const allDiscoveries = [
    templateVars.discovery,
    ...Object.values(templateVars.additionalDiscoveries ?? {}),
  ]
  const usesBlobs =
    templateVars.usesBlobs ??
    templateVars.discovery.getContractValueOrUndefined(
      'SequencerInbox',
      'postsBlobs',
    ) ??
    false

  const maxTimeVariation = ensureMaxTimeVariationObjectFormat(
    templateVars.discovery,
  )

  const selfSequencingDelaySeconds = maxTimeVariation.delaySeconds

  const sequencerVersion = templateVars.discovery.getContractValue<string>(
    'SequencerInbox',
    'sequencerVersion',
  )
  const wasmModuleRoot = templateVars.discovery.getContractValue<string>(
    'RollupProxy',
    'wasmModuleRoot',
  )
  const isUsingValidBlobstreamWmr =
    wmrValidForBlobstream.includes(wasmModuleRoot)

  const isUsingEspressoSequencer =
    templateVars.discovery.getContractValueOrUndefined<string>(
      'SequencerInbox',
      'espressoTEEVerifier',
    ) !== undefined &&
    templateVars.discovery.getContractValue<string>(
      'SequencerInbox',
      'espressoTEEVerifier',
    ) !== EthereumAddress.ZERO

  const minimumAssertionPeriod =
    templateVars.discovery.getContractValue<number>(
      'RollupProxy',
      'minimumAssertionPeriod',
    ) * 12 // 12 seconds is the assumed block time
  const postsToExternalDA = sequencerVersion !== '0x00'
  if (postsToExternalDA) {
    assert(
      templateVars.additionalBadges?.find((b) => badges[b].type === 'DA') !==
        undefined,
      'DA badge is required for external DA',
    )
  }
  const daBadge = usesBlobs ? Badge.DA.EthereumBlobs : Badge.DA.EthereumCalldata

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

  return {
    id: ProjectId(templateVars.discovery.projectName),
    addedAt: templateVars.addedAt,
    capability: templateVars.capability ?? 'universal',
    isArchived: templateVars.isArchived ?? undefined,
    contracts: {
      addresses: generateDiscoveryDrivenContracts(allDiscoveries),
      risks: nativeContractRisks,
    },
    chainConfig: templateVars.chainConfig,
    technology: {
      sequencing: templateVars.nonTemplateTechnology?.sequencing,
      stateCorrectness:
        templateVars.nonTemplateTechnology?.stateCorrectness ?? undefined,
      dataAvailability:
        (templateVars.nonTemplateTechnology?.dataAvailability ??
        postsToExternalDA)
          ? (() => {
              if (isUsingValidBlobstreamWmr) {
                return TECHNOLOGY_DATA_AVAILABILITY.CELESTIA_OFF_CHAIN(true)
              } else {
                const DAC = templateVars.discovery.getContractValue<{
                  membersCount: number
                  requiredSignatures: number
                }>('SequencerInbox', 'dacKeyset')
                const { membersCount, requiredSignatures } = DAC

                return TECHNOLOGY_DATA_AVAILABILITY.ANYTRUST_OFF_CHAIN({
                  membersCount,
                  requiredSignatures,
                })
              }
            })()
          : {
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
            title: 'Sequencer Isn’t Doing Its Job - Arbitrum documentation',
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
    upgradesAndGovernance: templateVars.upgradesAndGovernance,
    milestones: templateVars.milestones,
    knowledgeNuggets: templateVars.knowledgeNuggets,
    badges: mergeBadges(
      [
        Badge.Stack.Orbit,
        Badge.VM.EVM,
        daBadge,
        ...(isUsingEspressoSequencer ? [Badge.Other.EspressoPreconfs] : []),
      ],
      templateVars.additionalBadges ?? [],
    ),
    customDa: templateVars.customDa,
    reasonsForBeingOther: templateVars.reasonsForBeingOther,
  }
}

export function orbitStackL3(templateVars: OrbitStackConfigL3): Layer3 {
  const layer2s = require('..').layer2s as Layer2[]
  const hostChain = templateVars.discovery.chain

  const baseChain = layer2s.find((l2) => l2.id === hostChain)
  assert(baseChain, `Could not find base chain ${hostChain} in layer2s`)

  const blockNumberOpcodeTimeSeconds =
    templateVars.blockNumberOpcodeTimeSeconds ?? 12 // currently only for the case of Degen Chain (built on OP stack chain which returns `block.number` based on 2 second block times, orbit host chains do not do this)

  const challengePeriodBlocks = templateVars.discovery.getContractValue<number>(
    'RollupProxy',
    'confirmPeriodBlocks',
  )
  const challengePeriodSeconds =
    challengePeriodBlocks * blockNumberOpcodeTimeSeconds

  const validatorAfkBlocks = templateVars.discovery.getContractValue<number>(
    'RollupProxy',
    'VALIDATOR_AFK_BLOCKS',
  )
  const validatorAfkTimeSeconds =
    validatorAfkBlocks * blockNumberOpcodeTimeSeconds

  const maxTimeVariation = ensureMaxTimeVariationObjectFormat(
    templateVars.discovery,
  )

  const selfSequencingDelaySeconds = maxTimeVariation.delaySeconds

  const sequencerVersion = templateVars.discovery.getContractValue<string>(
    'SequencerInbox',
    'sequencerVersion',
  )
  const postsToExternalDA = sequencerVersion !== '0x00'

  const nOfChallengers = templateVars.discovery.getContractValue<string[]>(
    'RollupProxy',
    'validators',
  ).length

  const upgradeability = templateVars.upgradeability ?? {
    upgradableBy: [{ name: 'ProxyAdmin', delay: 'no' }],
  }

  const wasmModuleRoot = templateVars.discovery.getContractValue<string>(
    'RollupProxy',
    'wasmModuleRoot',
  )
  const isUsingValidBlobstreamWmr =
    wmrValidForBlobstream.includes(wasmModuleRoot)

  const riskView = {
    stateValidation: templateVars.nonTemplateRiskView?.stateValidation ?? {
      ...RISK_VIEW.STATE_ARBITRUM_PERMISSIONED_FRAUD_PROOFS(
        nOfChallengers,
        templateVars.hasAtLeastFiveExternalChallengers ?? false,
        challengePeriodSeconds,
      ),
      secondLine: formatChallengePeriod(challengePeriodSeconds),
    },
    dataAvailability:
      (templateVars.nonTemplateRiskView?.dataAvailability ?? postsToExternalDA)
        ? (() => {
            if (isUsingValidBlobstreamWmr) {
              return RISK_VIEW.DATA_CELESTIA(true)
            } else {
              const DAC = templateVars.discovery.getContractValue<{
                membersCount: number
                requiredSignatures: number
              }>('SequencerInbox', 'dacKeyset')
              const { membersCount, requiredSignatures } = DAC
              return RISK_VIEW.DATA_EXTERNAL_DAC({
                membersCount,
                requiredSignatures,
              })
            }
          })()
        : RISK_VIEW.DATA_ON_CHAIN_L3,
    exitWindow:
      templateVars.nonTemplateRiskView?.exitWindow ??
      (isUsingValidBlobstreamWmr
        ? pickWorseRisk(
            RISK_VIEW.EXIT_WINDOW(0, selfSequencingDelaySeconds),
            RISK_VIEW.EXIT_WINDOW(0, BLOBSTREAM_DELAY_SECONDS),
          )
        : RISK_VIEW.EXIT_WINDOW(0, selfSequencingDelaySeconds)),
    sequencerFailure: templateVars.nonTemplateRiskView?.sequencerFailure ?? {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(selfSequencingDelaySeconds),
      secondLine: formatDelay(selfSequencingDelaySeconds),
    },
    proposerFailure: templateVars.nonTemplateRiskView?.proposerFailure ?? {
      ...RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(
        challengePeriodSeconds + validatorAfkTimeSeconds,
      ), // see `_validatorIsAfk()` https://basescan.org/address/0xB7202d306936B79Ba29907b391faA87D3BEec33A#code#F1#L50
      secondLine: formatDelay(challengePeriodSeconds + validatorAfkTimeSeconds),
    },
  }

  const getStackedRisks = () => {
    return {
      stateValidation:
        templateVars.stackedRiskView?.stateValidation ??
        pickWorseRisk(
          riskView.stateValidation,
          baseChain.riskView.stateValidation,
        ),
      dataAvailability:
        templateVars.stackedRiskView?.dataAvailability ??
        pickWorseRisk(
          riskView.dataAvailability,
          baseChain.riskView.dataAvailability,
        ),
      exitWindow:
        templateVars.stackedRiskView?.exitWindow ??
        pickWorseRisk(riskView.exitWindow, baseChain.riskView.exitWindow),
      sequencerFailure:
        templateVars.stackedRiskView?.sequencerFailure ??
        sumRisk(
          riskView.sequencerFailure,
          baseChain.riskView.sequencerFailure,
          RISK_VIEW.SEQUENCER_SELF_SEQUENCE,
        ),
      proposerFailure:
        templateVars.stackedRiskView?.sequencerFailure ??
        sumRisk(
          riskView.proposerFailure,
          baseChain.riskView.proposerFailure,
          RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED,
        ),
    }
  }

  const fastConfirmer =
    templateVars.discovery.getContractValueOrUndefined<EthereumAddress>(
      'RollupProxy',
      'anyTrustFastConfirmer',
    ) ?? EthereumAddress.ZERO

  const existFastConfirmer = fastConfirmer !== EthereumAddress.ZERO

  const isUsingEspressoSequencer =
    templateVars.discovery.getContractValueOrUndefined<string>(
      'SequencerInbox',
      'espressoTEEVerifier',
    ) !== undefined &&
    templateVars.discovery.getContractValue<string>(
      'SequencerInbox',
      'espressoTEEVerifier',
    ) !== EthereumAddress.ZERO

  const architectureImage = existFastConfirmer
    ? 'orbit-optimium-fastconfirm'
    : isUsingEspressoSequencer && isUsingValidBlobstreamWmr
      ? 'orbit-optimium-blobstream-espresso'
      : isUsingValidBlobstreamWmr
        ? 'orbit-optimium-blobstream'
        : postsToExternalDA
          ? 'orbit-optimium'
          : 'orbit-rollup'

  return {
    type: 'layer3',
    ...orbitStackCommon(
      templateVars,
      baseChain.chainConfig?.explorerUrl,
      blockNumberOpcodeTimeSeconds,
    ),
    hostChain: ProjectId(hostChain),
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
    stage:
      templateVars.stage ??
      (postsToExternalDA
        ? {
            stage: 'NotApplicable',
          }
        : getStage(
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
          )),
    dataAvailability: postsToExternalDA
      ? (() => {
          if (isUsingValidBlobstreamWmr) {
            return {
              layer: DA_LAYERS.CELESTIA,
              bridge: DA_BRIDGES.BLOBSTREAM,
              mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
            }
          } else {
            const DAC = templateVars.discovery.getContractValue<{
              membersCount: number
              requiredSignatures: number
            }>('SequencerInbox', 'dacKeyset')
            const { membersCount, requiredSignatures } = DAC

            return {
              layer: DA_LAYERS.DAC,
              bridge: DA_BRIDGES.DAC_MEMBERS({
                membersCount,
                requiredSignatures,
              }),
              mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
            }
          }
        })()
      : baseChain.dataAvailability,
    stackedRiskView: getStackedRisks(),
    riskView,
    config: {
      associatedTokens: templateVars.associatedTokens,
      escrows:
        templateVars.overrideEscrows ??
        unionBy(
          [
            ...(templateVars.nonTemplateEscrows ?? []),
            templateVars.discovery.getEscrowDetails({
              includeInTotal: false,
              address: templateVars.bridge.address,
              tokens: templateVars.gasTokens ?? ['ETH'],
              description: templateVars.gasTokens
                ? `Contract managing Inboxes and Outboxes. It escrows ${templateVars.gasTokens.join(', ')} sent to L2.`
                : `Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.`,
              ...upgradeability,
            }),
          ],
          'address',
        ),
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
      daTracking: getDaTracking(templateVars),
    },
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

  // TODO: update to value from discovery
  const inboxDeploymentBlockNumber = 0

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

  const sequencerVersion = templateVars.discovery.getContractValue<string>(
    'SequencerInbox',
    'sequencerVersion',
  )
  const postsToExternalDA = sequencerVersion !== '0x00'

  const upgradeability = templateVars.upgradeability ?? {
    upgradableBy: [{ name: 'ProxyAdmin', delay: 'no' }],
  }

  const category =
    templateVars.display.category ??
    (postsToExternalDA ? 'Optimium' : 'Optimistic Rollup')

  const fastConfirmer =
    templateVars.discovery.getContractValueOrUndefined<EthereumAddress>(
      'RollupProxy',
      'anyTrustFastConfirmer',
    ) ?? EthereumAddress.ZERO

  const existFastConfirmer = fastConfirmer !== EthereumAddress.ZERO

  const wasmModuleRoot = templateVars.discovery.getContractValue<string>(
    'RollupProxy',
    'wasmModuleRoot',
  )
  const isUsingValidBlobstreamWmr =
    wmrValidForBlobstream.includes(wasmModuleRoot)

  const isUsingEspressoSequencer =
    templateVars.discovery.getContractValueOrUndefined<string>(
      'SequencerInbox',
      'espressoTEEVerifier',
    ) !== undefined &&
    templateVars.discovery.getContractValue<string>(
      'SequencerInbox',
      'espressoTEEVerifier',
    ) !== EthereumAddress.ZERO

  const architectureImage = existFastConfirmer
    ? 'orbit-optimium-fastconfirm'
    : isUsingEspressoSequencer && isUsingValidBlobstreamWmr
      ? 'orbit-optimium-blobstream-espresso'
      : isUsingValidBlobstreamWmr
        ? 'orbit-optimium-blobstream'
        : postsToExternalDA
          ? 'orbit-optimium'
          : 'orbit-rollup'

  const usesBlobs =
    templateVars.usesBlobs ??
    templateVars.discovery.getContractValueOrUndefined(
      'SequencerInbox',
      'postsBlobs',
    ) ??
    false

  const validatorWhitelistDisabled =
    templateVars.discovery.getContractValue<boolean>(
      'RollupProxy',
      'validatorWhitelistDisabled',
    )

  return {
    type: 'layer2',
    ...orbitStackCommon(templateVars, EXPLORER_URLS['ethereum'], 12),
    display: {
      architectureImage,
      stateValidationImage: 'orbit',
      purposes: templateVars.overridingPurposes ?? [
        'Universal',
        ...(templateVars.additionalPurposes ?? []),
      ],
      warning:
        'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
      ...templateVars.display,
      stack: 'Arbitrum',
      category,
      finality: {
        finalizationPeriod: challengePeriodSeconds,
      },
      liveness: postsToExternalDA
        ? undefined
        : (templateVars.display.liveness ?? {
            warnings: {
              stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
            },
            explanation: `${
              templateVars.display.name
            } is an ${category} that posts transaction data to the L1. For a transaction to be considered final, it has to be posted to the L1. Forced txs can be delayed up to ${formatSeconds(
              selfSequencingDelaySeconds,
            )}. The state root gets finalized ${formatSeconds(
              challengePeriodSeconds,
            )} after it has been posted.`,
          }),
    },
    stage:
      templateVars.stage ??
      (postsToExternalDA
        ? {
            stage: 'NotApplicable',
          }
        : getStage(
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
          )),
    dataAvailability: postsToExternalDA
      ? (() => {
          if (isUsingValidBlobstreamWmr) {
            return {
              layer: DA_LAYERS.CELESTIA,
              bridge: DA_BRIDGES.BLOBSTREAM,
              mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
            }
          } else {
            const DAC = templateVars.discovery.getContractValue<{
              membersCount: number
              requiredSignatures: number
            }>('SequencerInbox', 'dacKeyset')
            const { membersCount, requiredSignatures } = DAC

            return {
              layer: DA_LAYERS.DAC,
              bridge: DA_BRIDGES.DAC_MEMBERS({
                membersCount,
                requiredSignatures,
              }),
              mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
            }
          }
        })()
      : {
          layer: usesBlobs
            ? DA_LAYERS.ETH_BLOBS_OR_CALLDATA
            : DA_LAYERS.ETH_CALLDATA,
          bridge: DA_BRIDGES.ENSHRINED,
          mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
        },
    riskView: {
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
        (templateVars.nonTemplateRiskView?.dataAvailability ??
        postsToExternalDA)
          ? (() => {
              if (isUsingValidBlobstreamWmr) {
                return RISK_VIEW.DATA_CELESTIA(true)
              } else {
                const DAC = templateVars.discovery.getContractValue<{
                  membersCount: number
                  requiredSignatures: number
                }>('SequencerInbox', 'dacKeyset')
                const { membersCount, requiredSignatures } = DAC
                return RISK_VIEW.DATA_EXTERNAL_DAC({
                  membersCount,
                  requiredSignatures,
                })
              }
            })()
          : RISK_VIEW.DATA_ON_CHAIN,
      exitWindow:
        templateVars.nonTemplateRiskView?.exitWindow ??
        (isUsingValidBlobstreamWmr
          ? pickWorseRisk(
              RISK_VIEW.EXIT_WINDOW(0, selfSequencingDelaySeconds),
              RISK_VIEW.EXIT_WINDOW(0, BLOBSTREAM_DELAY_SECONDS),
            )
          : RISK_VIEW.EXIT_WINDOW(0, selfSequencingDelaySeconds)),
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
          const validatorAfkTimeSeconds = validatorAfkBlocks * assumedBlockTime

          return {
            ...RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(
              challengePeriodSeconds + validatorAfkTimeSeconds,
            ), // see `_validatorIsAfk()` https://basescan.org/address/0xB7202d306936B79Ba29907b391faA87D3BEec33A#code#F1#L50
            secondLine: formatDelay(
              challengePeriodSeconds + validatorAfkTimeSeconds,
            ),
          }
        })(),
    },
    config: {
      associatedTokens: templateVars.associatedTokens,
      escrows: templateVars.overrideEscrows ?? [
        templateVars.discovery.getEscrowDetails({
          address: templateVars.bridge.address,
          tokens: templateVars.gasTokens ?? ['ETH'],
          description: templateVars.gasTokens
            ? `Contract managing Inboxes and Outboxes. It escrows ${templateVars.gasTokens.join(', ')} sent to L2.`
            : `Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.`,
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
              adjustCount: { type: 'SubtractOne' },
            }
          : undefined),
      daTracking: getDaTracking(templateVars),
      trackedTxs: templateVars.trackedTxs,
      finality: templateVars.finality,
    },
  }
}
