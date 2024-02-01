import { ContractParameters } from '@l2beat/discovery-types'
import { assert, ProjectId } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  KnowledgeNugget,
  makeBridgeCompatible,
  Milestone,
  OPERATOR,
  RISK_VIEW,
  ScalingProjectEscrow,
  ScalingProjectPermission,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { VALUES } from '../../discovery/values'
import { Layer3, Layer3Display } from '../../layer3s/types'
import { getStage } from '../common/stages/getStage'
import { Layer2, Layer2Display } from '../types'

const ETHEREUM_EXPLORER_URL = 'https://etherscan.io/address/{0}#code'

export interface OrbitStackConfigCommon {
  discovery: ProjectDiscovery
  associatedTokens?: string[]

  nonTemplateEscrows?: ScalingProjectEscrow[]
  bridge: ContractParameters
  rollupProxy: ContractParameters
  sequencerInbox: ContractParameters
  nonTemplatePermissions?: ScalingProjectPermission[]

  milestones?: Milestone[]
  knowledgeNuggets?: KnowledgeNugget[]
}

export interface OrbitStackConfigL3 extends OrbitStackConfigCommon {
  display: Omit<Layer3Display, 'provider' | 'category' | 'dataAvailabilityMode'>
  hostChain: ProjectId
}

export interface OrbitStackConfigL2 extends OrbitStackConfigCommon {
  display: Omit<Layer2Display, 'provider' | 'category' | 'dataAvailabilityMode'>
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
      addresses: [...templateVars.discovery.getOrbitStackContractDetails()],
      risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    },
    technology: {
      stateCorrectness: {
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
      dataAvailability: postsToExternalDA
        ? (() => {
            const DAC = templateVars.discovery.getContractValue<
              Record<string, number>
            >('SequencerInbox', 'dacKeyset')

            return DATA_AVAILABILITY.ANYTRUST_OFF_CHAIN(DAC)
          })()
        : {
            ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
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
      operator: {
        ...OPERATOR.CENTRALIZED_SEQUENCER,
        references: [
          {
            text: 'Sequencer - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/sequencer',
          },
        ],
      },
      forceTransactions: {
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
      exitMechanisms: [
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
      smartContracts: {
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
      provider: 'Arbitrum Orbit',
      category: postsToExternalDA ? 'Optimium' : 'Optimistic Rollup',
      dataAvailabilityMode: 'NotApplicable',
    },
    riskView: makeBridgeCompatible({
      stateValidation: RISK_VIEW.STATE_ARBITRUM_FRAUD_PROOFS(nOfChallengers),
      dataAvailability: postsToExternalDA
        ? RISK_VIEW.DATA_EXTERNAL_DAC
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
          tokens: ['ETH'],
          description:
            'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
        }),
        ...(templateVars.nonTemplateEscrows ?? []),
      ],
    },
    milestones: [],
    knowledgeNuggets: [],
  }
}

export function orbitStackL2(templateVars: OrbitStackConfigL2): Layer2 {
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
    type: 'layer2',
    ...orbitStackCommon(templateVars, ETHEREUM_EXPLORER_URL),
    display: {
      ...templateVars.display,
      provider: 'Arbitrum',
      category: postsToExternalDA ? 'Optimium' : 'Optimistic Rollup',
      dataAvailabilityMode: postsToExternalDA ? 'NotApplicable' : 'TxData',
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
            rollupNodeSourceAvailable: 'UnderReview',
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
    riskView: makeBridgeCompatible({
      stateValidation: RISK_VIEW.STATE_ARBITRUM_FRAUD_PROOFS(nOfChallengers),
      dataAvailability: postsToExternalDA
        ? RISK_VIEW.DATA_EXTERNAL_DAC
        : RISK_VIEW.DATA_ON_CHAIN,
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
          tokens: ['ETH'],
          description:
            'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
        }),
        ...(templateVars.nonTemplateEscrows ?? []),
      ],
    },
  }
}

function getExplorerLinkFormat(hostChain: ProjectId): string {
  if (hostChain === ProjectId('ethereum')) {
    return ETHEREUM_EXPLORER_URL
  } else if (hostChain === ProjectId('arbitrum')) {
    return 'https://arbiscan.io/address/{0}#code'
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
