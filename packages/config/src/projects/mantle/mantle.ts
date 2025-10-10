import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { EIGENDA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('mantle')

export const mantle: ScalingProject = opStackL2({
  addedAt: UnixTime(1680782525), // 2023-04-06T12:02:05Z
  discovery,
  genesisTimestamp: UnixTime(1688314886),
  daProvider: EIGENDA_DA_PROVIDER(false),
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'Mantle',
    slug: 'mantle',
    description:
      'Mantle is a modular general-purpose validium with a protocol design philosophy that aims to offer users a less costly and more user-friendly experience, provide developers with a simpler and more flexible development environment, and deliver a comprehensive set of infrastructure for the next wave of mass-adopted dApps.',
    links: {
      websites: ['https://mantle.xyz/'],
      bridges: ['https://bridge.mantle.xyz'],
      documentation: ['https://docs-v2.mantle.xyz/'],
      explorers: ['https://explorer.mantle.xyz/'],
      repositories: ['https://github.com/mantlenetworkio'],
      socialMedia: [
        'https://discord.gg/0xMantle',
        'https://twitter.com/0xMantle',
        'https://medium.com/0xmantle',
        'https://t.me/mantlenetwork',
      ],
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
      type: 'eigen-da',
      customerId: '0x24f0a3716805e8973bf48eb908d6d4a2f34af785',
      daLayer: ProjectId('eigenda'),
      sinceTimestamp: UnixTime(1738821600),
    },
  ],
  associatedTokens: ['MNT'],
  additionalBadges: [BADGES.Stack.OPSuccinct],
  milestones: [
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
  nonTemplateTechnology: {
    dataAvailability: {
      name: 'Data is posted to EigenDA',
      description:
        'Transactions roots are posted onchain and the full data is posted on EigenDA.  Since the ServiceManager bridge is not used, availability of the data is not verified against EigenDA operators, meaning that the Sequencer can single-handedly publish unavailable commitments. Mantle uses Hokulea, a Rust implementation that provides EigenDA blob derivation for OP stack chains.',
      references: [
        {
          url: 'https://docs.eigenda.xyz/overview',
          title: 'EigenDA Docs - Overview',
        },
        {
          url: 'https://github.com/Layr-Labs/hokulea',
          title: 'Hokulea - EigenDA blob derivation library',
        },
        {
          title: 'Derivation: Batch submission - OP Mainnet specs',
          url: 'https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/derivation.md#batch-submission',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the sequencer posts an unavailable transaction root.',
          isCritical: true,
        },
      ],
    },
  },
  isNodeAvailable: true,
  nodeSourceLink: 'https://github.com/succinctlabs/op-succinct/',
})
