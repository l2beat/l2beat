import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL2 } from './templates/orbitStack'

const discovery = new ProjectDiscovery('edgeless')

export const edgeless: Layer2 = orbitStackL2({
  addedAt: new UnixTime(1712313901), // 2024-04-05T10:45:01Z
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Edgeless',
    slug: 'edgeless',
    description:
      // edgeless is posting limited data hashes to ethereum (0x88 sequencerVersion), planning to use EigenDA. Currently there is no DA.
      'Edgeless is an Orbit stack general-purpose Optimium without application layer fees. It uses ewETH as the native token, which is a wrapped version of underlying investment strategies.',
    links: {
      websites: ['https://edgeless.network/'],
      apps: ['https://bridge.edgeless.network/'],
      documentation: ['https://docs.edgeless.network/'],
      explorers: ['https://explorer.edgeless.network/'],
      repositories: ['https://github.com/edgelessNetwork'],
      socialMedia: [
        'https://twitter.com/EdgelessNetwork',
        'https://discord.gg/edgeless',
        'https://paragraph.xyz/@edgeless',
        'https://t.me/+f8yhoOg-4cNhYWEx',
      ],
    },
  },
  rpcUrl: 'https://rpc.edgeless.network/http',
  additionalBadges: [Badge.DA.CustomDA, Badge.RaaS.Caldera],
  nonTemplateEscrows: [
    // this is not the bridge escrow itself but the strategy contract that holds all funds backing the ewETH in the canonical bridge escrow. The normal escrow can be used as soon as we track the ewETH token
    {
      address: EthereumAddress('0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b'),
      sinceTimestamp: new UnixTime(1711057199),
      tokens: ['ETH', 'stETH'],
      source: 'external',
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9'),
      sinceTimestamp: new UnixTime(1713942971),
      tokens: ['ETH', 'ezETH'],
      source: 'external',
      chain: 'ethereum',
    },
  ],
  discovery,
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  customDa: AnytrustDAC({ discovery }),
})
