import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { agglayer } from '../../templates/agglayer'

const discovery = new ProjectDiscovery('xlayer')
const bridge = discovery.getContract('AgglayerBridge')

export const xlayer: ScalingProject = agglayer({
  addedAt: UnixTime(1713983341), // 2024-04-24T18:29:01Z
  display: {
    name: 'X Layer',
    slug: 'xlayer',
    description:
      'X Layer is a Layer 2 by OKX with seamless integration with OKX products. It is powered by the Agglayer CDK.',
    links: {
      websites: ['https://okx.com/xlayer'],
      documentation: [
        'https://web3.okx.com/ua/xlayer/docs/developer/build-on-xlayer/about-xlayer',
      ],
      explorers: ['https://okx.com/explorer/xlayer'],
      socialMedia: ['https://twitter.com/XLayerOfficial'],
      bridges: ['https://web3.okx.com/xlayer/bridge'],
      repositories: ['https://github.com/okx/xlayer-erigon'],
    },
  },
  discovery,
  usesEthereumBlobs: true,
  associatedTokens: ['OKB'],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      sinceTimestamp: UnixTime(1712620800),
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherWrapped',
        wethAddress: EthereumAddress(
          '0x5a77f1443d16ee5761d310e38b62f77f726bc71c',
        ),
        tokensToAssignFromL1: ['OKB'],
      },
    }),
  ],
  chainConfig: {
    name: 'xlayer',
    chainId: 196,
    explorerUrl: 'https://rpc.xlayer.tech',
    gasTokens: ['OKB'],
    sinceTimestamp: UnixTime(1711782180),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 47416,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.xlayer.tech',
        callsPerMinute: 300,
      },
    ],
  },
  milestones: [
    {
      title: 'Migration to Pessimistic Proofs',
      url: 'https://etherscan.io/tx/0xab579dbf426db0badfaef925504105088f3300b51f1362a4084c57d7e13c0fb1#eventlog',
      date: '2025-08-05',
      description:
        'X Layer stops validating the full L2 state and moves to bridge accounting proofs.',
      type: 'general',
    },
    {
      title: 'X Layer Public Launch',
      url: 'https://x.com/XLayerOfficial/status/1780056275898048562',
      date: '2024-04-16',
      description: 'X Layer is live on mainnet, integrated with Agglayer.',
      type: 'general',
    },
  ],
})
