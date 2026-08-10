import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('swell')
const genesisTimestamp = UnixTime(1732696703)
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

export const swell = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: true,
  },
  addedAt: UnixTime(1734566400), // 2024-12-19T00:00:00Z
  archivedAt: UnixTime(1785940019), // 2026-08-05T14:26:59Z
  discovery,
  genesisTimestamp,
  nonTemplateDaTracking: [
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 21278355, // first batch posted to the inbox
      untilBlock: 22204309, // last batch of this sequencer
      inbox: EthereumAddress('0x005dE5857e38dFD703a1725c0900E9C6f24cbdE0'),
      sequencers: [
        EthereumAddress('0xf854cd5B26bfd73d51236c0122798907Ed65B1f2'),
      ],
    },
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 22204309,
      untilBlock: 25247844, // last batch of this sequencer
      inbox: EthereumAddress('0x005dE5857e38dFD703a1725c0900E9C6f24cbdE0'),
      sequencers: [
        EthereumAddress('0xeb18EA5dEDeE42e7af378991DFEb719D21c17b4C'),
      ],
    },
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 25247844,
      inbox: EthereumAddress('0x005dE5857e38dFD703a1725c0900E9C6f24cbdE0'),
      sequencers: [
        EthereumAddress('0x37804a4f63Ab1dCf96A48B1DCE8c03492f539fE9'),
      ],
    },
  ],
  additionalBadges: [BADGES.RaaS.AltLayer],
  additionalPurposes: ['Restaking'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  associatedTokens: ['WLD'],
  display: {
    name: 'Swellchain',
    slug: 'swell',
    description:
      'Swellchain operates as a restaking-focused Layer 2 network built on the OP Stack. The network aims to extend Ethereum security through EigenLayer restaking while leveraging OP stack proven infrastructure for transaction processing and scalability.',
    links: {
      websites: ['https://swellnetwork.io/'],
      bridges: ['https://app.swellnetwork.io/layer2/swell-l2'],
      documentation: ['https://build.swellnetwork.io/docs'],
      explorers: ['https://explorer.swellnetwork.io/'],
      repositories: ['https://github.com/SwellNetwork'],
      socialMedia: [
        'https://x.com/swellnetworkio',
        'https://discord.com/invite/swellnetworkdao',
        'https://swellnetwork.io/blog',
        'https://t.me/+QvXky2aKNc8yYTI1',
        'https://reddit.com/r/SwellNetwork/',
        'https://linkedin.com/company/swellnetworkio',
      ],
      other: ['https://growthepie.com/chains/swell'],
    },
  },
  stateDerivation: DERIVATION.OPSTACK('SWELL'),
  isNodeAvailable: true,
  chainConfig: {
    name: 'swell',
    chainId: 1923,
    sinceTimestamp: UnixTime(1732696703),
    untilTimestamp: UnixTime(1785940019),
    coingeckoPlatform: 'swellchain',
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.ankr.com/swell',
        callsPerMinute: 300,
      },
    ],
  },
  hasSuperchainScUpgrades: true,
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: EthereumAddress('0xf854cd5B26bfd73d51236c0122798907Ed65B1f2'), // old sequencer
        to: sequencerInbox,
        sinceTimestamp: genesisTimestamp,
        untilTimestamp: UnixTime(1743876083),
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
        sinceTimestamp: UnixTime(1743876083),
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
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xecf3376512EDAcA4FBB63d2c67d12a0397d24121',
      ),
      tokens: ['wstETH'],
      description:
        'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
    }),
  ],
  milestones: [
    {
      title: 'Mainnet full launch',
      url: 'https://www.swellnetwork.io/post/swellchain',
      date: '2024-12-19T00:00:00Z',
      description: 'Swellchain mainnet launches publicly.',
      type: 'general',
    },
  ],
  hasProperSecurityCouncil: true,
})
