import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DATA_ON_CHAIN,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { getStage } from './common/stages/getStage'
import type { Layer2 } from './types'
import { formatDelay, formatExecutionDelay } from '../../common/formatDelays'

const discovery = new ProjectDiscovery('phala')

const finalizationPeriod = discovery.getContractValue<number>('OPSuccinctL2OutputOracle', 'finalizationPeriodSeconds')
const upgradeDelay = 0
const forcedWithdrawalDelay = 0
const SEQUENCING_WINDOW_SECONDS = 3600 * 12

export const phala: Layer2 = {
  id: ProjectId('phala'),
  createdAt: new UnixTime(1734388655), // Dec-16-2024 10:37:35 PM UTC
  display: {
    name: 'Phala',
    slug: 'phala',
    description: `Phala is cloud computing protocol which aims at offering developers a secure and efficient platform for deploying and managing AI-ready applications in a trusted environment (TEE).
      Phala rollup on Ethereum leverages the Op-Succinct stack, a combination of OP stack contracts and Zero-Knowledge Proofs (ZK) using the SP1 zkVM.`,
    category: 'ZK Rollup',
    activityDataSource: 'Blockchain RPC',
    purposes: ['Universal'],
    links: {
      websites: ['https://phala.network/'],
      apps: [],
      documentation: ['https://docs.phala.network/'],
      explorers: ['https://explorer.phala.network'],
      repositories: ['https://github.com/Phala-Network/'],
      socialMedia: [
        'https://x.com/PhalaNetwork',
        'https://discord.com/invite/phala-network',
        'https://t.me/phalanetwork',
        'https://phala.network/blog',
      ],
    },
  },
  chainConfig: {
    name: 'phala',
    chainId: 1,
    explorerUrl: 'https://explorer.phala.network/',
    explorerApi: {
      url: 'https://explorer.phala.network/api',
      type: 'blockscout',
    },
    minTimestampForTvl: UnixTime.fromDate(new Date('2024-12-16T22:14:09Z')),
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521'),
        sinceTimestamp: new UnixTime(1734388655),
        tokens: '*',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A'),
        sinceTimestamp: new UnixTime(1734388655),
        tokens: ['ETH'],
      }),
    ],
  },
  dataAvailability: [
    addSentimentToDataAvailability({
      layers: [DA_LAYERS.ETH_BLOBS_OR_CALLDATA],
      bridge: DA_BRIDGES.ENSHRINED,
      mode: DA_MODES.TRANSACTION_DATA,
    }),
  ],
  badges: [Badge.VM.EVM, Badge.DA.EthereumBlobs, Badge.RaaS.Conduit],
  type: 'layer2',
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      secondLine: formatExecutionDelay(finalizationPeriod),
    },
    dataAvailability: {
      ...DATA_ON_CHAIN,
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, forcedWithdrawalDelay),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        SEQUENCING_WINDOW_SECONDS,
      ),
      secondLine: formatDelay(SEQUENCING_WINDOW_SECONDS),
      sources: [
        {
          contract: 'OptimismPortal',
          references: [],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [
        {
          contract: 'OPSuccinctL2OutputOracle',
          references: [],
        },
      ],
    },
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: false,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: false,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: false,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/succinctlabs/op-succinct/',
    },
  ),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [],
      risks: [],
    },
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [],
      risks: [],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA,
      references: [
        {
          href: 'https://etherscan.io/address/0x5a2a0698355d06cd5c4e3872d2bc6b9f6a89d39b',
          text: 'BatchInbox - Etherscan address',
        },
      ],
      risks: [],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [],
      risks: [],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_YIELDING(
          'zk',
          finalizationPeriod,
        ),
        references: [],
        risks: [],
      },
    ],
  },
  contracts: {
    addresses: discovery.getDiscoveredContracts(),
    risks: [],
  },
  permissions: discovery.getDiscoveredPermissions(),
  milestones: [],
}
