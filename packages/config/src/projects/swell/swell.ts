import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, ESCROW, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('swell')
const genesisTimestamp = UnixTime(1732696703)
const disputeGameFactory = discovery.getContract('DisputeGameFactory')
const sequencerInbox = discovery.getContractValue<EthereumAddress>(
  'SystemConfig',
  'sequencerInbox',
)
const sequencerAddress = discovery.getContractValue<EthereumAddress>(
  'SystemConfig',
  'batcherHash',
)

export const swell = opStackL2({
  addedAt: UnixTime(1734566400), // 2024-12-19T00:00:00Z
  discovery,
  genesisTimestamp,
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
      ],
    },
  },
  finality: {
    type: 'OPStack',
    minTimestamp: UnixTime(1732701647),
    genesisTimestamp: UnixTime(1732696703),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  stateDerivation: DERIVATION.OPSTACK('SWELL'),
  isNodeAvailable: true,
  chainConfig: {
    name: 'swell',
    chainId: 1923,
    sinceTimestamp: UnixTime(1732696703),
    coingeckoPlatform: 'swellchain',
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.ankr.com/swell',
        callsPerMinute: 1500,
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
        address: disputeGameFactory.address,
        selector: '0x82ecf2f6',
        functionSignature:
          'function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)',
        sinceTimestamp: genesisTimestamp,
      },
    },
  ],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0xecf3376512EDAcA4FBB63d2c67d12a0397d24121'),
      tokens: ['wstETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
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
