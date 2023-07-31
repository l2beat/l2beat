import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

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
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('brine')

const delaySeconds = discovery.getContractUpgradeabilityParam(
  'StarkExchange',
  'upgradeDelay',
)
const delay = formatSeconds(delaySeconds)

const verifierAddress = discovery.getAddressFromValue(
  'GpsFactRegistryAdapter',
  'gpsContract',
)

const freezeGracePeriod = discovery.getContractValue<number>(
  'StarkExchange',
  'FREEZE_GRACE_PERIOD',
)

export const brine: Layer2 = {
  type: 'layer2',
  id: ProjectId('brine'),
  display: {
    name: 'Brine',
    slug: 'brine',
    description: 'Brine is a DEX powered by StarkEx.',
    purpose: 'Exchange',
    category: 'Validium',
    provider: 'StarkEx',
    links: {
      websites: ['https://www.brine.fi/'],
      apps: ['https://trade.brine.fi/'],
      documentation: ['https://docs.brine.fi/'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://twitter.com/BrineFinance',
        'https://discord.gg/wMAnf3gVTh',
      ],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x1390f521A79BaBE99b69B37154D63D431da27A07'),
        sinceTimestamp: new UnixTime(1657453320),
        tokens: '*',
        description: "Main entry point for users' deposits.",
      }),
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: {
      ...RISK_VIEW.DATA_EXTERNAL_DAC,
      sources: [
        {
          contract: 'Committee',
          references: [
            'https://etherscan.io/address/0x4F8B2dd49D958b6ac3e5f4705Bf1a9aDA5Bc4446#code#F1#L60',
          ],
        },
      ],
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.CANONICAL,
    upgradeability: RISK_VIEW.UPGRADE_DELAY_SECONDS(
      delaySeconds,
      freezeGracePeriod,
    ),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(freezeGracePeriod),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP,
  }),
  technology: {
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    dataAvailability: DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
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
      accounts: discovery.getPermissionedAccounts('StarkExchange', 'OPERATORS'),
      description:
        'Allowed to update the state. When the Operator is down the state cannot be updated.',
    },
  ],
  milestones: [
    {
      name: 'Mainnet Launch',
      date: '2023-04-27T00:00:00.00Z',
      link: 'https://www.brine.fi/beta-launch',
      description: 'Brine DEX is live on mainnet.',
    },
  ],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
