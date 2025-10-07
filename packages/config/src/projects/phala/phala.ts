import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('phala')

export const phala: ScalingProject = opStackL2({
  addedAt: UnixTime(1734388655), // Dec-16-2024 10:37:35 PM UTC
  discovery,
  genesisTimestamp: UnixTime.fromDate(new Date('2024-12-16T22:14:09Z')),
  display: {
    name: 'Phala',
    slug: 'phala',
    description: `Phala is cloud computing protocol which aims at offering developers a secure and efficient platform for deploying and managing AI-ready applications in a trusted environment (TEE).
      Phala rollup on Ethereum leverages the Op-Succinct stack, a combination of OP stack contracts and Zero-Knowledge Proofs (ZK) using the SP1 zkVM.`,
    links: {
      websites: ['https://phala.network/'],
      bridges: ['https://subbridge.io'],
      documentation: ['https://docs.phala.network/'],
      explorers: ['https://explorer.phala.network'],
      repositories: ['https://github.com/Phala-Network/'],
      socialMedia: [
        'https://x.com/PhalaNetwork',
        'https://discord.com/invite/phala-network',
        'https://t.me/phalanetwork',
        'https://phala.network/blog',
      ],
    },
  },
  chainConfig: {
    name: 'phala',
    chainId: 2035,
    explorerUrl: 'https://explorer.phala.network',
    sinceTimestamp: UnixTime.fromDate(new Date('2024-12-16T22:14:09Z')),
    gasTokens: ['ETH'],
    apis: [
      {
        type: 'blockscout',
        url: 'https://explorer.phala.network/api',
      },
      {
        type: 'rpc',
        url: 'https://rpc.phala.network/',
        callsPerMinute: 300,
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
        sinceTimestamp: UnixTime(1734388655),
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
        selector: '0x9ad84880',
        functionSignature:
          'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, uint256 _l1BlockNumber, bytes _proof)',
        sinceTimestamp: UnixTime(1734388655),
        untilTimestamp: UnixTime(1746606971),
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
        selector: '0x59c3e00a', // non-optimistic mode
        functionSignature:
          'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, uint256 _l1BlockNumber, bytes _proof, address _proverAddress)',
        sinceTimestamp: UnixTime(1746606971),
        untilTimestamp: UnixTime(1757405447),
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
        selector: '0x9aaab648', // optimistic mode
        functionSignature:
          'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber)',
        sinceTimestamp: UnixTime(1746606971),
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
        selector: '0xa4ee9d7b', // non-optimistic mode
        functionSignature:
          'function proposeL2Output(bytes32 _configName, bytes32 _outputRoot, uint256 _l2BlockNumber, uint256 _l1BlockNumber, bytes _proof, address _proverAddress)',
        topics: [
          '0xa7aaf2512769da4e444e3de247be2564225c2e7a8f74cfe528e46e17d24868e2', // OutputProposed (for anomaly detection support)
        ],
        sinceTimestamp: UnixTime(1757405447),
      },
    },
  ],
  associatedTokens: ['PHA'],
  additionalBadges: [BADGES.RaaS.Conduit, BADGES.Stack.OPSuccinct],
  milestones: [
    {
      title: 'Plonky3 vulnerability patch',
      url: 'https://x.com/SuccinctLabs/status/1929773028034204121',
      date: '2025-06-04T00:00:00.00Z',
      description:
        'SP1 verifier is patched to fix critical vulnerability in Plonky3 proof system (SP1 dependency).',
      type: 'incident',
    },
    {
      title: 'Phala Network Launch',
      url: 'https://x.com/PhalaNetwork/status/1877052813383184606',
      date: '2025-01-08T00:00:00Z',
      description: 'Phala Network is live on Ethereum mainnet.',
      type: 'general',
    },
  ],
  isNodeAvailable: true,
  nodeSourceLink: 'https://github.com/succinctlabs/op-succinct/',
})
