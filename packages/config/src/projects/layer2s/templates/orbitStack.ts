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
import { utils } from 'ethers'

import { unionBy } from 'lodash'
import {
  CONTRACTS,
  ChainConfig,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  KnowledgeNugget,
  Milestone,
  OPERATOR,
  RISK_VIEW,
  ScalingProjectContract,
  ScalingProjectEscrow,
  ScalingProjectPermission,
  ScalingProjectPurpose,
  ScalingProjectRisk,
  ScalingProjectRiskView,
  ScalingProjectStateDerivation,
  ScalingProjectStateValidation,
  ScalingProjectStateValidationCategory,
  ScalingProjectTechnology,
  ScalingProjectTechnologyChoice,
  ScalingProjectTransactionApi,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
  pickWorseRisk,
  sumRisk,
} from '../../../common'
import { subtractOne } from '../../../common/assessCount'
import {
  formatChallengePeriod,
  formatDelay,
} from '../../../common/formatDelays'
import { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import { Badge, BadgeId, badges } from '../../badges'
import { Layer3, Layer3Display } from '../../layer3s/types'
import { StageConfig } from '../common'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from '../common/liveness'
import { getStage } from '../common/stages/getStage'
import {
  Layer2,
  Layer2Display,
  Layer2FinalityConfig,
  Layer2TxConfig,
} from '../types'
import { generateDiscoveryDrivenSections } from './generateDiscoveryDrivenSections'
import { mergeBadges } from './utils'

const ETHEREUM_EXPLORER_URL = 'https://etherscan.io/address/{0}#code'
const EVM_OTHER_CONSIDERATIONS: ScalingProjectTechnologyChoice[] = [
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
        text: 'Inside Arbitrum Nitro',
        href: 'https://developer.offchainlabs.com/inside-arbitrum-nitro/',
      },
    ],
  },
]

export const WASMVM_OTHER_CONSIDERATIONS: ScalingProjectTechnologyChoice[] = [
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
        text: 'Inside Arbitrum Nitro',
        href: 'https://developer.offchainlabs.com/inside-arbitrum-nitro/',
      },
      {
        text: 'A gentle introduction: Stylus',
        href: 'https://docs.arbitrum.io/stylus/stylus-gentle-introduction',
      },
    ],
  },
]

interface OrbitStackConfigCommon {
  createdAt: UnixTime
  discovery: ProjectDiscovery
  additionalDiscoveries?: { [chain: string]: ProjectDiscovery }
  stateValidationImage?: string
  associatedTokens?: string[]
  isNodeAvailable?: boolean | 'UnderReview'
  nodeSourceLink?: string
  nonTemplateEscrows?: ScalingProjectEscrow[]
  overrideEscrows?: ScalingProjectEscrow[]
  upgradeability?: {
    upgradableBy: string[] | undefined
    upgradeDelay: string | undefined
  }
  bridge: ContractParameters
  blockNumberOpcodeTimeSeconds?: number
  finality?: Layer2FinalityConfig
  rollupProxy: ContractParameters
  sequencerInbox: ContractParameters
  nonTemplatePermissions?: ScalingProjectPermission[]
  nonTemplateTechnology?: Partial<ScalingProjectTechnology>
  additiveConsiderations?: ScalingProjectTechnologyChoice[]
  nonTemplateContracts?: ScalingProjectContract[]
  nonTemplateRiskView?: Partial<ScalingProjectRiskView>
  rpcUrl?: string
  transactionApi?: ScalingProjectTransactionApi
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
  nativeAddresses?: Record<string, ScalingProjectContract[]>
  nativePermissions?: Record<string, ScalingProjectPermission[]> | 'UnderReview'
  additionalPurposes?: ScalingProjectPurpose[]
  discoveryDrivenData?: boolean
  isArchived?: boolean
  gasTokens?: string[]
}

