import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  addSentimentToDataAvailability,
  makeBridgeCompatible,
} from '../../common'
import { RISK_VIEW } from '../../common/riskView'
import { Layer2 } from './types'

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
      description: ``,
      sentiment: 'bad',
      value: '',
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
      description: '',
      sentiment: 'good',
      value: '',
    },
    proposerFailure: {
      description: '',
      sentiment: 'good',
      value: '',
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
  }),
  stage: {
    stage: 'NotApplicable',
  },
  technology: {
    stateCorrectness: {
      name: '',
      description: '.',
      references: [],
      risks: [],
    },
    dataAvailability: {
      name: '',
      description: '.',
      references: [],
      risks: [],
    },
    operator: {
      name: '',
      description: '.',
      references: [],
      risks: [],
    },
    forceTransactions: {
      name: '',
      description: '.',
      references: [],
      risks: [],
    },
    exitMechanisms: [],
  },
  contracts: {
    addresses: [],
    risks: [],
  },
}
