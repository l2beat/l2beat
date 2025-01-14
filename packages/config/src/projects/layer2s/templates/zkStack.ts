import { ContractParameters } from '@l2beat/discovery-types'
import {
  assert,
  ChainId,
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
  ScalingProjectTechnology,
  ScalingProjectTechnologyChoice,
  ScalingProjectTransactionApi,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
} from '../../../common'
import { ChainConfig } from '../../../common/ChainConfig'
import { formatExecutionDelay } from '../../../common/formatDelays'
import { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import { Badge, BadgeId, badges } from '../../badges'
import { PROOFS } from '../../zk-catalog/common/proofSystems'
import { getStage } from '../common/stages/getStage'
import { StageConfig } from '../common/stages/types'
import {
  type Layer2,
  type Layer2Display,
  Layer2FinalityConfig,
  Layer2TxConfig,
} from '../types'
import { mergeBadges } from './utils'

export interface DAProvider {
  layer: DataAvailabilityLayer
  fallback?: DataAvailabilityLayer
  riskView: ScalingProjectRiskViewEntry
  technology: ScalingProjectTechnologyChoice
  bridge: DataAvailabilityBridge
}

export interface ZkStackConfigCommon {
  createdAt: UnixTime
  discovery: ProjectDiscovery
  discovery_ZKstackGovL2: ProjectDiscovery
  validatorsEvents: {
    added: string
    removed: string
  }
  display: Omit<Layer2Display, 'provider' | 'category' | 'purposes'>
  daProvider?: DAProvider
  upgradeability?: {
    upgradableBy: string[] | undefined
    upgradeDelay: string | undefined
  }
  l1StandardBridgeEscrow?: EthereumAddress
  l1StandardBridgeTokens?: string[]
  l1StandardBridgePremintedTokens?: string[]
  diamondContract: ContractParameters
  rpcUrl?: string
  transactionApi?: ScalingProjectTransactionApi
  nonTemplateTrackedTxs?: Layer2TxConfig[]
  finality?: Layer2FinalityConfig
  l2OutputOracle?: ContractParameters
  portal?: ContractParameters
  milestones?: Milestone[]
  knowledgeNuggets?: KnowledgeNugget[]
  roleOverrides?: Record<string, string>
  nonTemplatePermissions?: ScalingProjectPermission[]
  nonTemplateContracts?: (upgrades: Upgradeability) => ScalingProjectContract[]
  nonTemplateEscrows?: (upgrades: Upgradeability) => ScalingProjectEscrow[]
  associatedTokens?: string[]
  isNodeAvailable?: boolean | 'UnderReview'
  nodeSourceLink?: string
  chainConfig?: ChainConfig
  usesBlobs?: boolean
  isUnderReview?: boolean
  stage?: StageConfig
  additionalBadges?: BadgeId[]
  useDiscoveryMetaOnly?: boolean
  additionalPurposes?: ScalingProjectPurpose[]
  gasTokens?: string[]
  nonTemplateRiskView?: Partial<ScalingProjectRiskView>
  nonTemplateTechnology?: Partial<ScalingProjectTechnology>
}

export type Upgradeability = {
  upgradeDelay?: string
  upgradableBy?: string[]
}

export function zkStackL2(templateVars: ZkStackConfigCommon): Layer2 {
  const { discovery, discovery_ZKstackGovL2 } = templateVars
  const daProvider = templateVars.daProvider
  if (daProvider) {
    assert(
      templateVars.additionalBadges?.find((b) => badges[b].type === 'DA') !==
        undefined,
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
  const protTlMinDelayS = discovery_ZKstackGovL2.getContractValue<number>(
    'ProtocolTimelockController',
    'getMinDelay',
  )
  const tokenTlMinDelayS = discovery_ZKstackGovL2.getContractValue<number>(
    'TokenTimelockController',
    'getMinDelay',
  )
  const govOpsTlMinDelayS = discovery_ZKstackGovL2.getContractValue<number>(
    'GovOpsTimelockController',
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
    'members',
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
    'members',
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
  const tokenStartProposalThresholdM =
    discovery_ZKstackGovL2.getContractValueBigInt(
      'ZkTokenGovernor',
      'proposalThreshold',
    ) / 1000000000000000000000000n // result: M of tokens
  const govOpsStartProposalThresholdM =
    discovery_ZKstackGovL2.getContractValueBigInt(
      'ZkGovOpsGovernor',
      'proposalThreshold',
    ) / 1000000000000000000000000n // result: M of tokens
  const protocolQuorumM =
    discovery_ZKstackGovL2.getContractValueBigInt(
      'ZkProtocolGovernor',
      'currentQuorum',
    ) / 1000000000000000000000000n // result: M of tokens
  const tokenQuorumM =
    discovery_ZKstackGovL2.getContractValueBigInt(
      'ZkProtocolGovernor',
      'currentQuorum',
    ) / 1000000000000000000000000n // result: M of tokens
  const govOpsQuorumM =
    discovery_ZKstackGovL2.getContractValueBigInt(
      'ZkProtocolGovernor',
      'currentQuorum',
    ) / 1000000000000000000000000n // result: M of tokens
  const scThresholdString = `${scMainThreshold} / ${scMemberCount}`
  const guardiansThresholdString = `${guardiansMainThreshold} / ${guardiansMemberCount}`

  const upgrades: Upgradeability = {
    upgradableBy: ['ProtocolUpgradeHandler'],
    upgradeDelay: `${formatSeconds(
      upgradeDelayWithScApprovalS,
    )} via the standard upgrade path, but immediate through the EmergencyUpgradeBoard.`,
  }

  /**
   * Fetches Validators from ValidatorTimelock events:
   * It is more complicated to accommodate the case in which
   * a validator is added and removed more than once.
   */
  const validators = () => {
    const validatorsAdded = discovery.getContractValue<string[]>(
      'ValidatorTimelock',
      templateVars.validatorsEvents.added,
    )
    const validatorsRemoved = discovery.getContractValue<string[]>(
      'ValidatorTimelock',
      templateVars.validatorsEvents.removed,
    )

    // Create a map to track the net state of each validator (added or removed)
    const validatorStates = new Map<string, number>()

    // Increment for added validators
    validatorsAdded.forEach((validator) => {
      validatorStates.set(validator, (validatorStates.get(validator) || 0) + 1)
    })

    // Decrement for removed validators
    validatorsRemoved.forEach((validator) => {
      validatorStates.set(validator, (validatorStates.get(validator) || 0) - 1)
    })

    // Filter validators that have a net positive state (added more times than removed)
    return Array.from(validatorStates.entries())
      .filter(([_, state]) => state > 0)
      .map(([validator, _]) => validator)
  }

  return {
    type: 'layer2',
    id: ProjectId(templateVars.discovery.projectName),
    createdAt: templateVars.createdAt,
    badges: mergeBadges(
      [
        Badge.Stack.ZKStack,
        Badge.Infra.ElasticChain,
        Badge.VM.EVM,
        Badge.DA.EthereumBlobs,
      ],
      templateVars.additionalBadges ?? [],
    ),
    display: {
      purposes: ['Universal', ...(templateVars.additionalPurposes ?? [])],
      upgradesAndGovernanceImage: 'zk-stack',
      ...templateVars.display,
      provider: 'ZK Stack',
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
      gasTokens: templateVars.gasTokens,
      escrows: [
        ...(templateVars.nonTemplateEscrows !== undefined
          ? templateVars.nonTemplateEscrows(upgrades)
          : []),
      ],
      transactionApi:
        templateVars.transactionApi ??
        (templateVars.rpcUrl !== undefined
          ? {
              type: 'rpc',
              startBlock: 1,
              defaultUrl: templateVars.rpcUrl,
              defaultCallsPerMinute: 1500,
            }
          : undefined),
      trackedTxs:
        daProvider !== undefined
          ? undefined
          : (templateVars.nonTemplateTrackedTxs ?? []),
      finality: daProvider !== undefined ? undefined : templateVars.finality,
    },
    chainConfig: templateVars.chainConfig,
    dataAvailability:
      daProvider !== undefined
        ? addSentimentToDataAvailability({
            layers: daProvider.fallback
              ? [daProvider.layer, daProvider.fallback]
              : [daProvider.layer],
            bridge: daProvider.bridge,
            mode: DA_MODES.STATE_DIFFS_COMPRESSED,
          })
        : addSentimentToDataAvailability({
            layers: [DA_LAYERS.ETH_BLOBS_OR_CALLDATA],
            bridge: DA_BRIDGES.ENSHRINED,
            mode: DA_MODES.STATE_DIFFS_COMPRESSED,
          }),
    riskView: {
      stateValidation: templateVars.nonTemplateRiskView?.stateValidation ?? {
        ...RISK_VIEW.STATE_ZKP_ST_SN_WRAP,
        secondLine: formatExecutionDelay(executionDelayS),
        sources: [
          {
            contract: 'ValidatorTimelock',
            references: [
              'https://etherscan.io/address/0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E#code#F1#L169',
            ],
          },
          {
            contract: templateVars.diamondContract.name,
            references: [
              'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F1#L448',
              'https://etherscan.io/address/0xE60E94fCCb18a81D501a38959E532C0A85A1be89#code#F6#L23',
            ],
          },
          {
            contract: 'Verifier',
            references: [
              'https://etherscan.io/address/0x70F3FBf8a427155185Ec90BED8a3434203de9604#code#F1#L343',
            ],
          },
        ],
      },
      dataAvailability:
        (templateVars.nonTemplateRiskView?.dataAvailability ??
        daProvider !== undefined)
          ? {
              ...RISK_VIEW.DATA_EXTERNAL,
              sources: [
                {
                  contract: 'ValidatorTimelock',
                  references: [
                    'https://etherscan.io/address/0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E#code#F1#L120',
                    'https://etherscan.io/tx/0x9dbf29985eae00b7a1b7dbd5b21eedfb287be17310eb8bef6c524990b6928f63', // example tx (see calldata, blob)
                  ],
                },
                {
                  contract: templateVars.diamondContract.name,
                  references: [
                    'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F1#L216',
                    'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F1#L52', // validiumMode
                    'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F11#L120',
                  ],
                },
              ],
            }
          : {
              ...RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
              sources: [
                {
                  contract: 'ValidatorTimelock',
                  references: [
                    'https://etherscan.io/address/0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E#code#F1#L120',
                    'https://etherscan.io/tx/0x9dbf29985eae00b7a1b7dbd5b21eedfb287be17310eb8bef6c524990b6928f63', // example tx (see calldata, blob)
                  ],
                },
                {
                  contract: templateVars.diamondContract.name,
                  references: [
                    'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F1#L216',
                    'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F11#L120',
                  ],
                },
              ],
            },
      exitWindow: templateVars.nonTemplateRiskView?.exitWindow ?? {
        ...RISK_VIEW.EXIT_WINDOW_ZKSTACK(upgradeDelayWithScApprovalS),
        sources: [
          {
            contract: templateVars.diamondContract.name,
            references: [
              'https://etherscan.io/address/0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a#code#F1#L114', // upgradeChainFromVersion() onlyAdminOrStateTransitionManager
              'https://etherscan.io/address/0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a#code#F1#L128', // executeUpgrade() onlyStateTransitionManager
            ],
          },
        ],
      },
      sequencerFailure: templateVars.nonTemplateRiskView?.sequencerFailure ?? {
        ...RISK_VIEW.SEQUENCER_ENQUEUE_VIA('L1'),
        sources: [
          {
            contract: templateVars.diamondContract.name,
            references: [
              'https://etherscan.io/address/0xCDB6228b616EEf8Df47D69A372C4f725C43e718C#code#F1#L53',
              'https://etherscan.io/address/0xE60E94fCCb18a81D501a38959E532C0A85A1be89#code#F1#L95',
            ],
          },
        ],
      },
      proposerFailure: templateVars.nonTemplateRiskView?.proposerFailure ?? {
        ...RISK_VIEW.PROPOSER_WHITELIST_GOVERNANCE,
        sources: [
          {
            contract: templateVars.diamondContract.name,
            references: [
              'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F1#L219',
            ],
          },
        ],
      },
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
            text: "L1 - L2 interoperability - Developer's documentation",
            href: 'https://docs.zksync.io/build/developer-reference/l1-l2-interoperability#priority-queue',
          },
        ],
      },
      exitMechanisms: templateVars.nonTemplateTechnology?.exitMechanisms ?? [
        {
          ...EXITS.REGULAR('zk', 'merkle proof'),
          references: [
            {
              text: 'Withdrawing funds - ZKsync documentation',
              href: 'https://docs.zksync.io/build/developer-reference/bridging-assets',
            },
          ],
        },
        EXITS.FORCED('forced-withdrawals'),
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
    A proposal is only successful if it reaches both quorum (${protocolQuorumM}M ZK tokens) and simple majority. When it reaches quorum, the voting period is reset to ${formatSeconds(
      protVotingPeriodS,
    )}. 
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
    ZKsync Era's ChainAdmin differs from the others as it also has the above *Elastic Chain Operator* role in the shared ZK stack contracts.
    `
      return description
    })(),
    permissions: [
      discovery.contractAsPermissioned(
        discovery.getContract('SecurityCouncil'),
        `One of the three signers of the EmergencyUpgradeBoard. Can freeze all ZK stack chains. Can approve governance proposals in the ProtocolUpgradeHandler. The default threshold for the members of this contract is ${scThresholdString} but is customized for certain actions.`,
      ),
      {
        name: 'SecurityCouncil members',
        accounts: discovery.getPermissionedAccounts(
          'SecurityCouncil',
          'members',
        ),
        description: `Members of the SecurityCouncil. The members are mostly low-threshold multisigs themselves. `,
        references: [
          {
            text: 'Security Council members - ZK Nation docs',
            href: 'https://docs.zknation.io/zksync-governance/schedule-3-zksync-security-council',
          },
        ],
      },
      discovery.contractAsPermissioned(
        discovery.getContract('Guardians'),
        `Is one of the three signers of the EmergencyUpgradeBoard. Can extend the legal veto period and / or approve governance proposals in the ProtocolUpgradeHandler. Permissioned to cancel non-protocolUpgrade proposals on L2. The default threshold for the members of this contract is ${guardiansThresholdString} but is customized for certain actions.`,
      ),
      {
        name: 'ZKsync Guardians',
        accounts: discovery.getPermissionedAccounts('Guardians', 'members'),
        description: `Members of the Guardians contract, usually 1/1 Gnosis multisigs themselves. `,
        references: [
          {
            text: 'ZKsync Guardians - ZK Nation docs',
            href: 'https://docs.zknation.io/zksync-governance/schedule-4-zksync-guardians',
          },
        ],
      },
      ...discovery.getMultisigPermission(
        'ZkFoundationMultisig',
        'Is one of the three signers of the EmergencyUpgradeBoard.',
      ),
      discovery.contractAsPermissioned(
        discovery.getContract('ProtocolUpgradeHandler'),
        'Owner and upgrade Admin of all shared ZK stack contracts. Can also upgrade the individual Hyperchain diamond contracts.',
      ),
      ...discovery.getMultisigPermission(
        'Matter Labs Multisig',
        'Has the *ChainAdmin* role in the ZKsync Era diamond and the *Elastic Chain Operator* role in the shared contracts.',
      ),
      {
        name: 'Elastic Chain Operator',
        accounts: [
          discovery.getPermissionedAccount('EraChainAdminProxy', 'owner'),
        ], // This Era contract has both ChainAdmin and Elastic Chain Operator roles
        description:
          'Can change the ValidatorTimelock in the StateTransitionManager, manage validators of the Hyperchain diamonds, revert batches and create new Hyperchains.',
      },
      {
        name: 'ChainAdmin',
        accounts: [
          discovery.getPermissionedAccount(
            templateVars.diamondContract.name,
            'getAdmin',
          ),
        ],
        description:
          'Can manage fees, apply predefined upgrades and censor bridge transactions (*ChainAdmin* role).',
      },
      {
        name: 'Diamond Contract Validators',
        accounts: discovery.getPermissionedAccounts(
          templateVars.diamondContract.name,
          'validators',
        ),
        fromRole: true,
        description: `Addresses permissioned to call the functions to propose, execute and revert L2 batches in the ${templateVars.display.name} diamond. Usually these are addresses of proxying ValidatorTimelock contracts.`,
      },
      {
        name: 'ValidatorTimelock Validators',
        accounts: validators().map((v) =>
          discovery.formatPermissionedAccount(v),
        ),
        fromRole: true,
        description:
          'Actors that are allowed to propose, execute and revert L2 batches on L1 through the ValidatorTimelock.',
      },
      ...(templateVars.nonTemplatePermissions ?? []),
    ],
    nativePermissions: {
      zksync2: [
        {
          accounts: [
            {
              address: EthereumAddress(
                '0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D',
              ),
              type: 'EOA',
            },
          ],
          chain: 'zksync2',
          name: 'ZkFoundationMultisig L2 alias',
          description:
            'The Layer2 alias address through which the ZkFoundationMultisig can act.',
        },
        {
          accounts: [
            {
              address: EthereumAddress(
                '0xe788e09324F8bb3cc64f009973693f751C33b999',
              ),
              type: 'EOA',
            },
          ],
          chain: 'zksync2',
          name: 'Guardians L2 alias',
          description:
            'The Layer2 alias address through which the Guardians contract can act.',
        },
        {
          accounts: [
            {
              address: EthereumAddress(
                '0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8',
              ),
              type: 'EOA',
            },
          ],
          chain: 'zksync2',
          name: 'ProtocolUpgradeHandler L2 alias',
          description:
            'The Layer2 alias address through which the ProtocolUpgradeHandler contract can act.',
        },
        {
          accounts: [
            discovery_ZKstackGovL2.getPermissionedAccount(
              'ZkTokenGovernor',
              'VETO_GUARDIAN',
            ),
          ],
          chain: 'zksync2',
          name: 'Veto Guardian TokenGovernor',
          description:
            'This address can cancel proposals in the ZkTokenGovernor while they are pending (after having been proposed) or active (during the voting period).',
        },
        {
          accounts: [
            discovery_ZKstackGovL2.getPermissionedAccount(
              'ZkTokenGovernor',
              'PROPOSE_GUARDIAN',
            ),
          ],
          chain: 'zksync2',
          name: 'Propose Guardian TokenGovernor',
          description: `This address can make direct proposals in the ZkTokenGovernor without owning ZK tokens${
            discovery_ZKstackGovL2.getContractValue<boolean>(
              'ZkTokenGovernor',
              'isProposeGuarded',
            )
              ? '. This is the only address permissioned to make proposals'
              : ''
          }.`,
        },
        {
          accounts: [
            discovery_ZKstackGovL2.getPermissionedAccount(
              'ZkTokenProxyAdmin',
              'owner',
            ),
          ],
          chain: 'zksync2',
          name: 'ZK Token upgrade Admin',
          description:
            'Can upgrade the ZK token contract, affecting all holders of the ZK token.',
        },
        {
          accounts: discovery_ZKstackGovL2.getAccessControlRolePermission(
            'ZkToken',
            'MINTER_ADMIN_ROLE',
          ),
          chain: 'zksync2',
          name: 'ZK Token minter Admin',
          description:
            'Can add and remove minters from the ZK token contract and mint unlimited amounts.',
        },
        {
          accounts: [
            discovery_ZKstackGovL2.getPermissionedAccount(
              'ZkGovOpsGovernor',
              'VETO_GUARDIAN',
            ),
          ],
          chain: 'zksync2',
          name: 'Veto Guardian GovOpsGovernor',
          description:
            'This address can cancel proposals in the ZkGovOpsGovernor while they are pending (after having been proposed) or active (during the voting period).',
        },
      ],
    },
    contracts: {
      addresses: [
        ...(templateVars.nonTemplateContracts !== undefined
          ? templateVars.nonTemplateContracts(upgrades)
          : []),

        discovery.getContractDetails(
          'ValidatorTimelock',
          `Intermediary contract between the *Validators* and the ZKsync Era diamond that delays block execution (ie withdrawals and other L2 --> L1 messages) by ${executionDelay}.`,
        ),
        discovery.getContractDetails('Verifier', {
          description: 'Implements ZK proof verification logic.',
        }),
        discovery.getContractDetails(
          'SecurityCouncil',
          `Custom contract acting as a Multisig. The default threshold for the members of this contract is ${scThresholdString} but is customized for certain actions.`,
        ),
        discovery.getContractDetails(
          'Guardians',
          `Custom contract acting as a Multisig. The default threshold for the members of this contract is ${guardiansThresholdString} but is customized for certain actions.`,
        ),
        discovery.getContractDetails(
          'ProtocolUpgradeHandler',
          'The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2 and emergency proposals from the EmergencyUpgradeBoard.',
        ),
        discovery.getContractDetails('L1SharedBridge', {
          description:
            'This bridge contract escrows all ERC-20s and ETH that are deposited to registered ZK stack chains like ZKsync Era.',
          ...upgrades,
        }),
        discovery.getContractDetails('BridgeHub', {
          description:
            'Sits between the single shared bridge and the StateTransitionManager(s) and relays L1 <-> L2 messages from the shared bridge or other ZK stack chains to their respective destinations.',
          ...upgrades,
        }),
        discovery.getContractDetails('StateTransitionManager', {
          description:
            'Defines L2 diamond contract creation and upgrade data, proof verification for the `ZKsync diamond` contract connected to it (and other L2 diamond contracts that share the logic).',
          ...upgrades,
        }),
      ],
      nativeAddresses: {
        zksync2: [
          discovery_ZKstackGovL2.getContractDetails(
            'ZkProtocolGovernor',
            `Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that go through Ethereum Layer 1 and can target all L1 and L2 contracts. At least ${protocolStartProposalThresholdM}M ZK tokens are necessary to start a proposal and a ${protocolQuorumM}M quorum of voted tokens must be met to succeed. Can queue and execute proposals in the ProtocolTimelockController.`,
          ),
          discovery_ZKstackGovL2.getContractDetails(
            'ProtocolTimelockController',
            `Timelock contract that can send L2->L1 logs that start a proposal in the ProtocolUpgradeHandler on Ethereum. This timelock has ${
              protTlMinDelayS > 0 ? formatSeconds(protTlMinDelayS) : 'no'
            } minimum delay`,
          ),
          discovery_ZKstackGovL2.getContractDetails(
            'ZkTokenGovernor',
            `Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token. At least ${tokenStartProposalThresholdM}M ZK tokens are necessary to start a proposal (for delegates) and a ${tokenQuorumM}M quorum of voted tokens must be met to succeed. Can queue and execute proposals in the TokenTimelockController.`,
          ),
          discovery_ZKstackGovL2.getContractDetails(
            'TokenTimelockController',
            `This timelock contract has ${
              tokenTlMinDelayS > 0 ? formatSeconds(tokenTlMinDelayS) : 'no'
            } minimum delay`,
          ),
          discovery_ZKstackGovL2.getContractDetails(
            'ZkGovOpsGovernor',
            `Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least ${govOpsStartProposalThresholdM}M ZK tokens are necessary to start a proposal and a ${govOpsQuorumM}M quorum of voted tokens must be met to succeed. Can queue and execute proposals in the GovOpsTimelockController.`,
          ),
          discovery_ZKstackGovL2.getContractDetails(
            'GovOpsTimelockController',
            `This timelock contract has ${
              govOpsTlMinDelayS > 0 ? formatSeconds(govOpsTlMinDelayS) : 'no'
            } minimum delay`,
          ),
          discovery_ZKstackGovL2.getContractDetails('ZkToken', {
            description:
              'The ZK token contract on ZKsync Era. Used for voting in the ZK stack governance system.',
            ...upgrades,
          }),
        ],
      },
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
              '0x70F3FBf8a427155185Ec90BED8a3434203de9604',
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
    knowledgeNuggets: [
      ...(templateVars.knowledgeNuggets ?? []),
      {
        title: 'State diffs vs raw tx data',
        url: 'https://twitter.com/krzKaczor/status/1641505354600046594',
        thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
      },
    ],
  }
}

function technologyDA(
  DA: DAProvider | undefined,
): ScalingProjectTechnologyChoice {
  if (DA !== undefined) {
    return DA.technology
  }

  return TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA
}
