import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('alephzero')

export const alephzero: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1723420800), // 2024-08-12T00:00:00Z
  archivedAt: UnixTime(1758278706),
  discovery,
  additionalBadges: [BADGES.RaaS.Gelato],
  additionalPurposes: ['Privacy'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Aleph Zero EVM',
    slug: 'aleph-zero',
    description:
      'Aleph Zero is an Optimium on Ethereum, built on the Orbit stack. It aims to offer seamless interoperability with the Aleph Zero Layer 1 and a suite of developer tools for building privacy-enhancing dapps.',
    links: {
      websites: ['https://alephzero.org/'],
      bridges: ['https://bridge.gelato.network/bridge/aleph-zero-evm'],
      documentation: ['https://docs.alephzero.org/'],
      explorers: ['https://evm-explorer.alephzero.org/'],
      repositories: ['https://github.com/Cardinal-Cryptography'],
      socialMedia: ['https://x.com/Aleph__Zero'],
    },
  },
  associatedTokens: ['AZERO'],
  chainConfig: {
    name: 'alephzero',
    chainId: 41455,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.alephzero.raas.gelato.cloud',
        callsPerMinute: 300,
      },
    ],
    gasTokens: ['AZERO'],
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xccaF21F002EAF230c9Fa810B34837a3739B70F7B',
      ),
      name: 'ERC20Gateway',
      description:
        'Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.',
      tokens: '*',
    }),
  ],
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://alephzero.org/blog/aleph-zero-evm-mainnet/',
      date: '2024-08-12T00:00:00Z',
      description: 'Aleph Zero EVM L2 is open for all users.',
      type: 'general',
    },
  ],
  customDa: AnytrustDAC({ discovery, hostChain: 'ethereum' }),
})
