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
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('sorare')
const freezeGracePeriod = discovery.getContractValue<number>(
  'StarkExchange',
  'FREEZE_GRACE_PERIOD',
)

const delaySeconds = discovery.getContractUpgradeabilityParam(
  'StarkExchange',
  'upgradeDelay',
)
const delay = formatSeconds(delaySeconds)
const verifierAddress = discovery.getAddressFromValue(
  'GpsFactRegistryAdapter',
  'gpsContract',
)

export const sorare: Layer2 = {
  type: 'layer2',
  id: ProjectId('sorare'),
  display: {
    name: 'Sorare',
    slug: 'sorare',
    description:
      'Sorare is a global fantasy football game where you can play with officially licensed digital cards and earn prizes every week.',
    purpose: 'NFT, Exchange',
    provider: 'StarkEx',
    category: 'Validium',
    links: {
      websites: ['https://sorare.com/'],
      apps: [],
      documentation: ['https://docs.starkware.co/starkex-docs-v2/'],
      explorers: [],
      repositories: ['https://github.com/starkware-libs/starkex-contracts'],
      socialMedia: [
        'https://discord.gg/TSjtHaM',
        'https://reddit.com/r/Sorare/',
        'https://twitter.com/Sorare',
        'https://instagram.com/sorare_official/',
      ],
    },
    activityDataSource: 'Closed API',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xF5C9F957705bea56a7e806943f98F7777B995826'),
        sinceTimestamp: new UnixTime(1626352527),
        tokens: ['ETH'],
      }),
    ],
    transactionApi: {
      type: 'starkex',
      product: 'sorare',
      sinceTimestamp: new UnixTime(1626352527),
      resyncLastDays: 7,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: {
      ...RISK_VIEW.DATA_EXTERNAL_DAC,
      sources: [
        {
          contract: 'StarkExchange',
          references: [
            'https://etherscan.io/address/0x67e198743BC19fa4757720eDd0e769f8291e1F1D#code#F14#L188',
          ],
        },
        {
          contract: 'Committee',
          references: [
            'https://etherscan.io/address/0x879cD57975d596004863D30c59d579ef78BBbe32#code#F1#L65',
          ],
        },
      ],
    },
    upgradeability: RISK_VIEW.UPGRADE_DELAY_SECONDS(delaySeconds),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(freezeGracePeriod),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP_NFT,
    destinationToken: RISK_VIEW.CANONICAL,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
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
        'Allowed to update state of the system. When Operator is down the state cannot be updated.',
    },
  ],
  milestones: [
    {
      name: 'Mainnet launch',
      date: '2021-07-26T00:00:00Z',
      link: 'https://medium.com/sorare/were-live-on-our-scaling-solution-starkware-62438abee9a8',
      description:
        'Layer 2 scaling solution powered by Starkware, is live on Ethereum.',
    },
  ],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
