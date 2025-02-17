import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL2 } from './templates/orbitStack'

const discovery = new ProjectDiscovery('alephzero')

export const alephzero: Layer2 = orbitStackL2({
  addedAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  discovery,
  additionalBadges: [Badge.DA.DAC, Badge.RaaS.Gelato],
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
      apps: ['https://bridge.gelato.network/bridge/aleph-zero-evm'],
      documentation: ['https://docs.alephzero.org/'],
      explorers: ['https://evm-explorer.alephzero.org/'],
      repositories: ['https://github.com/Cardinal-Cryptography'],
      socialMedia: ['https://x.com/Aleph__Zero'],
    },
  },
  associatedTokens: ['AZERO'],
  gasTokens: ['AZERO'],
  rpcUrl: 'https://rpc.alephzero.raas.gelato.cloud',
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0xccaF21F002EAF230c9Fa810B34837a3739B70F7B'),
      name: 'ERC20Gateway',
      description:
        'Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.',
      tokens: '*',
    }),
  ],
  milestones: [
    {
      title: 'Mainnet launch',
      url: 'https://alephzero.org/blog/aleph-zero-evm-mainnet/',
      date: '2024-08-12T00:00:00Z',
      description: 'Aleph Zero EVM L2 is open for all users.',
      type: 'general',
    },
  ],
  customDa: AnytrustDAC({ discovery }),
})
