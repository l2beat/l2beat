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

const discovery = new ProjectDiscovery('myria')

const delaySeconds = discovery.getContractUpgradeabilityParam(
  'StarkExchange',
  'upgradeDelay',
)
const delay = formatSeconds(delaySeconds)

const verifierAddress = discovery.getAddressFromValue(
  'GpsFactRegistryAdapter',
  'gpsContract',
)
export const myria: Layer2 = {
  type: 'layer2',
  id: ProjectId('myria'),
  display: {
    name: 'Myria',
    slug: 'myria',
    description:
      'Myria is an expansive blockchain gaming ecosystem, comprised of a blockchain gaming hub and Myriaverse metaverse, underpinned by a full suite of Myria infrastructure. Myria will also offer B2B services to enable third-party studios and developers to onboard onto the Myria chain.',
    purpose: 'NFT, Exchange',
    links: {
      websites: ['https://myria.com/'],
      apps: ['https://market.x.immutable.com/'],
      documentation: ['https://docs.starkware.co/starkex-docs-v2/'],
      explorers: [],
      repositories: ['https://github.com/starkware-libs/starkex-contracts'],
      socialMedia: [
        'https://medium.com/@myriagames',
        'https://twitter.com/myria',
      ],
    },
    activityDataSource: 'Closed API',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        identifier: 'StarkExchange',
        sinceTimestamp: new UnixTime(1659542607),
        tokens: ['ETH'],
      }),
    ],
    transactionApi: {
      type: 'starkex',
      product: 'myria',
      sinceTimestamp: new UnixTime(1659542607),
      resyncLastDays: 7,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC,
    upgradeability: RISK_VIEW.UPGRADE_DELAY(delay),
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
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(delay)],
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
        'Allowed to update the state. When the Operator is down the state cannot be updated.',
    },
  ],
  milestones: [
    {
      name: 'Mainnet Launch',
      date: '2022-08-26T00:00:00Z',
      link: 'https://medium.com/myria-official/myrias-layer-2-launch-has-arrived-6a3c3da9561f',
      description:
        'Layer 2 scaling solution powered by Starware is live on Ethereum.',
    },
  ],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
