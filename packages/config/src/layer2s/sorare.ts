import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { getProxyGovernance } from '../discovery/starkware/getProxyGovernance'
import {
  delayDescriptionFromSeconds,
  delayDescriptionFromString,
} from '../utils/delayDescription'
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
  SHARP_VERIFIER_CONTRACT,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('sorare')

const delaySeconds = discovery.getContractUpgradeabilityParam(
  'StarkExchange',
  'upgradeDelay',
)
const delay = formatSeconds(delaySeconds)

export const sorare: Layer2 = {
  type: 'layer2',
  id: ProjectId('sorare'),
  display: {
    name: 'Sorare',
    slug: 'sorare',
    description:
      'Sorare is a global fantasy football game where you can play with officially licensed digital cards and earn prizes every week.',
    purpose: 'NFT, Exchange',
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
      {
        address: EthereumAddress('0xF5C9F957705bea56a7e806943f98F7777B995826'),
        sinceTimestamp: new UnixTime(1626352527),
        tokens: ['ETH'],
      },
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
      {
        name: 'Committee',
        address: EthereumAddress('0x879cD57975d596004863D30c59d579ef78BBbe32'),
        description:
          'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
      },
      SHARP_VERIFIER_CONTRACT,
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
    {
      name: 'Data Availability Committee',
      accounts: [
        {
          address: EthereumAddress(
            '0x6EBCb783E53C072e9b1C8786942aefc145C6Df75',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x9bC546c5741d31b3510D3B240bDB4c517030E318',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xA70A45E56c087A34991A712d437fcFfd79D3a8Ec',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xefaaf3A5D0D795C7c1f92cBeDE868C273790026e',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Validity proof must be signed by at least 2 of these addresses to approve state update.',
    },
    {
      name: 'SHARP Verifier Governor',
      accounts: [
        {
          address: EthereumAddress(
            '0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Can upgrade implementation of SHARP Verifier, potentially with code approving fraudulent state. ' +
        // @todo
        // This should be coming from discovery, but it's not available yet.
        // because sorare discovery is not detecting the starkware diamond
        delayDescriptionFromSeconds(2419200),
    },
    {
      name: 'Operators',
      accounts: discovery
        .getContractValue<string[]>('StarkExchange', 'OPERATORS')
        .map(discovery.formatPermissionedAccount.bind(discovery)),
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
