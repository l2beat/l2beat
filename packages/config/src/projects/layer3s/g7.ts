import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ESCROW, REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'

const discovery = new ProjectDiscovery('game7', 'arbitrum')

const L1OrbitERC20Gateway = discovery.getContract('L1OrbitERC20Gateway')

export const g7: Layer3 = orbitStackL3({
  addedAt: new UnixTime(1738899615),
  discovery,
  additionalBadges: [
    Badge.DA.DAC,
    Badge.L3ParentChain.Arbitrum,
    Badge.RaaS.Conduit,
  ],
  additionalPurposes: ['Gaming'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Game7',
    slug: 'g7',
    description:
      'Game7 is a DAO initiated by BitDAO and Forte to accelerate the adoption of sustainable, web3-native gaming.',
    links: {
      websites: ['https://game7.io/'],
      documentation: ['https://docs.game7.io/'],
      apps: ['https://build.game7.io/bridge'],
      explorers: ['https://mainnet.game7.io'],
      repositories: ['https://github.com/G7DAO'],
      socialMedia: [
        'https://discord.gg/g7dao',
        'https://x.com/G7_DAO',
        'https://mirror.xyz/0x17D15C35b9c50032eE98f5730934ff85F9c16acA',
        'https://youtube.com/@G7_DAO',
      ],
    },
  },
  rpcUrl: 'https://mainnet-rpc.game7.io',
  associatedTokens: ['G7'],
  gasTokens: ['G7'],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: L1OrbitERC20Gateway.address,
      name: L1OrbitERC20Gateway.name,
      description: L1OrbitERC20Gateway.description,
      tokens: '*',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x404922a9B29b4a5205a6074AbA31A7392BD28944'),
      tokens: ['USDC'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description: 'Main entry point for users depositing USDC.',
    }),
  ],
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  milestones: [
    {
      title: 'G7 Mainnet launch',
      url: 'https://x.com/G7_DAO/status/1886897963353694319',
      date: '2025-02-04T00:00:00Z',
      description: 'G7 Network Mainnet is live.',
      type: 'general',
    },
  ],
  customDa: AnytrustDAC({ discovery }),
})
