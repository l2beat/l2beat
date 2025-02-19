import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { CELESTIA_DA_PROVIDER, opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('river')

export const river: Layer2 = opStackL2({
  addedAt: new UnixTime(1729867724), // 2024-10-25T17:48:44Z
  additionalBadges: [Badge.RaaS.Caldera, Badge.DA.Celestia],
  discovery,
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  daProvider: CELESTIA_DA_PROVIDER,
  celestiaDa: {
    sinceBlock: 4071540, // first blob in this celestia block https://celenium.io/block/4071540?tab=transactions
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAMod4Sor8Q7yCoU=',
  },
  display: {
    name: 'Towns',
    slug: 'towns',
    description:
      'Towns is an Optimium based on the OP Stack. It is used by the Towns protocol - a protocol for building decentralized real-time messaging apps - acting as its backbone.',
    links: {
      websites: ['https://towns.com/'],
      apps: ['https://app.towns.com/'],
      explorers: ['https://explorer.towns.com/'],
      socialMedia: [
        'https://x.com/townsxyz',
        'https://x.com/TownsProtocol',
        'https://warpcast.com/towns',
      ],
    },
  },
  isNodeAvailable: true,
  rpcUrl: 'https://mainnet.rpc.river.build',
  genesisTimestamp: new UnixTime(1716094800), //first sequencer tx
  milestones: [
    {
      title: 'Move to Celestia DA',
      url: 'https://etherscan.io/tx/0xcaa90f19341d9419b868e976268b6ed2c53e26b1f782f8265c10667a853ac054',
      date: '2025-02-17',
      description: 'The Towns Layer 2 switches from Ethereum to Celestia DA.',
      type: 'general',
    },
    {
      title: 'River Protocol is now Towns Protocol',
      url: 'https://x.com/TownsProtocol/status/1871587022818931001',
      date: '2024-12-25',
      description: 'River Protocol is now Towns Protocol.',
      type: 'general',
    },
  ],
})
