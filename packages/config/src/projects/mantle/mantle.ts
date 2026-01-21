import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('mantle')

export const mantle: ScalingProject = opStackL2({
  addedAt: UnixTime(1680782525), // 2023-04-06T12:02:05Z
  discovery,
  genesisTimestamp: UnixTime(1688314886),
  display: {
    name: 'Mantle',
    slug: 'mantle',
    description:
      'Mantle is a ZK Rollup based on the OP Stack that uses SP1 proofs for state validation. It aims to offer users a less costly and more user-friendly experience, provide developers with a simpler and more flexible development environment, and deliver a comprehensive set of infrastructure for the next wave of mass-adopted dApps.',
    links: {
      websites: ['https://mantle.xyz/'],
      bridges: ['https://bridge.mantle.xyz'],
      documentation: ['https://docs-v2.mantle.xyz/'],
      explorers: ['https://explorer.mantle.xyz/'],
      repositories: ['https://github.com/mantlenetworkio'],
      socialMedia: [
        'https://discord.gg/0xMantle',
        'https://x.com/Mantle_Official',
        'https://medium.com/0xmantle',
        'https://t.me/mantlenetwork',
      ],
      other: ['https://growthepie.com/chains/mantle'],
    },
  },
  nonTemplateExcludedTokens: ['SolvBTC', 'SolvBTC.BBN', 'FBTC'],
  nonTemplateOptimismPortalEscrowTokens: ['MNT'],
  chainConfig: {
    name: 'mantle',
    chainId: 5000,
    explorerUrl: 'https://explorer.mantle.xyz',
    sinceTimestamp: UnixTime(1688314886),
    gasTokens: ['MNT'],
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 304717,
        version: '3',
      },
    ],
    coingeckoPlatform: 'mantle',
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.mantle.xyz',
        callsPerMinute: 300,
      },
      {
        type: 'blockscout',
        url: 'https://explorer.mantle.xyz/api',
      },
    ],
  },
  nonTemplateProofSystem: {
    type: 'Validity',
    zkCatalogId: ProjectId('sp1'),
  },
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: ChainSpecificAddress.address(
          ChainSpecificAddress(
            discovery.getContractValue('SystemConfig', 'batcherHash'),
          ),
        ),
        to: ChainSpecificAddress.address(
          ChainSpecificAddress(
            discovery.getContractValue('SystemConfig', 'sequencerInbox'),
          ),
        ),
        sinceTimestamp: UnixTime(1688314886),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(
          discovery.getContract('OPSuccinctL2OutputOracle').address,
        ),
        selector: '0x9aaab648', // optimistic mode (since genesis now disabled, optimistic mode toggle can reactivate it)
        functionSignature:
          'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber)',
        sinceTimestamp: UnixTime(1688314886),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(
          discovery.getContract('OPSuccinctL2OutputOracle').address,
        ),
        selector: '0x9ad84880', // non-optimistic mode
        functionSignature:
          'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, uint256 _l1BlockNumber, bytes _proof)',
        sinceTimestamp: UnixTime(1758008591),
      },
    },
  ],
  nonTemplateDaTracking: [
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: discovery.getContract('SystemConfig').sinceBlock ?? 0,
      inbox: ChainSpecificAddress.address(
        discovery.getContractValue('SystemConfig', 'sequencerInbox'),
      ),
      sequencers: [
        ChainSpecificAddress.address(
          discovery.getContractValue('SystemConfig', 'batcherHash'),
        ),
      ],
    },
    {
      type: 'eigen-da',
      customerId: '0x24f0a3716805e8973bf48eb908d6d4a2f34af785',
      daLayer: ProjectId('eigenda'),
      sinceTimestamp: UnixTime(1738821600),
      untilTimestamp: UnixTime(1768986539),
    },
  ],
  associatedTokens: ['MNT'],
  additionalBadges: [BADGES.Stack.OPSuccinct],
  milestones: [
    {
      title: 'Migration to Ethereum blobs',
      url: 'https://etherscan.io/tx/0x7234302dd8c359a14681a03f1d948369d45c00fd4a61683c449839f051e4ddb8',
      date: '2026-01-21T09:08:59.00Z',
      description:
        'Mantle moves to the Rollup category by switching data availability from EigenDA to Ethereum blobs.',
      type: 'general',
    },
    {
      title: 'Upgrade to OP Succinct',
      url: 'https://x.com/Mantle_Official/status/1967936628678430965',
      date: '2025-09-16T00:00:00.00Z',
      description:
        'Mantle upgrades to OP Succinct, integrating ZK proofs for state validation.',
      type: 'general',
    },
    {
      title: 'Move to EigenDA',
      url: 'https://github.com/mantlenetworkio/mantle-v2/releases/tag/v1.1.1',
      date: '2025-03-19T00:00:00.00Z',
      description:
        'Mantle deactivates MantleDA and data availability migrates to EigenDA.',
      type: 'general',
    },
    {
      title: 'Mainnet Launch',
      url: 'https://www.mantle.xyz/blog/announcements/mantle-network-mainnet-alpha',
      date: '2023-07-14T00:00:00.00Z',
      description: 'Mantle is live on mainnet.',
      type: 'general',
    },
    {
      title: 'Mainnet v2 Tectonic Upgrade',
      url: 'https://www.mantle.xyz/blog/announcements/mantle-completes-mainnet-v2-tectonic-upgrade',
      date: '2024-03-15T00:00:00.00Z',
      description: 'Mantle completes Mainnet v2 Tectonic Upgrade.',
      type: 'general',
    },
    {
      title: 'MNT token migration begins',
      url: 'https://www.mantle.xyz/blog/announcements/bit-to-mnt-user-guide',
      date: '2023-07-11T00:00:00.00Z',
      description: 'Users can exchange their BIT tokens to MNT tokens.',
      type: 'general',
    },
  ],
  isNodeAvailable: true,
  nodeSourceLink: 'https://github.com/succinctlabs/op-succinct/',
})
