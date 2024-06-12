import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import {
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
  makeBridgeCompatible,
} from '../../common'
import { RISK_VIEW } from '../../common/riskView'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('lightlink')

const CHALLENGE_PERIOD_SECONDS = discovery.getContractValue<number>(
  'Challenge',
  'challengeWindow',
)

export const lightlink: Layer2 = {
  id: ProjectId('lightlink'),
  dataAvailability: addSentimentToDataAvailability({
    layers: ['Celestia'],
    bridge: { type: 'None' },
    mode: 'Transactions data',
  }),
  display: {
    name: 'LightLink',
    slug: 'lightlink',
    description:
      'LightLink is an Ethereum Layer 2 blockchain that lets dApps and enterprises offer users instant, gasless transactions.',
    purposes: ['Universal'],
    category: 'Optimium',
    links: {
      websites: ['https://lightlink.io'],
      apps: ['https://phoenix.lightlink.io/apps'],
      documentation: ['https://docs.lightlink.io'],
      explorers: ['https://phoenix.lightlink.io'],
      repositories: ['https://github.com/lightlink-network'],
      socialMedia: [
        'https://twitter.com/lightlinkchain',
        'https://discord.com/invite/lightlinkchain',
        'https://t.me/lightlinkll',
        'https://linkedin.com/company/lightlinkchain',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    associatedTokens: ['LL'],
    escrows: [
      {
        address: EthereumAddress('0x3ca373F5ecB92ac762f9876f6e773082A4589995'),
        sinceTimestamp: new UnixTime(1692181067),
        tokens: ['ETH'],
      },
      {
        address: EthereumAddress('0x63105ee97bfb22dfe23033b3b14a4f8fed121ee9'),
        sinceTimestamp: new UnixTime(1692185219),
        tokens: '*',
      },
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      defaultUrl: 'https://replicator.phoenix.lightlink.io/rpc/v1',
      defaultCallsPerMinute: 500,
    },
  },
  chainConfig: {
    name: 'lightlink',
    chainId: 1890,
    explorerUrl: 'https://phoenix.lightlink.io',
    explorerApi: {
      url: 'https://phoenix.lightlink.io/api',
      type: 'blockscout',
    },
    minTimestampForTvl: new UnixTime(1692181067),
  },
  type: 'layer2',
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      secondLine: `${formatSeconds(CHALLENGE_PERIOD_SECONDS)} challenge period`,
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_CELESTIA(false),
    },
    exitWindow: {
      description:
        'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
      sentiment: 'bad',
      value: 'None',
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_NO_MECHANISM(),
    },
    proposerFailure: {
      description:
        'Only the whitelisted publisher is allowed to push new state roots to the CSC contract on L1. The LightLink DAO can replace the publisher if a block is successfully challenged.',
      sentiment: 'bad',
      value: 'Cannot withdraw',
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
  }),
  stage: {
    stage: 'NotApplicable',
  },
  technology: {
    stateCorrectness: {
      name: 'Fraud proofs are in development',
      description:
        'After some period of time, the published state root is assumed to be correct. For a certain time period, anyone can challenge a block header against some basic validity checks.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'an invalid state root is submitted to the system.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'LightLink - ChallengeHeader.sol',
          href: 'https://etherscan.io/address/0x2785d4af59bf299c1f2dbc5132e72b2ee015b3ac#code',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.CELESTIA_OFF_CHAIN(false),
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
    ],
  },
  contracts: {
    addresses: [],
    risks: [],
  },
}
