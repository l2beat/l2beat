import { ContractParameters } from '@l2beat/discovery-types'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  KnowledgeNugget,
  makeBridgeCompatible,
  Milestone,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  ScalingProjectContract,
  ScalingProjectEscrow,
  ScalingProjectPermission,
  ScalingProjectRiskViewEntry,
  ScalingProjectStateDerivation,
  ScalingProjectTechnologyChoice,
} from '../../common'
import { subtractOne } from '../../common/assessCount'
import { ChainConfig } from '../../common/ChainConfig'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../discovery/values/hardcoded'
import { getStage } from '../common/stages/getStage'
import {
  Layer2,
  Layer2Display,
  Layer2FinalityConfig,
  Layer2TransactionApi,
} from '../types'

export const CELESTIA_DA_PROVIDER: DAProvider = {
  name: 'Celestia',
  riskView: RISK_VIEW.DATA_CELESTIA(false),
  technology: DATA_AVAILABILITY.CELESTIA_OFF_CHAIN(false),
}

export interface DAProvider {
  name: string
  riskView: ScalingProjectRiskViewEntry
  technology: ScalingProjectTechnologyChoice
}

export interface OpStackConfig {
  daProvider?: DAProvider
  discovery: ProjectDiscovery
  display: Omit<Layer2Display, 'provider' | 'category' | 'dataAvailabilityMode'>
  upgradeability: {
    upgradableBy: string[] | undefined
    upgradeDelay: string | undefined
  }
  l1StandardBridgeEscrow: EthereumAddress
  rpcUrl?: string
  transactionApi?: Layer2TransactionApi
  genesisTimestamp: UnixTime
  finality?: Layer2FinalityConfig
  l2OutputOracle: ContractParameters
  portal: ContractParameters
  stateDerivation?: ScalingProjectStateDerivation
  milestones: Milestone[]
  knowledgeNuggets: KnowledgeNugget[]
  roleOverrides: Record<string, string>
  nonTemplatePermissions?: ScalingProjectPermission[]
  nonTemplateContracts?: ScalingProjectContract[]
  nonTemplateEscrows: ScalingProjectEscrow[]
  associatedTokens?: string[]
  isNodeAvailable: boolean | 'UnderReview'
  chainConfig?: ChainConfig
  upgradesAndGovernance?: string
  hasProperSecurityCouncil?: boolean
}

