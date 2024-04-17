import { ContractParameters } from '@l2beat/discovery-types'
import { assert, ProjectId } from '@l2beat/shared-pure'

import {
  addSentimentToDataAvailability,
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  KnowledgeNugget,
  makeBridgeCompatible,
  Milestone,
  OPERATOR,
  RISK_VIEW,
  ScalingProjectContract,
  ScalingProjectEscrow,
  ScalingProjectPermission,
  ScalingProjectTechnology,
  ScalingProjectTransactionApi,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { subtractOne } from '../../common/assessCount'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { VALUES } from '../../discovery/values'
import { Layer3, Layer3Display } from '../../layer3s/types'
import { getStage } from '../common/stages/getStage'
import { Layer2, Layer2Display, Layer2TxConfig } from '../types'

const ETHEREUM_EXPLORER_URL = 'https://etherscan.io/address/{0}#code'

export interface OrbitStackConfigCommon {
  discovery: ProjectDiscovery
  associatedTokens?: string[]
  isNodeAvailable?: boolean | 'UnderReview'
  nonTemplateEscrows?: ScalingProjectEscrow[]
  bridge: ContractParameters
  rollupProxy: ContractParameters
  sequencerInbox: ContractParameters
  nonTemplatePermissions?: ScalingProjectPermission[]
  nonTemplateTechnology?: Partial<ScalingProjectTechnology>
  nonTemplateContracts?: ScalingProjectContract[]
  rpcUrl?: string
  transactionApi?: ScalingProjectTransactionApi
  milestones?: Milestone[]
  knowledgeNuggets?: KnowledgeNugget[]
  trackedTxs?: Layer2TxConfig[]
  postsBlobs?: boolean
}

export interface OrbitStackConfigL3 extends OrbitStackConfigCommon {
  display: Omit<Layer3Display, 'provider' | 'category' | 'dataAvailabilityMode'>
  hostChain: ProjectId
  nativeToken?: string
}

export interface OrbitStackConfigL2 extends OrbitStackConfigCommon {
  display: Omit<Layer2Display, 'provider' | 'category' | 'dataAvailabilityMode'>
  nativeToken?: string
}

export function orbitStackCommon(
  templateVars: OrbitStackConfigCommon,
  explorerLinkFormat: string,
): Omit<
  Layer2,
  | 'type'
  | 'display'
  | 'config'
  | 'isArchived'
  | 'stage'
  | 'chainConfig'
  | 'riskView'
> {
  const validatorAfkBlocks = templateVars.discovery.getContractValue<number>(
    'RollupProxy',
    'VALIDATOR_AFK_BLOCKS',
  )

  const sequencerVersion = templateVars.discovery.getContractValue<string>(
    'SequencerInbox',
    'sequencerVersion',
  )
  const postsToExternalDA = sequencerVersion !== '0x00'

  return {
    id: ProjectId(templateVars.discovery.projectName),
    contracts: {
      addresses: [
        ...templateVars.discovery.getOrbitStackContractDetails(),
        ...(templateVars.nonTemplateContracts ?? []),
      ],
      risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    },
    technology: {
      stateCorrectness: templateVars.nonTemplateTechnology
        ?.stateCorrectness ?? {
        name: 'Fraud proofs ensure state correctness',
        description:
          'After some period of time, the published state root is assumed to be correct. For a certain time period, one of the whitelisted actors can submit a fraud proof that shows that the state was incorrect. The challenge protocol can be subject to delay attacks.',
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
            href: 'https://developer.offchainlabs.com/intro/#q-and-how-exactly-is-fraud-proven-sounds-complicated',
          },
          {
            text: 'Arbitrum Glossary: Challenge Period',
            href: 'https://developer.arbitrum.io/intro/glossary#challenge-period',
          },
          {
            text: 'RollupUser.sol - Etherscan source code, onlyValidator modifier',
            href: getCodeLink(templateVars.rollupProxy, explorerLinkFormat, 1), // TODO
          },
          {
            text: 'Solutions to Delay Attacks on Rollups',
            href: 'https://medium.com/offchainlabs/solutions-to-delay-attacks-on-rollups-434f9d05a07a',
          },
        ],
      },
      dataAvailability:
        templateVars.nonTemplateTechnology?.dataAvailability ??
        postsToExternalDA
          ? (() => {
              const DAC = templateVars.discovery.getContractValue<{
                membersCount: number
                requiredSignatures: number
              }>('SequencerInbox', 'dacKeyset')
              const { membersCount, requiredSignatures } = DAC

              return TECHNOLOGY_DATA_AVAILABILITY.ANYTRUST_OFF_CHAIN({
                membersCount,
                requiredSignatures,
              })
            })()
          : {
              ...(templateVars.postsBlobs
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
            href: 'https://developer.offchainlabs.com/sequencer',
          },
        ],
      },
      forceTransactions: templateVars.nonTemplateTechnology
        ?.forceTransactions ?? {
        ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
        description:
          FORCE_TRANSACTIONS.CANONICAL_ORDERING.description +
          ' ' +
          VALUES.ARBITRUM.getProposerFailureString(validatorAfkBlocks),
        references: [
          {
            text: 'SequencerInbox.sol - Etherscan source code, forceInclusion function',
            href: getCodeLink(templateVars.sequencerInbox, explorerLinkFormat),
          },
          {
            text: 'Sequencer Isn’t Doing Its Job - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/sequencer#unhappyuncommon-case-sequencer-isnt-doing-its-job',
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
      otherConsiderations: templateVars.nonTemplateTechnology
        ?.otherConsiderations ?? [
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
      ],
    },
    permissions: [
      ...templateVars.discovery.getOrbitStackPermissions({
        'validators.0': 'Validators/Proposers',
        'batchPosters.0': 'Sequencers',
      }),
      ...(templateVars.nonTemplatePermissions ?? []),
    ],
    milestones: templateVars.milestones,
    knowledgeNuggets: templateVars.knowledgeNuggets,
  }
}

export function orbitStackL3(templateVars: OrbitStackConfigL3): Layer3 {
  const assumedBlockTime = 12 // seconds, different from RollupUserLogic.sol#L35 which assumes 13.2 seconds

  const validatorAfkBlocks = templateVars.discovery.getContractValue<number>(
    'RollupProxy',
    'VALIDATOR_AFK_BLOCKS',
  )
  const validatorAfkTime = validatorAfkBlocks * assumedBlockTime

  const maxTimeVariation = templateVars.discovery.getContractValue<number[]>(
    'SequencerInbox',
    'maxTimeVariation',
  )
  const selfSequencingDelay = maxTimeVariation[2]

  const sequencerVersion = templateVars.discovery.getContractValue<string>(
    'SequencerInbox',
    'sequencerVersion',
  )
  const postsToExternalDA = sequencerVersion !== '0x00'

  const nOfChallengers = templateVars.discovery.getContractValue<string[]>(
    'RollupProxy',
    'validators',
  ).length

  return {
    type: 'layer3',
    ...orbitStackCommon(
      templateVars,
      getExplorerLinkFormat(templateVars.hostChain),
    ),
    hostChain: templateVars.hostChain,
    display: {
      ...templateVars.display,
      warning:
        'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
      provider: 'Arbitrum',
      category: postsToExternalDA ? 'Optimium' : 'Optimistic Rollup',
    },
    riskView: makeBridgeCompatible({
      stateValidation: RISK_VIEW.STATE_ARBITRUM_FRAUD_PROOFS(nOfChallengers),
      dataAvailability: postsToExternalDA
        ? (() => {
            const DAC = templateVars.discovery.getContractValue<{
              membersCount: number
              requiredSignatures: number
            }>('SequencerInbox', 'dacKeyset')
            const { membersCount, requiredSignatures } = DAC
            return RISK_VIEW.DATA_EXTERNAL_DAC({
              membersCount,
              requiredSignatures,
            })
          })()
        : RISK_VIEW.DATA_ON_CHAIN_L2,
      exitWindow: RISK_VIEW.EXIT_WINDOW(0, selfSequencingDelay),
      sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(selfSequencingDelay),
      proposerFailure:
        RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(validatorAfkTime),
      validatedBy: RISK_VIEW.VALIDATED_BY_L2(templateVars.hostChain),
      destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    }),
    config: {
      associatedTokens: templateVars.associatedTokens,
      escrows: [
        templateVars.discovery.getEscrowDetails({
          address: templateVars.bridge.address,
          tokens: templateVars.nativeToken
            ? [templateVars.nativeToken]
            : ['ETH'],
          description: templateVars.nativeToken
            ? `Contract managing Inboxes and Outboxes. It escrows ${templateVars.nativeToken} sent to L2.`
            : `Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.`,
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
    milestones: [],
    knowledgeNuggets: [],
  }
}

export function orbitStackL2(templateVars: OrbitStackConfigL2): Layer2 {
  const assumedBlockTime = 12 // seconds, different from RollupUserLogic.sol#L35 which assumes 13.2 seconds
  const challengeWindow = templateVars.discovery.getContractValue<number>(
    'RollupProxy',
    'confirmPeriodBlocks',
  )
  const challengeWindowSeconds = challengeWindow * assumedBlockTime

  const validatorAfkBlocks = templateVars.discovery.getContractValue<number>(
    'RollupProxy',
    'VALIDATOR_AFK_BLOCKS',
  )
  const validatorAfkTime = validatorAfkBlocks * assumedBlockTime

  const maxTimeVariation = templateVars.discovery.getContractValue<number[]>(
    'SequencerInbox',
    'maxTimeVariation',
  )
  const selfSequencingDelay = maxTimeVariation[2]

  const sequencerVersion = templateVars.discovery.getContractValue<string>(
    'SequencerInbox',
    'sequencerVersion',
  )
  const postsToExternalDA = sequencerVersion !== '0x00'

  const nOfChallengers = templateVars.discovery.getContractValue<string[]>(
    'RollupProxy',
    'validators',
  ).length

  return {
    type: 'layer2',
    ...orbitStackCommon(templateVars, ETHEREUM_EXPLORER_URL),
    display: {
      warning:
        'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
      ...templateVars.display,
      provider: 'Arbitrum',
      category: postsToExternalDA ? 'Optimium' : 'Optimistic Rollup',
      finality: {
        finalizationPeriod: challengeWindowSeconds,
      },
    },
    stage: postsToExternalDA
      ? {
          stage: 'NotApplicable',
        }
      : getStage({
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
        }),
    dataAvailability: postsToExternalDA
      ? (() => {
          const DAC = templateVars.discovery.getContractValue<{
            membersCount: number
            requiredSignatures: number
          }>('SequencerInbox', 'dacKeyset')
          const { membersCount, requiredSignatures } = DAC

          return addSentimentToDataAvailability({
            layers: ['DAC'],
            bridge: { type: 'DAC Members', membersCount, requiredSignatures },
            mode: 'Transactions data (compressed)',
          })
        })()
      : addSentimentToDataAvailability({
          layers: [
            templateVars.postsBlobs
              ? 'Ethereum (blobs or calldata)'
              : 'Ethereum (calldata)',
          ],
          bridge: { type: 'Enshrined' },
          mode: 'Transactions data (compressed)',
        }),
    riskView: makeBridgeCompatible({
      stateValidation: RISK_VIEW.STATE_ARBITRUM_FRAUD_PROOFS(nOfChallengers),
      dataAvailability: postsToExternalDA
        ? (() => {
            const DAC = templateVars.discovery.getContractValue<{
              membersCount: number
              requiredSignatures: number
            }>('SequencerInbox', 'dacKeyset')
            const { membersCount, requiredSignatures } = DAC
            return RISK_VIEW.DATA_EXTERNAL_DAC({
              membersCount,
              requiredSignatures,
            })
          })()
        : RISK_VIEW.DATA_ON_CHAIN_L2,
      exitWindow: RISK_VIEW.EXIT_WINDOW(0, selfSequencingDelay),
      sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(selfSequencingDelay),
      proposerFailure:
        RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(validatorAfkTime),
      validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
      destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    }),
    config: {
      associatedTokens: templateVars.associatedTokens,
      escrows: [
        templateVars.discovery.getEscrowDetails({
          address: templateVars.bridge.address,
          tokens: templateVars.nativeToken
            ? [templateVars.nativeToken]
            : ['ETH'],
          description: templateVars.nativeToken
            ? `Contract managing Inboxes and Outboxes. It escrows ${templateVars.nativeToken} sent to L2.`
            : `Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.`,
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
      finality: 'coming soon',
    },
  }
}

function getExplorerLinkFormat(hostChain: ProjectId): string {
  if (hostChain === ProjectId('ethereum')) {
    return ETHEREUM_EXPLORER_URL
  } else if (hostChain === ProjectId('arbitrum')) {
    return 'https://arbiscan.io/address/{0}#code'
  } else if (hostChain === ProjectId('base')) {
    return 'https://explorer.degen.tips/address/{0}?tab=contract'
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
  const implementation = contract.implementations?.[implementationIndex ?? 0]
  if (!implementation) {
    throw new Error(`No implementation found for ${contract.name}`)
  }
  return implementation.toString()
}