export interface OrbitStackConfigL3 extends OrbitStackConfigCommon {
  display: Omit<Layer3Display, 'provider' | 'category' | 'purposes'> & {
    category?: Layer3Display['category']
  }
  stackedRiskView?: Partial<ScalingProjectRiskView>
  hostChain: ProjectId
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
  the Security Council smart contracts on all three chains. Although these multisigs are technically separate and connect to different target permissions, 
  their member- and threshold configuration is kept in sync by a manager contract on Arbitrum One and crosschain transactions.
  
  
  Regular upgrades, Admin- and Owner actions originate from either the Arbitrum DAO or the non-emergency (proposer-) Security Council on Arbitrum One 
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
  and even cancelled by the Emergency Security Council. Finally, the transaction can be executed, calling Admin- or Owner functions of the respective destination smart contracts 
  through the UpgradeExecutor on Ethereum. If the predefined  transaction destination is Arbitrum One or -Nova, this last call is executed on L2 through the canonical bridge and the aliased address of the L1 Timelock.
  
  
  Operator roles like the Sequencers and Validators are managed using the same paths. 
  Sequencer changes can be delegated to a Batch Poster Manager.
  
  
  Transactions targeting the Arbitrum DAO Treasury can be scheduled in the ${formatSeconds(
    treasuryTimelockDelay,
  )} 
  Treasury Timelock by meeting a TreasuryGovernor-enforced ${l2TreasuryQuorumPercent}% threshold of votable ARB tokens. The Security Council cannot regularly cancel 
  these transactions or schedule different ones but can overwrite them anyway by having full admin upgrade permissions for all the underlying smart contracts.`
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
          text: 'How is fraud proven - Arbitrum documentation FAQ',
          href: 'https://docs.arbitrum.io/welcome/arbitrum-gentle-introduction#q-and-how-exactly-is-fraud-proven-sounds-complicated',
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
          text: 'Fraud Proof Wars: Arbitrum Classic',
          href: 'https://medium.com/l2beat/fraud-proof-wars-b0cb4d0f452a',
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
          text: 'Fast withdrawals for AnyTrust chains - Arbitrum documentation',
          href: 'https://docs.arbitrum.io/launch-orbit-chain/how-tos/fast-withdrawals#fast-withdrawals-for-anytrust-chains',
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

function orbitStackCommon(
  templateVars: OrbitStackConfigCommon,
  explorerLinkFormat: string,
  blockNumberOpcodeTimeSeconds: number,
): Omit<Layer2, 'type' | 'display' | 'config' | 'stage' | 'riskView'> {
  const nativeContractRisks = templateVars.nonTemplateContractRisks ?? [
    CONTRACTS.UPGRADE_NO_DELAY_RISK,
  ]

  const discoveryDrivenSections = templateVars.discoveryDrivenData
    ? generateDiscoveryDrivenSections(
        templateVars.discovery,
        nativeContractRisks,
        templateVars.additionalDiscoveries,
      )
    : undefined

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
  const currentRequiredStake = templateVars.discovery.getContractValue<number>(
    'RollupProxy',
    'currentRequiredStake',
  )
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

  const validators: ScalingProjectPermission = {
    name: 'Validators/Proposers',
    accounts: templateVars.discovery.getPermissionsByRole('validate'), // Validators in Arbitrum are proposers and challengers
    description:
      'They can submit new state roots and challenge state roots. Some of the operators perform their duties through special purpose smart contracts.',
    chain: templateVars.discovery.chain,
  }
  if (validators.accounts.length === 0) {
    throw new Error(
      `No validators found for ${templateVars.discovery.projectName}. Assign 'Validator' role to at least one account.`,
    )
  }

  const sequencers: ScalingProjectPermission = {
    name: 'Sequencers',
    accounts: templateVars.discovery.getPermissionsByRole('sequence'),
    description: 'Central actors allowed to submit transaction batches to L1.',
    chain: templateVars.discovery.chain,
  }
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

  return {
    id: ProjectId(templateVars.discovery.projectName),
    createdAt: templateVars.createdAt,
    isArchived: templateVars.isArchived ?? undefined,
    contracts: discoveryDrivenSections
      ? discoveryDrivenSections.contracts
      : {
          addresses: unionBy(
            [
              ...(templateVars.nonTemplateContracts ?? []),
              ...templateVars.discovery.resolveOrbitStackTemplates().contracts,
            ],
            'address',
          ),
          nativeAddresses: templateVars.nativeAddresses,
          risks: nativeContractRisks,
        },
    chainConfig: templateVars.chainConfig,
    technology: {
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
                  text: 'Sequencing followed by deterministic execution - Arbitrum documentation',
                  href: 'https://developer.offchainlabs.com/inside-arbitrum-nitro/#sequencing-followed-by-deterministic-execution',
                },
                {
                  text: 'SequencerInbox.sol - Etherscan source code, addSequencerL2BatchFromOrigin function',
                  href: getCodeLink(
                    templateVars.sequencerInbox,
                    explorerLinkFormat,
                  ),
                },
              ],
            },
      operator: templateVars.nonTemplateTechnology?.operator ?? {
        ...OPERATOR.CENTRALIZED_SEQUENCER,
        references: [
          {
            text: 'Sequencer - Arbitrum documentation',
            href: 'https://docs.arbitrum.io/how-arbitrum-works/inside-arbitrum-nitro#the-sequencer',
          },
        ],
      },
      forceTransactions: templateVars.nonTemplateTechnology
        ?.forceTransactions ?? {
        ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
        description:
          FORCE_TRANSACTIONS.CANONICAL_ORDERING.description +
          ` After a delay of ${formatSeconds(
            selfSequencingDelaySeconds,
          )} in which a Sequencer has failed to include a transaction that was directly posted to the smart contract, it can be forcefully included by anyone on the host chain, which finalizes its ordering.`,
        references: [
          {
            text: 'SequencerInbox.sol - Etherscan source code, forceInclusion function',
            href: getCodeLink(templateVars.sequencerInbox, explorerLinkFormat),
          },
          {
            text: 'Sequencer Isn’t Doing Its Job - Arbitrum documentation',
            href: 'https://docs.arbitrum.io/how-arbitrum-works/sequencer#unhappyuncommon-case-sequencer-isnt-doing-its-job',
          },
        ],
      },
      exitMechanisms: templateVars.nonTemplateTechnology?.exitMechanisms ?? [
        {
          ...EXITS.REGULAR('optimistic', 'merkle proof'),
          references: [
            {
              text: 'Transaction lifecycle - Arbitrum documentation',
              href: 'https://developer.offchainlabs.com/tx-lifecycle',
            },
            {
              text: 'L2 to L1 Messages - Arbitrum documentation',
              href: 'https://developer.offchainlabs.com/arbos/l2-to-l1-messaging',
            },
            {
              text: 'Mainnet for everyone - Arbitrum Blog',
              href: 'https://offchain.medium.com/mainnet-for-everyone-27ce0f67c85e',
            },
          ],
          risks: [],
        },
        {
          name: 'Tradeable Bridge Exit',
          description:
            "When a user initiates a regular withdrawal a third party verifying the chain can offer to buy this withdrawal by paying the user on L1. The user will get the funds immediately, however the third party has to wait for the block to be finalized. This is implemented as a first party functionality inside Arbitrum's token bridge.",
          risks: [],
          references: [
            {
              text: 'Tradeable Bridge Exits - Arbitrum documentation',
              href: 'https://developer.offchainlabs.com/docs/withdrawals#tradeable-bridge-exits',
            },
          ],
        },
        EXITS.AUTONOMOUS,
      ],
      otherConsiderations:
        templateVars.nonTemplateTechnology?.otherConsiderations ??
        EVM_OTHER_CONSIDERATIONS,
    },
    permissions: discoveryDrivenSections
      ? discoveryDrivenSections.permissions
      : [
          sequencers,
          validators,
          ...templateVars.discovery.resolveOrbitStackTemplates().permissions,
          ...(templateVars.nonTemplatePermissions ?? []),
        ],
    nativePermissions: discoveryDrivenSections
      ? discoveryDrivenSections.nativePermissions
      : templateVars.nativePermissions,
    stateDerivation: templateVars.stateDerivation,
    stateValidation:
      templateVars.stateValidation ??
      defaultStateValidation(
        minimumAssertionPeriod,
        currentRequiredStake,
        challengePeriodSeconds,
        existFastConfirmer,
      ),
    upgradesAndGovernance: templateVars.upgradesAndGovernance,
    milestones: templateVars.milestones,
    knowledgeNuggets: templateVars.knowledgeNuggets,
    badges: mergeBadges(
      [Badge.Stack.Orbit, Badge.VM.EVM, daBadge],
      templateVars.additionalBadges ?? [],
    ),
    discoveryDrivenData: templateVars.discoveryDrivenData,
  }
}

export function orbitStackL3(templateVars: OrbitStackConfigL3): Layer3 {
  const layer2s = require('..').layer2s as Layer2[]

  const baseChain = layer2s.find((l2) => l2.id === templateVars.hostChain)
  assert(
    baseChain,
    `Could not find base chain ${templateVars.hostChain} in layer2s`,
  )

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
    upgradableBy: ['ProxyAdmin'],
    upgradeDelay: 'No delay',
  }

  const wasmModuleRoot = templateVars.discovery.getContractValue<string>(
    'RollupProxy',
    'wasmModuleRoot',
  )
  const isUsingValidBlobstreamWmr =
    wmrValidForBlobstream.includes(wasmModuleRoot)

  const riskView = {
    stateValidation: templateVars.nonTemplateRiskView?.stateValidation ?? {
      ...RISK_VIEW.STATE_ARBITRUM_FRAUD_PROOFS(
        nOfChallengers,
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
      RISK_VIEW.EXIT_WINDOW(0, selfSequencingDelaySeconds),
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

  const architectureImage = existFastConfirmer
    ? 'orbit-optimium-fastconfirm'
    : postsToExternalDA
      ? 'orbit-optimium'
      : 'orbit-rollup'

  return {
    type: 'layer3',
    ...orbitStackCommon(
      templateVars,
      getExplorerLinkFormat(templateVars.hostChain),
      blockNumberOpcodeTimeSeconds,
    ),
    hostChain: templateVars.hostChain,
    display: {
      architectureImage,
      stateValidationImage: 'orbit',
      purposes: ['Universal', ...(templateVars.additionalPurposes ?? [])],
      ...templateVars.display,
      warning:
        'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
      provider: 'Arbitrum',
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
      ? [
          (() => {
            if (isUsingValidBlobstreamWmr) {
              return addSentimentToDataAvailability({
                layers: [DA_LAYERS.CELESTIA],
                bridge: DA_BRIDGES.BLOBSTREAM,
                mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
              })
            } else {
              const DAC = templateVars.discovery.getContractValue<{
                membersCount: number
                requiredSignatures: number
              }>('SequencerInbox', 'dacKeyset')
              const { membersCount, requiredSignatures } = DAC

              return addSentimentToDataAvailability({
                layers: [DA_LAYERS.DAC],
                bridge: DA_BRIDGES.DAC_MEMBERS({
                  membersCount,
                  requiredSignatures,
                }),
                mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
              })
            }
          })(),
        ]
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
              assessCount: subtractOne,
            }
          : undefined),
    },
    milestones: [],
    knowledgeNuggets: [],
  }
}

export function orbitStackL2(templateVars: OrbitStackConfigL2): Layer2 {
  const assumedBlockTime = 12 // seconds, different from RollupUserLogic.sol#L35 which assumes 13.2 seconds

  const challengePeriodBlocks = templateVars.discovery.getContractValue<number>(
    'RollupProxy',
    'confirmPeriodBlocks',
  )
  const challengePeriodSeconds = challengePeriodBlocks * assumedBlockTime

  const validatorAfkBlocks = templateVars.discovery.getContractValue<number>(
    'RollupProxy',
    'VALIDATOR_AFK_BLOCKS',
  )
  const validatorAfkTimeSeconds = validatorAfkBlocks * assumedBlockTime

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
    upgradableBy: ['ProxyAdmin'],
    upgradeDelay: 'No delay',
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

  const architectureImage = existFastConfirmer
    ? 'orbit-optimium-fastconfirm'
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

  const wasmModuleRoot = templateVars.discovery.getContractValue<string>(
    'RollupProxy',
    'wasmModuleRoot',
  )
  const isUsingValidBlobstreamWmr =
    wmrValidForBlobstream.includes(wasmModuleRoot)

  return {
    type: 'layer2',
    ...orbitStackCommon(templateVars, ETHEREUM_EXPLORER_URL, 12),
    display: {
      architectureImage,
      stateValidationImage: 'orbit',
      purposes: ['Universal', ...(templateVars.additionalPurposes ?? [])],
      warning:
        'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
      ...templateVars.display,
      provider: 'Arbitrum',
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
    dataAvailability: [
      postsToExternalDA
        ? (() => {
            if (isUsingValidBlobstreamWmr) {
              return addSentimentToDataAvailability({
                layers: [DA_LAYERS.CELESTIA],
                bridge: DA_BRIDGES.BLOBSTREAM,
                mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
              })
            } else {
              const DAC = templateVars.discovery.getContractValue<{
                membersCount: number
                requiredSignatures: number
              }>('SequencerInbox', 'dacKeyset')
              const { membersCount, requiredSignatures } = DAC

              return addSentimentToDataAvailability({
                layers: [DA_LAYERS.DAC],
                bridge: DA_BRIDGES.DAC_MEMBERS({
                  membersCount,
                  requiredSignatures,
                }),
                mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
              })
            }
          })()
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
      stateValidation: templateVars.nonTemplateRiskView?.stateValidation ?? {
        ...RISK_VIEW.STATE_ARBITRUM_FRAUD_PROOFS(
          nOfChallengers,
          challengePeriodSeconds,
        ),
        secondLine: formatChallengePeriod(challengePeriodSeconds),
      },
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
        RISK_VIEW.EXIT_WINDOW(0, selfSequencingDelaySeconds),
      sequencerFailure: templateVars.nonTemplateRiskView?.sequencerFailure ?? {
        ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(selfSequencingDelaySeconds),
        secondLine: formatDelay(selfSequencingDelaySeconds),
      },
      proposerFailure: templateVars.nonTemplateRiskView?.proposerFailure ?? {
        ...RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(
          challengePeriodSeconds + validatorAfkTimeSeconds,
        ), // see `_validatorIsAfk()` https://basescan.org/address/0xB7202d306936B79Ba29907b391faA87D3BEec33A#code#F1#L50
        secondLine: formatDelay(
          challengePeriodSeconds + validatorAfkTimeSeconds,
        ),
      },
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
              assessCount: subtractOne,
            }
          : undefined),
      trackedTxs: templateVars.trackedTxs,
      finality: templateVars.finality,
    },
  }
}

function getExplorerLinkFormat(hostChain: ProjectId): string {
  if (hostChain === ProjectId('ethereum')) {
    return ETHEREUM_EXPLORER_URL
  } else if (hostChain === ProjectId('arbitrum')) {
    return 'https://arbiscan.io/address/{0}#code'
  } else if (hostChain === ProjectId('base')) {
    return 'https://basescan.org/address/{0}#code'
  } else if (hostChain === ProjectId('nova')) {
    return 'https://nova.arbiscan.io/address/{0}#code'
  }

  assert(false, `Host chain ${hostChain.toString()} is not supported`)
}

function getCodeLink(
  contract: ContractParameters,
  explorerUrlFormat: string,
  implementationIndex?: number,
): string {
  return explorerUrlFormat.replace(
    '{0}',
    safeGetImplementation(contract, implementationIndex),
  )
}

function safeGetImplementation(
  contract: ContractParameters,
  implementationIndex?: number,
): string {
  const implementation = get$Implementations(contract.values)[
    implementationIndex ?? 0
  ]
  if (!implementation) {
    throw new Error(`No implementation found for ${contract.name}`)
  }
  return implementation.toString()
}
