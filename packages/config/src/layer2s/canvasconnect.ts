import {
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  makeDataAvailabilityConfig,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  getCommittee,
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
  getSHARPVerifierUpgradeDelay,
} from '../discovery/starkware'
import { delayDescriptionFromString } from '../utils/delayDescription'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('canvasconnect')
const upgradeDelaySeconds = discovery.getContractUpgradeabilityParam(
  'StarkExchange',
  'upgradeDelay',
)
const includingSHARPUpgradeDelaySeconds = Math.min(
  upgradeDelaySeconds,
  getSHARPVerifierUpgradeDelay(),
)
const upgradeDelay = formatSeconds(upgradeDelaySeconds)
const verifierAddress = discovery.getAddressFromValue(
  'GpsFactRegistryAdapter',
  'gpsContract',
)

const freezeGracePeriod = discovery.getContractValue<number>(
  'StarkExchange',
  'FREEZE_GRACE_PERIOD',
)

const committee = getCommittee(discovery)

export const canvasconnect: Layer2 = {
  type: 'layer2',
  id: ProjectId('canvasconnect'),
  display: {
    name: 'Canvas Connect',
    slug: 'canvasconnect',
    warning:
      'Canvas Connect is currently open only to whitelisted institutional clients.',
    description:
      'Canvas Connect is a Layer 2 solution based on StarkEx technology, specifically designed to provide centralized investment and trading services to financial institutions.',
    purposes: ['Privacy', 'DeFi'],
    provider: 'StarkEx',
    category: 'Validium',
    links: {
      websites: ['https://canvas.co/'],
      apps: [],
      documentation: ['https://docs.starkware.co/starkex/index.html'],
      explorers: [],
      repositories: ['https://github.com/starkware-libs/starkex-contracts'],
      socialMedia: [
        'https://twitter.com/canvas_defi',
        'https://canvasdefi.medium.com/',
        'https://linkedin.com/company/canvasblockchaingroup',
        'https://canvas.co/content',
        'https://youtube.com/@canvas_defi',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x7A7f9c8fe871cd50f6Ce935d7c7caD2e89987f9d'),
        sinceTimestamp: new UnixTime(1675209600),
        tokens: ['ETH', 'USDC'],
      }),
    ],
  },
  dataAvailability: makeDataAvailabilityConfig({
    type: 'Off chain (DAC)',
    config: {
      membersCount: committee.accounts.length,
      requiredSignatures: committee.minSigners,
    },
    mode: 'State diffs',
  }),
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC({
      membersCount: committee.accounts.length,
      requiredSignatures: committee.minSigners,
    }),
    exitWindow: RISK_VIEW.EXIT_WINDOW(
      includingSHARPUpgradeDelaySeconds,
      freezeGracePeriod,
    ),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(freezeGracePeriod),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP_NFT,
    destinationToken: RISK_VIEW.CANONICAL,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW(),
    exitMechanisms: EXITS.STARKEX_SPOT,
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('StarkExchange'),
      discovery.getContractDetails(
        'Committee',
        'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
      ),
      ...getSHARPVerifierContracts(discovery, verifierAddress),
    ],
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(
        includingSHARPUpgradeDelaySeconds,
      ),
    ],
  },
  permissions: [
    {
      name: 'Governors',
      accounts: getProxyGovernance(discovery, 'StarkExchange'),
      description:
        'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromString(upgradeDelay),
    },
    committee,
    ...getSHARPVerifierGovernors(discovery, verifierAddress),
    {
      name: 'Operators',
      accounts: discovery.getPermissionedAccounts('StarkExchange', 'OPERATORS'),
      description:
        'Allowed to update state of the system. When Operator is down the state cannot be updated.',
    },
  ],
  milestones: [],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
