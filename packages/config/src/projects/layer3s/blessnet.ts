import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'

const discovery = new ProjectDiscovery('blessnet', 'arbitrum')

export const blessnet: Layer3 = orbitStackL3({
  addedAt: new UnixTime(1731061027), // 2024-11-08T10:17:07+00:00
  additionalPurposes: ['Interoperability'],
  additionalBadges: [Badge.RaaS.Caldera, Badge.DA.DAC],
  isArchived: true,
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Blessnet',
    slug: 'blessnet',
    description:
      'Blessnet is an Orbit stack Optimium aiming to create a more interconnected and efficient Ethereum ecosystem, where users can interact safely across multiple chains while keeping their valuable assets secure on established networks.',
    links: {
      websites: ['https://bless.net/'],
      apps: [
        'https://blessnet.bridge.caldera.xyz/',
        'https://bridge.bless.net/',
      ],
      documentation: ['https://docs.bless.net/'],
      explorers: ['https://scan.bless.net/'],
      repositories: ['https://github.com/bless-net'],
      socialMedia: ['https://x.com/blessdotnet'],
    },
  },
  // nonTemplateEscrows: [ // not deployed
  //   discovery.getEscrowDetails({
  //     address: EthereumAddress('0xd24494e21d236eE476eE44780eAd80ef41EAF934'),
  //     name: 'ERC20Gateway',
  //     description:
  //       'Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.',
  //     tokens: '*',
  //   }),
  //   discovery.getEscrowDetails({
  //     address: EthereumAddress('0xA40E89aa4c221FFb45202bBf3c4eC69340B361d0'),
  //     name: 'CustomGateway',
  //     description:
  //       'Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.',
  //     source: 'external',
  //     tokens: '*',
  //   }),
  // ],
  // gasTokens: ['INJ'],
  // associatedTokens: ['INJ'] // not adding it because it seems to be minted randomly on arbitrum
  // gasTokens: ['BLESS'], // not on CG
  // associatedTokens: ['BLESS'],
  rpcUrl: 'https://blessnet.calderachain.xyz/http',
  discovery,
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  customDa: AnytrustDAC({ discovery }),
})
