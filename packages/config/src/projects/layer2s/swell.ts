import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, ESCROW, REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('swell')
const genesisTimestamp = new UnixTime(1732696703)

export const swell = opStackL2({
  addedAt: new UnixTime(1712341625), // 2024-04-05T18:27:05Z
  discovery,
  genesisTimestamp,
  additionalBadges: [Badge.RaaS.AltLayer],
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
      apps: ['https://app.swellnetwork.io/layer2/swell-l2'],
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
  rpcUrl: 'https://rpc.ankr.com/swell',
  finality: {
    type: 'OPStack',
    minTimestamp: new UnixTime(1732701647),
    genesisTimestamp: new UnixTime(1732696703),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  stateDerivation: DERIVATION.OPSTACK('SWELL'),
  isNodeAvailable: true,
  chainConfig: {
    name: 'swell',
    chainId: 1923,
    // coingeckoPlatform: '',
    minTimestampForTvl: new UnixTime(1732696703),
  },
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
