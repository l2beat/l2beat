import {
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { agglayer } from '../../templates/agglayer'

const discovery = new ProjectDiscovery('polygonzkevm')
const bridge = discovery.getContract('AgglayerBridge')

const chainId = 1101

export const polygonzkevm: ScalingProject = agglayer({
  capability: 'universal',
  addedAt: UnixTime(1679651674), // 2023-03-24T09:54:34Z
  display: {
    name: 'Polygon zkEVM',
    slug: 'polygonzkevm',
    description: 'Polygon zkEVM is an EVM-compatible L2 built by Polygon Labs.',
    links: {
      websites: ['https://polygon.technology/polygon-zkevm'],
      bridges: ['https://portal.polygon.technology/bridge'],
      documentation: ['https://docs.polygon.technology/zkEVM/'],
      explorers: ['https://zkevm.polygonscan.com/'],
      repositories: [
        'https://github.com/0xPolygon/zkevm-node',
        'https://github.com/0xPolygon/',
      ],
      socialMedia: [
        'https://x.com/0xPolygon',
        'https://t.me/polygonofficial',
        'https://reddit.com/r/0xPolygon/',
        'https://discord.com/invite/0xPolygonCommunity',
        'https://discord.com/invite/0xpolygonRnD',
        'https://polygon.technology/blog',
      ],
      other: [
        'https://rollup.codes/polygon-zkevm',
        'https://growthepie.com/chains/polygon-zkevm',
      ],
    },
  },
  discovery,
  associatedTokens: ['POL', 'MATIC'],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherPreminted',
        premintedAmount: '200000000000000000000000000',
      },
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB',
      ),
      tokens: ['USDC'],
      description:
        'Custom Bridge escrow for USDC bridged to PolygonZkEVM allowing for a custom L2 tokens contract.',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01',
      ),
      tokens: ['wstETH'],
      description:
        'Custom Bridge escrow for wstETH bridged to PolygonZkEVM allowing for a custom L2 tokens contract.',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98',
      ),
      tokens: ['DAI', 'sDAI'],
      description:
        'Custom Bridge escrow for DAI bridged to PolygonZkEVM allowing for a custom L2 tokens contract.',
    }),
  ],
  chainConfig: {
    name: 'polygonzkevm',
    chainId,
    explorerUrl: 'https://zkevm.polygonscan.com',
    coingeckoPlatform: 'polygon-zkevm',
    sinceTimestamp: UnixTime(1679679015),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 57746,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://polygon-rpc.com/zkevm',
        callsPerMinute: 500,
      },
      { type: 'etherscan', chainId },
      { type: 'blockscoutV2', url: 'https://zkevm.blockscout.com/api/v2' },
    ],
  },
  milestones: [
    {
      title: 'Migration to Pessimistic Proofs',
      url: 'https://etherscan.io/tx/0xd8eb9f7bf7594d047e0c8b254b3893eb05daf692b1688adaacd21af144efe2a5#eventlog',
      date: '2025-12-03',
      description:
        'Polygon zkEVM stops validating the full L2 state and moves to bridge accounting proofs.',
      type: 'general',
    },
    {
      title: 'Polygon zkEVM Etrog upgrade',
      url: 'https://docs.polygon.technology/zkEVM/architecture/protocol/etrog-upgrade/#etrog-upgrade',
      date: '2024-02-13',
      description: 'Polygon zkEVM is upgraded to the Polygon Etrog version.',
      type: 'general',
    },
    {
      title: 'Polygon zkEVM Mainnet Beta is Live',
      url: 'https://polygon.technology/blog/polygon-zkevm-mainnet-beta-is-live?utm_source=twitter&utm_medium=social&utm_campaign=zkevm-launch&utm_term=mainnet-beta-live&utm_content=blog',
      date: '2023-03-27T00:00:00Z',
      description: 'Polygon zkEVM public beta launched.',
      type: 'general',
    },
  ],
})