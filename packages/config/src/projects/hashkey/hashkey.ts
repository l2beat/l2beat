import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('hashkey')

const genesisTimestamp = UnixTime(1734347135)
const disputeGameFactory = discovery.getContract('DisputeGameFactory')
const sequencerInbox = ChainSpecificAddress.address(
  discovery.getContractValue<ChainSpecificAddress>(
    'SystemConfig',
    'sequencerInbox',
  ),
)
const sequencerAddress = ChainSpecificAddress.address(
  discovery.getContractValue<ChainSpecificAddress>(
    'SystemConfig',
    'batcherHash',
  ),
)

export const hashkey = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: false,
  },
  addedAt: UnixTime(1736518370), // 2025-01-10T17:09:00Z
  discovery,
  additionalPurposes: ['Exchange'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'HashKey Chain',
    slug: 'hashkey',
    description:
      "HashKey Chain is a regulatory-compliant, institutional-grade OP stack Layer 2 solution bridging traditional finance and Web3. It is powered by Hong Kong's premier virtual asset ecosystem.",
    links: {
      websites: ['https://hsk.xyz/'],
      bridges: ['https://bridge.hsk.xyz/'],
      documentation: ['https://docs.hsk.xyz/'],
      explorers: [
        'https://explorer.hsk.xyz/',
        'https://hashkey.blockscout.com',
      ],
      repositories: ['https://github.com/HashKeyChain'],
      socialMedia: [
        'https://x.com/HashKeyHSK',
        'https://t.me/hashkeyhsk',
        'https://discord.com/invite/ujaF7aKAEk',
      ],
    },
  },
  chainConfig: {
    name: 'hashkey',
    chainId: 177,
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.hsk.xyz',
        callsPerMinute: 300,
      },
    ],
    gasTokens: ['HSK'],
  },
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: EthereumAddress('0x9391791f7CB74F8BFDA65edc0749efd964311b55'), // old sequencer
        to: sequencerInbox,
        sinceTimestamp: genesisTimestamp,
        untilTimestamp: UnixTime(1734347135),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: sequencerAddress,
        to: sequencerInbox,
        sinceTimestamp: UnixTime(1734347135),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(disputeGameFactory.address),
        selector: '0x82ecf2f6',
        functionSignature:
          'function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)',
        sinceTimestamp: genesisTimestamp,
      },
    },
  ],
  associatedTokens: ['HSK'],
  nonTemplateOptimismPortalEscrowTokens: ['HSK'],
  genesisTimestamp,
  stateDerivation: DERIVATION.OPSTACK('HASHKEY'),
  isNodeAvailable: true,
})
