import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('blessnet')

export const blessnet: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1731061027), // 2024-11-08T10:17:07+00:00
  archivedAt: UnixTime(1739318400), // 2025-02-12T00:00:00.000Z,
  additionalPurposes: ['Interoperability'],
  additionalBadges: [BADGES.RaaS.Caldera],
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
      bridges: [
        'https://blessnet.bridge.caldera.xyz/',
        'https://bless.net/bridge',
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
  // associatedTokens: ['INJ'] // not adding it because it seems to be minted randomly on arbitrum
  // associatedTokens: ['BLESS'],
  untrackedGasTokens: ['BLESS'],
  chainConfig: {
    name: 'blessnet',
    chainId: 45513,
    apis: [
      {
        type: 'rpc',
        url: 'https://blessnet.calderachain.xyz/http',
        callsPerMinute: 300,
      },
    ],
    gasTokens: ['BLESS'],
  },
  hostChain: 'arbitrum',
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  customDa: AnytrustDAC({ discovery, hostChain: 'arbitrum' }),
  milestones: [
    {
      title: '2 months of operator downtime',
      date: '2025-01-24T00:00:00Z',
      url: 'https://arbiscan.io/tx/0x2be551799d320e67a84ba0a80fb5cf6f86d379ad05a849ada0eaab3644e917e1',
      description:
        'The permissioned Operator stopped updating state roots from Jan-24-2025 until Mar-27-2025.',
      type: 'incident',
    },
  ],
})
