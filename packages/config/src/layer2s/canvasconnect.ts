import { ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  getCommittee,
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
} from '../discovery/starkware'
import { delayDescriptionFromString } from '../utils/delayDescription'
import { formatSeconds } from '../utils/formatSeconds'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('canvasconnect')
const delaySeconds = discovery.getContractUpgradeabilityParam(
  'StarkExchange',
  'upgradeDelay',
)
const delay = formatSeconds(delaySeconds)
const verifierAddress = discovery.getAddressFromValue(
  'GpsFactRegistryAdapter',
  'gpsContract',
)

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
    purpose: 'Privacy, Finance',
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
      ],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        identifier: 'StarkExchange',
        sinceTimestamp: new UnixTime(1675209600),
        tokens: ['ETH', 'USDC'],
      }),
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC,
    upgradeability: RISK_VIEW.UPGRADE_DELAY_SECONDS(delaySeconds),
    sequencerFailure: RISK_VIEW.SEQUENCER_STARKEX_SPOT,
    validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_STARKEX_NFT,
    destinationToken: RISK_VIEW.CANONICAL,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    provider: 'StarkEx',
    category: 'Validium',
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW,
    exitMechanisms: EXITS.STARKEX_NFT,
  },
  contracts: {
    addresses: [
      discovery.getMainContractDetails('StarkExchange'),
      discovery.getMainContractDetails(
        'Committee',
        'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
      ),
      ...getSHARPVerifierContracts(discovery, verifierAddress),
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(delaySeconds)],
  },
  permissions: [
    {
      name: 'Governors',
      accounts: getProxyGovernance(discovery, 'StarkExchange'),
      description:
        'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromString(delay),
    },
    getCommittee(discovery),
    ...getSHARPVerifierGovernors(discovery, verifierAddress),
    {
      name: 'Operators',
      accounts: discovery.getPermissionedAccountsList(
        'StarkExchange',
        'OPERATORS',
      ),
      description:
        'Allowed to update state of the system. When Operator is down the state cannot be updated.',
    },
  ],
  milestones: [],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