export function opStack(templateVars: OpStackConfig): Layer2 {
  const sequencerAddress = EthereumAddress(
    templateVars.discovery.getContractValue('SystemConfig', 'batcherHash'),
  )
  const sequencerInbox = EthereumAddress(
    templateVars.discovery.getContractValue('SystemConfig', 'sequencerInbox'),
  )
  return {
    type: 'layer2',
    id: ProjectId(templateVars.discovery.projectName),
    display: {
      ...templateVars.display,
      provider: 'OP Stack',
      category:
        templateVars.daProvider !== undefined
          ? 'Optimium'
          : 'Optimistic Rollup',
      dataAvailabilityMode:
        templateVars.daProvider !== undefined ? 'NotApplicable' : 'TxData',
      warning:
        templateVars.display.warning === undefined
          ? 'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.'
          : templateVars.display.warning,
      finality: {
        warning:
          "It's assumed that transaction data batches are submitted sequentially.",
        finalizationPeriod: templateVars.display.finality?.finalizationPeriod,
      },
    },
    config: {
      associatedTokens: templateVars.associatedTokens,
      escrows: [
        templateVars.discovery.getEscrowDetails({
          address: templateVars.portal.address,
          tokens: ['ETH'],
          description: 'Main entry point for users depositing ETH.',
          ...templateVars.upgradeability,
        }),
        templateVars.discovery.getEscrowDetails({
          address: templateVars.l1StandardBridgeEscrow,
          tokens: '*',
          description:
            'Main entry point for users depositing ERC20 token that do not require custom gateway.',
          ...templateVars.upgradeability,
        }),
        ...templateVars.nonTemplateEscrows,
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
      liveness:
        templateVars.daProvider !== undefined
          ? undefined
          : {
              proofSubmissions: [],
              batchSubmissions: [
                {
                  formula: 'transfer',
                  from: sequencerAddress,
                  to: sequencerInbox,
                  sinceTimestamp: templateVars.genesisTimestamp,
                },
              ],
              stateUpdates: [
                {
                  formula: 'functionCall',
                  address: templateVars.l2OutputOracle.address,
                  selector: '0x9aaab648',
                  functionSignature:
                    'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)',
                  sinceTimestamp: new UnixTime(
                    templateVars.l2OutputOracle.sinceTimestamp ??
                      templateVars.genesisTimestamp.toNumber(),
                  ),
                },
              ],
            },
      finality:
        templateVars.daProvider !== undefined
          ? undefined
          : templateVars.finality,
    },
    chainConfig: templateVars.chainConfig,
    riskView: makeBridgeCompatible({
      stateValidation: RISK_VIEW.STATE_NONE,
      dataAvailability: {
        ...riskViewDA(templateVars.daProvider),
        sources: [
          {
            contract: templateVars.portal.name,
            references: [],
          },
        ],
      },
      exitWindow: {
        ...RISK_VIEW.EXIT_WINDOW(
          0,
          templateVars.discovery.getContractValue<number>(
            'L2OutputOracle',
            'FINALIZATION_PERIOD_SECONDS',
          ),
        ),
        sources: [
          {
            contract: templateVars.portal.name,
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
        sources: [
          {
            contract: templateVars.portal.name,
            references: [],
          },
        ],
      },
      proposerFailure: {
        ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
        sources: [
          {
            contract: templateVars.l2OutputOracle.name,
            references: [],
          },
        ],
      },
      destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
      validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    }),
    stage:
      templateVars.daProvider !== undefined
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
                  ? 'https://github.com/ethereum-optimism/optimism/tree/develop/op-node'
                  : '',
            },
          ),
    stateDerivation: templateVars.stateDerivation,
    upgradesAndGovernance: templateVars.upgradesAndGovernance,
    technology: {
      stateCorrectness: {
        name: 'Fraud proofs are in development',
        description:
          'Ultimately, OP stack chains will use interactive fraud proofs to enforce state correctness. This feature is currently in development and the system permits invalid state roots.',
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
              templateVars.l2OutputOracle,
            )}#code`,
          },
        ],
      },
      dataAvailability: {
        ...technologyDA(templateVars.daProvider),
        references: [
          ...technologyDA(templateVars.daProvider).references,
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
              templateVars.portal,
            )}#code`,
          },
        ],
      },
      operator: {
        ...OPERATOR.CENTRALIZED_OPERATOR,
        references: [
          {
            text: 'L2OutputOracle.sol - Etherscan source code, CHALLENGER address',
            href: `https://etherscan.io/address/${safeGetImplementation(
              templateVars.l2OutputOracle,
            )}#code`,
          },
          {
            text: 'L2OutputOracle.sol - Etherscan source code, PROPOSER address',
            href: `https://etherscan.io/address/${safeGetImplementation(
              templateVars.l2OutputOracle,
            )}#code`,
          },
          {
            text: 'Decentralizing the sequencer - OP Stack docs',
            href: 'https://community.optimism.io/docs/protocol/#decentralizing-the-sequencer',
          },
        ],
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
        references: [
          {
            text: 'Sequencing Window - OP Mainnet Specs',
            href: 'https://github.com/ethereum-optimism/optimism/blob/51eeb76efeb32b3df3e978f311188aa29f5e3e94/specs/glossary.md#sequencing-window',
          },
          {
            text: 'OptimismPortal.sol - Etherscan source code, depositTransaction function',
            href: `https://etherscan.io/address/${safeGetImplementation(
              templateVars.portal,
            )}#code`,
          },
        ],
      },
      exitMechanisms: [
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
                templateVars.portal,
              )}#code`,
            },
            {
              text: 'OptimismPortal.sol - Etherscan source code, finalizeWithdrawalTransaction function',
              href: `https://etherscan.io/address/${safeGetImplementation(
                templateVars.portal,
              )}#code`,
            },
            {
              text: 'L2OutputOracle.sol - Etherscan source code, PROPOSER check',
              href: `https://etherscan.io/address/${safeGetImplementation(
                templateVars.l2OutputOracle,
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
      smartContracts: {
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
    },
    permissions: [
      ...templateVars.discovery.getOpStackPermissions(
        templateVars.roleOverrides,
      ),
      ...(templateVars.nonTemplatePermissions ?? []),
    ],
    contracts: {
      addresses: [
        ...templateVars.discovery.getOpStackContractDetails(
          templateVars.upgradeability,
        ),
        ...(templateVars.nonTemplateContracts ?? []),
      ],
      risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    },
    milestones: templateVars.milestones,
    knowledgeNuggets: [
      ...templateVars.knowledgeNuggets,
      {
        title: 'How Optimism compresses data',
        url: 'https://twitter.com/bkiepuszewski/status/1508740414492323840?s=20&t=vMgR4jW1ssap-A-MBsO4Jw',
        thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
      },
      {
        title: 'Bedrock Explainer',
        url: 'https://community.optimism.io/docs/developers/bedrock/explainer/',
        thumbnail: NUGGETS.THUMBNAILS.OPTIMISM_04,
      },
      {
        title: 'Modular Rollup Theory',
        url: 'https://www.youtube.com/watch?v=jnVjhp41pcc',
        thumbnail: NUGGETS.THUMBNAILS.MODULAR_ROLLUP,
      },
    ],
  }
}

function safeGetImplementation(contract: ContractParameters): string {
  const implementation = contract.implementations?.[0]
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
): ScalingProjectTechnologyChoice {
  return DA === undefined ? DATA_AVAILABILITY.ON_CHAIN : DA.technology
}
