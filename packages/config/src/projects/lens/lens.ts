import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const discovery = new ProjectDiscovery('lens')
const chainId = 232
const trackedTxsSince = UnixTime(1742928599)
const bridge = discovery.getContract('L1NativeTokenVault')

export const lens: ScalingProject = zkStackL2({
  capability: 'universal',
  additionalPurposes: ['Social'],
  additionalBadges: [BADGES.DA.AvailVector],
  addedAt: UnixTime(1716536821), // 2024-05-24T07:47:01Z
  display: {
    name: 'Lens',
    slug: 'lens',
    description:
      "Lens Network is the main social networking hub for the user base of Lens Protocol, built on a Validium using ZKsync's ZK Stack technology.",
    architectureImage: 'zkstack-validium-vector',
    links: {
      websites: ['https://lens.xyz'],
      bridges: [
        'https://app.across.to/bridge?destinationChainId=232',
        'https://onboarding.lens.xyz/explore',
      ],
      documentation: ['https://lens.xyz/docs'],
      explorers: [
        'https://momoka.lens.xyz',
        'https://explorer.lens.xyz/',
        'https://lenscan.io/',
      ],
      repositories: ['https://github.com/lens-protocol'],
      socialMedia: [
        'https://hey.xyz/u/lens',
        'https://x.com/LC',
        'https://discord.com/invite/lensprotocol',
      ],
    },
  },
  discovery,
  diamondContract: discovery.getContract('LensZkEvm'),
  chainConfig: {
    name: 'lens',
    chainId,
    explorerUrl: '',
    sinceTimestamp: UnixTime(1740140786),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.lens.xyz',
        callsPerMinute: 300,
      },
    ],
    gasTokens: ['LGHO'],
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: ['LGHO', 'ETH'],
      description:
        'Shared bridge for depositing tokens to Lens and other ZK stack chains.',
      sharedEscrow: {
        type: 'ElasticChain',
        l2BridgeAddress: EthereumAddress(
          '0x8116A750e2091B2bA0D94223e7b20a6A65A279f4',
        ),
        l2EtherAddress: EthereumAddress(
          '0xE5ecd226b3032910CEaa43ba92EE8232f8237553',
        ),
        tokensToAssignFromL1: ['LGHO'],
      },
    }),
  ],
  daProvider: {
    layer: DA_LAYERS.AVAIL,
    riskView: RISK_VIEW.DATA_AVAIL(true),
    technology: {
      ...TECHNOLOGY_DATA_AVAILABILITY.AVAIL_OFF_CHAIN(true),
      references: [
        {
          title: 'AvailL1DAValidator - checkDA() function',
          url: 'https://etherscan.io/address/0x8f50d93B9955B285f787043B30B5F51D09bE0120#code#F1#L16',
        },
      ],
    },
    bridge: DA_BRIDGES.VECTOR,
  },
  availDa: {
    sinceBlock: 1180000, // avail block number, roughly 04/03 right before mainnet launch (chain was active before)
    appIds: ['26'],
  },
  nonTemplateTrackedTxs: [
    {
      uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
      query: {
        formula: 'sharedBridge',
        firstParameter: chainId,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0x98f81962',
        functionSignature:
          'function commitBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: trackedTxsSince,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'proofSubmissions' },
        { type: 'l2costs', subtype: 'proofSubmissions' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: chainId,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0xe12a6137',
        functionSignature:
          'function proveBatchesSharedBridge(uint256 _chainId, uint256, uint256, bytes)',
        sinceTimestamp: trackedTxsSince,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'sharedBridge',
        firstParameter: chainId,
        address: EthereumAddress('0x8c0bfc04ada21fd496c55b8c50331f904306f564'),
        selector: '0xcf02827d',
        functionSignature:
          'function executeBatchesSharedBridge(uint256 _chainId, uint256 _processBatchFrom, uint256 _processBatchTo, bytes)',
        sinceTimestamp: trackedTxsSince,
      },
    },
  ],
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  milestones: [
    {
      title: 'Upgrade to Vector DA Bridge',
      url: 'https://etherscan.io/tx/0x2e3912d3ae33abe684199823322702094a610681ab982b76f2cfc0c7ef34d87f', // TODO better announcement link
      date: '2025-04-23T00:00:00.00Z',
      description:
        'Lens integrates with the Vector data availability bridge to Avail.',
      type: 'general',
    },
    {
      title: 'Mainnet Launch',
      url: 'https://lens.xyz/news/build-socialfi-apps-faster-with-lens-now-on-mainnet',
      date: '2025-04-04T00:00:00Z',
      description: 'Lens mainnet launches for all users.',
      type: 'general',
    },
  ],
})
