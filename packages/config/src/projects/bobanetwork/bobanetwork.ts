import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('bobanetwork')

export const bobanetwork: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: false,
  },
  addedAt: UnixTime(1632469722), // 2021-09-24T07:48:42Z
  discovery,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Boba Network',
    shortName: 'Boba',
    slug: 'bobanetwork',
    description:
      'Boba is an OP stack Optimistic Rollup built by the Enya team as core contributors to the Boba Foundation.',
    links: {
      websites: ['https://boba.network'],
      bridges: ['https://hub.boba.network/bridge'],
      documentation: ['https://docs.boba.network/'],
      explorers: ['https://bobascan.com/'],
      repositories: ['https://github.com/bobanetwork/boba'],
      socialMedia: [
        'https://boba.network/',
        'https://boba.network/blog/',
        'https://enya.ai/about-us/',
        'https://twitter.com/bobanetwork',
        'https://t.me/bobanetwork',
        'https://discord.com/invite/Hvu3zpFwWd',
      ],
    },
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOneSinceBlock', blockNumber: 1149019 }, // boba L2 bedrock upgrade block number
  },
  genesisTimestamp: UnixTime(1713303530), // boba network anchorage upgrade + 3 timestamp
  associatedTokens: ['BOBA'],
  isNodeAvailable: 'UnderReview',
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xfBd2541e316948B259264c02f370eD088E04c3Db'),
        selector: '0xd0f89344',
        functionSignature: 'function appendSequencerBatch()',
        sinceTimestamp: UnixTime(1635386025),
        untilTimestamp: UnixTime(1713303530),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: EthereumAddress('0xe1B64045351B0B6e9821F19b39f81bc4711D2230'),
        to: EthereumAddress('0xfFF0000000000000000000000000000000000288'),
        sinceTimestamp: UnixTime(1713303530),
        untilTimestamp: UnixTime(1750959851),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xdE7355C971A5B733fe2133753Abd7e5441d441Ec'),
        selector: '0x8ca5cbb9',
        functionSignature:
          'function appendStateBatch(bytes32[] _batch,uint256 _shouldStartAtElement)',
        sinceTimestamp: UnixTime(1635386294),
        untilTimestamp: UnixTime(1713303530),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xbB7aD3f9CCbC94085b7F7B1D5258e59F5F068741'),
        selector: '0x9aaab648',
        functionSignature:
          'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)',
        sinceTimestamp: UnixTime(1713303530),
        untilTimestamp: UnixTime(1750959851),
      },
    },
    // move to opfp / optiportal 2
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: EthereumAddress('0xA4eD58737Fc5C4861C33410c29ECb1E2AF29d960'),
        to: EthereumAddress('0xfFF0000000000000000000000000000000000288'),
        sinceTimestamp: UnixTime(1750959851),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xF45a5f1e36fCeA3Cc830A98c6c3C5ceA7d6af852'),
        selector: '0x82ecf2f6',
        functionSignature:
          'function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)',
        sinceTimestamp: UnixTime(1750959851),
      },
    },
  ],
  milestones: [
    {
      title: 'Boba Anchorage Upgrade',
      date: '2024-04-16T00:00:00Z',
      url: 'https://forum.boba.network/t/upgrade-boba-network-to-the-anchorage-framework/442',
      description:
        'Boba upgrades to Bedrock (OP Stack) and to EIP-4844 data blobs for L1 data availability.',
      type: 'general',
    },
    {
      title: 'Boba launches L2 on BNB',
      date: '2022-11-01T00:00:00Z',
      url: 'https://boba.network/education/multichain/bobabnb/',
      description: 'Boba launches on BnB.',
      type: 'general',
    },
    {
      title: 'Boba launches L2 on Avalanche',
      date: '2022-09-21T00:00:00Z',
      url: 'https://medium.com/avalancheavax/boba-launches-the-first-l2-on-avalanche-107d9166dc06',
      description: 'Boba launches on Avalanche.',
      type: 'general',
    },
    {
      title: 'Boba launches L2 on Moonbeam and Fantom',
      date: '2022-06-02T00:00:00Z',
      url: 'https://boba.network/education/boba-basics/multichain/',
      description: 'Boba launches on Moonbeam and Fantom.',
      type: 'general',
    },
    {
      title: 'Call data compression',
      date: '2022-10-08T00:00:00Z',
      url: 'https://boba.network/blog/boba-call-data-compression/',
      description:
        'The Boba Tree From (v0.1.0) release introduces Brotli compression for call data.',
      type: 'general',
    },
    {
      title: 'Hybrid Compute',
      date: '2022-03-18T00:00:00Z',
      url: 'https://boba.network/education/boba-basics/hybrid-compute/',
      description:
        "Boba's proprietary technology enables dApps that trigger code executed on web-scale infrastructure.",
      type: 'general',
    },
    {
      title: 'Mainnet Launch',
      date: '2021-09-20T00:00:00Z',
      url: 'https://www.firstraysvc.com/news/enya-launches-mainnet-beta-boba-network',
      description:
        'Layer 2 Optimistic Rollup based on the Optimism codebase is live on Ethereum.',
      type: 'general',
    },
    {
      title: 'BOBA Token launched',
      date: '2021-11-18T00:00:00Z',
      url: 'https://x.com/bobanetwork/status/1461839296785051648',
      description: 'BOBA token launched by OMG Foundation.',
      type: 'general',
    },
  ],
  chainConfig: {
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 446859,
        version: '3',
      },
    ],
    name: 'bobanetwork',
    chainId: 288,
    explorerUrl: 'https://eth.bobascan.com',
    coingeckoPlatform: 'boba',
    // ~ Timestamp of block number 1
    sinceTimestamp: UnixTime.fromDate(new Date('2021-10-28T03:57:19Z')),
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.boba.network/',
        callsPerMinute: 300,
      },
      {
        type: 'routescan',
        url: 'https://api.routescan.io/v2/network/mainnet/evm/288/etherscan/api/',
      },
    ],
  },
})
