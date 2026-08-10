import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('syndicate')

const sequencerInbox = discovery.getContract('SequencerInbox')
const outbox = discovery.getContract('Outbox')
assert(
  sequencerInbox.sinceTimestamp !== undefined &&
    outbox.sinceTimestamp !== undefined,
)
const genesisTimestamp = UnixTime(
  Math.min(sequencerInbox.sinceTimestamp, outbox.sinceTimestamp),
)

export const syndicate: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1773273600), // 2026-03-12T00:00:00Z
  archivedAt: UnixTime(1782813784), // Tue, 30 Jun 2026 10:03:04 GMT
  discovery,
  additionalBadges: [BADGES.RaaS.Alchemy],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  usesEthereumBlobs: true,
  display: {
    name: 'Syndicate Chain',
    slug: 'syndicate',
    description:
      'Syndicate Chain is an Arbitrum Orbit rollup on Ethereum using SYND as its native gas token. It serves as the primary settlement layer for the Syndicate ecosystem.',
    links: {
      websites: ['https://syndicate.io/'],
      bridges: [
        'https://bridge.arbitrum.io/?destinationChain=syndicate-chain&sourceChain=ethereum',
      ],
      documentation: [
        'https://docs.syndicate.io/en/docs/syndicate-chains/syndicate-chain/basic-information',
      ],
      explorers: ['https://explorer.syndicate.io/'],
      repositories: ['https://github.com/SyndicateProtocol'],
      socialMedia: [
        'https://x.com/syndicateio',
        'https://warpcast.com/syndicate',
        'https://discord.gg/syndicate',
      ],
    },
  },
  associatedTokens: ['SYND'],
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
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x6CA109706c6EBe5379c45f20B3311441D50cb711',
      ),
      name: 'ERC20Gateway',
      description:
        'Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.',
      tokens: '*',
    }),
  ],
  isNodeAvailable: 'UnderReview',
  chainConfig: {
    name: 'syndicate',
    gasTokens: ['SYND'],
    chainId: 510,
    explorerUrl: 'https://explorer.syndicate.io',
    sinceTimestamp: UnixTime(1753808975),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.syndicate.io',
        callsPerMinute: 300,
      },
    ],
    untilTimestamp: UnixTime(1782813784), // Tue, 30 Jun 2026 10:03:04 GMT
    multicallContracts: [
      {
        sinceBlock: 1,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
  },
})
