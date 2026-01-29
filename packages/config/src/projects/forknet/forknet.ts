import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { agglayer } from '../../templates/agglayer'

const discovery = new ProjectDiscovery('forknet')
const bridge = discovery.getContract('AgglayerBridge')

const opgenesisTimestamp = UnixTime(1756159379)

const sequencerInbox = discovery.getContractValue<ChainSpecificAddress>(
  'SystemConfig',
  'sequencerInbox',
)

const inboxStartBlock =
  discovery.getContractValueOrUndefined<number>('SystemConfig', 'startBlock') ??
  0

const sequencer = discovery.getContractValue<ChainSpecificAddress>(
  'SystemConfig',
  'batcherHash',
)

// const disputeGameFactory = discovery.getContract('DisputeGameFactory')

export const forknet: ScalingProject = agglayer({
  capability: 'universal',
  addedAt: UnixTime(1756724480), // 2025-09-01T12:01:20Z
  display: {
    name: 'Forknet',
    slug: 'forknet',
    description:
      'An onchain order book DEX for spot and perpetuals, built on CDK OP Stack and natively integrated with Agglayer for unified liquidity.',
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://forknet.io/'],
      bridges: ['https://bridge.forknet.io/'],
      explorers: ['https://forkscan.org'],
      socialMedia: ['https://x.com/forknet_io'],
    },
  },
  chainConfig: {
    name: 'forknet',
    chainId: 8338,
    explorerUrl: 'https://forkscan.org',
    sinceTimestamp: UnixTime(1756893611),
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet-rpc-1.forknet.io',
        callsPerMinute: 300,
      },
    ],
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      sinceTimestamp: UnixTime(1756893611),
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherPreminted',
        premintedAmount: '340282366920938463463374607431768211455',
      },
    }),
  ],
  usesEthereumBlobs: true,
  milestones: [
    {
      title: 'Forknet Launch',
      url: 'https://x.com/forknet_io/status/1971221046377234734',
      date: '2024-09-25',
      description: 'Forknet is live on mainnet, integrated with Agglayer.',
      type: 'general',
    },
  ],
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: ChainSpecificAddress.address(sequencer),
        to: ChainSpecificAddress.address(sequencerInbox),
        sinceTimestamp: opgenesisTimestamp,
      },
    },
    // does not post state updates for whatever reason
    // {
    //   uses: [
    //     { type: 'liveness', subtype: 'stateUpdates' },
    //     { type: 'l2costs', subtype: 'stateUpdates' },
    //   ],
    //   query: {
    //     formula: 'functionCall',
    //     address: ChainSpecificAddress.address(disputeGameFactory.address),
    //     selector: '0x82ecf2f6',
    //     functionSignature:
    //       'function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)',
    //     sinceTimestamp: opgenesisTimestamp,
    //   },
    // },
  ],
  nonTemplateDaTracking: [
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: inboxStartBlock,
      inbox: ChainSpecificAddress.address(sequencerInbox),
      sequencers: [ChainSpecificAddress.address(sequencer)],
    },
  ],
  discovery,
})
