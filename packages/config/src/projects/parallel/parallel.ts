import {
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('parallel')

export const parallel: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1704289654), // 2024-01-03T13:47:34Z
  archivedAt: UnixTime(1733356800), // 2024-12-05T00:00:00.000Z,
  discovery,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Parallel',
    slug: 'parallel',
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    headerWarning:
      'Parallel is [deprecating their Orbit stack Layer 2](https://medium.com/@ParallelFi/the-withdrawal-on-parallel-l2-is-now-available-c3b4b572864e).',
    description:
      'Parallel is an Ethereum L2 solution utilizing Arbitrum Nitro technology.',
    links: {
      websites: ['https://parallel.fi'],
      bridges: ['https://parallel.fi/airdrop'],
      documentation: ['https://docs.parallel.fi/parallel-chain/overview'],
      explorers: [
        'https://explorerl2new-surprised-harlequin-bonobo-fvcy2k9oqh.t.conduit.xyz/',
      ],
      socialMedia: [
        'https://twitter.com/ParallelFi',
        'https://discord.gg/rdjVz8zavF',
        'https://t.me/parallelfi_community',
      ],
    },
  },
  trackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xb4795A0edae98d7820C37F06f6b858e7acb51DF8'),
        selector: '0x8f111f3c',
        functionSignature:
          'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: UnixTime(1704125939),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xb4795A0edae98d7820C37F06f6b858e7acb51DF8'),
        selector: '0x6f12b0c9',
        functionSignature:
          'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder)',
        sinceTimestamp: UnixTime(1704125939),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xb4795A0edae98d7820C37F06f6b858e7acb51DF8'),
        selector: '0xe0bc9729',
        functionSignature:
          'function addSequencerL2Batch(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: UnixTime(1704125939),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xb4795A0edae98d7820C37F06f6b858e7acb51DF8'),
        selector: '0x3e5aa082',
        functionSignature:
          'function addSequencerL2BatchFromBlobs(uint256 sequenceNumber,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: UnixTime(1712861435),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0xb6e0586616ebe79b2f86ddb32048c500d23b3ac3'),
        selector: '0xa04cee60',
        functionSignature:
          'function updateSendRoot(bytes32 root, bytes32 l2BlockHash) external',
        sinceTimestamp: UnixTime(1704125939),
      },
    },
  ],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d',
      ),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xa1c86E2362dba0525075622af6d5f739B1304D45',
      ),
      tokens: '*',
      source: 'external',
      description:
        'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
    }),
  ],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  chainConfig: {
    name: 'parallel',
    chainId: 1024,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.parallel.fi',
        callsPerMinute: 120,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  milestones: [
    {
      title: 'ArbOS v20 upgrade',
      url: 'https://forum.arbitrum.foundation/t/aip-arbos-version-20-atlas/20957',
      date: '2024-04-10T00:00:00.00Z',
      description:
        'Introduces EIP-4844 data blobs for L1 data availability and Dencun-related opcodes on L2.',
      type: 'general',
    },
    {
      title: 'Parallel Mainnet closed launch',
      url: 'https://twitter.com/ParallelFi/status/1743048283684237574',
      date: '2024-01-05T00:00:00Z',
      description: 'Parallel Mainnet is open for developers.',
      type: 'general',
    },
  ],
})
