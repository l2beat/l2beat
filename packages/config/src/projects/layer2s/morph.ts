import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('morph')

const upgradesMorphMultisig = {
  upgradableBy: ['MorphMultisig'],
  upgradeDelay: 'No delay',
}

export const morph: Layer2 = opStackL2({
  createdAt: new UnixTime(1729278720), // 2024-10-19T03:12:00Z
  discovery,
  display: {
    name: 'Morph',
    slug: 'morph',
    architectureImage: 'morph',
    description:
      'Morph is an EVM compatible rollup. It operates as an optimistic rollup with ZK fault proofs.',
    links: {
      websites: ['https://morphl2.io'],
      apps: ['https://bridge.morphl2.io'],
      documentation: ['https://docs.morphl2.io'],
      explorers: ['https://explorer.morphl2.io'],
      repositories: ['https://github.com/morph-l2'],
      socialMedia: [
        'https://twitter.com/MorphL2',
        'https://t.me/MorphL2official',
        'https://medium.com/@morphlayer2',
        'https://discord.com/invite/L2Morph',
        'https://youtube.com/@morphofficiall2',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.morphl2.io',
  chainConfig: {
    name: 'morph',
    coingeckoPlatform: 'morph',
    chainId: 2818,
    explorerUrl: 'https://explorer.morphl2.io',
    explorerApi: {
      url: 'https://explorer-api.morphl2.io',
      type: 'blockscout',
    },
    minTimestampForTvl: UnixTime.fromDate(new Date('2024-10-19T03:12:00Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 20996846,
        version: '3',
      },
    ],
  },
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.morphl2.io',
    startBlock: 1,
    defaultCallsPerMinute: 600,
  },
  genesisTimestamp: new UnixTime(1729272527), // Import Genesis Batch
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8'),
      name: 'L1 Standard ERC20 Gateway',
      tokens: '*',
      excludedTokens: ['stETH'],
      ...upgradesMorphMultisig,
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304'),
      name: 'L1 Cross Domain Messenger',
      tokens: ['ETH'],
      ...upgradesMorphMultisig,
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0xA534BAdd09b4C62B7B1C32C41dF310AA17b52ef1'),
      name: 'L1 Custom ERC20 Gateway',
      tokens: '*',
      source: 'external',
      ...upgradesMorphMultisig,
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0xc9045350712A1DCC3A74Eca18Bc985424Bbe7535'),
      name: 'L1 USDC Gateway',
      tokens: ['USDC'],
      source: 'external',
      ...upgradesMorphMultisig,
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0xA00Bc264cdA71d4cBFdA64Fed2482A2c99A62575'),
      name: 'L1 Lido Gateway',
      tokens: ['wstETH'],
      source: 'external',
      ...upgradesMorphMultisig,
    }),
  ],
  isNodeAvailable: true,
  usesBlobs: true,
  associatedTokens: ['MORPH'],
  nodeSourceLink: 'https://github.com/morph-l2/morph',
  discoveryDrivenData: true,
  milestones: [
    {
      name: 'Morph Mainnet Launch',
      link: 'https://x.com/MorphL2/status/1851611991174995969',
      date: '2024-10-30T13:07:00Z',
      description: 'Morph is live on mainnet.',
      type: 'general',
    },
  ],
})
