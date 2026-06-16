import { assert, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('parallel')

const sequencerInbox = discovery.getContract('SequencerInbox')
const outbox = discovery.getContract('Outbox')
assert(
  sequencerInbox.sinceTimestamp !== undefined &&
    outbox.sinceTimestamp !== undefined,
)
const genesisTimestamp = UnixTime(
  Math.min(sequencerInbox.sinceTimestamp, outbox.sinceTimestamp),
)

export const parallel: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1704289654), // 2024-01-03T13:47:34Z
  archivedAt: UnixTime(1733356800), // 2024-12-05T00:00:00.000Z,
  discovery,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Parallel',
    slug: 'parallel',
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
        'https://discord.com/invite/parallelfi',
        'https://t.me/parallelfi_community',
      ],
    },
  },
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
  sequencerInbox,
  additionalTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(sequencerInbox.address),
        selector: '0x3e5aa082',
        functionSignature:
          'function addSequencerL2BatchFromBlobs(uint256 sequenceNumber,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
        sinceTimestamp: genesisTimestamp,
      },
    },
  ],
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
