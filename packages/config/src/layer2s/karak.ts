import { UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CELESTIA_DA_PROVIDER, opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('karak')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const karak: Layer2 = opStackL2({
  daProvider: CELESTIA_DA_PROVIDER,
  discovery,
  display: {
    name: 'Karak',
    slug: 'karak',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description: 'Karak is a general-purpose Optimium.',
    purposes: ['Universal'],
    links: {
      websites: ['https://karak.network/'],
      apps: ['https://karak.network/karak-xp/'],
      documentation: [
        'https://docs.karak.network/karak/general/karak-overview',
      ],
      explorers: ['https://explorer.karak.network/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/Karak_Network',
        'https://t.me/Karak_Network',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  upgradeability,
  rpcUrl: 'https://rpc.karak.network/',
  finality: {
    type: 'OPStack',
    lag: 0,
  },
  genesisTimestamp: new UnixTime(1703226695), //First sequencer transaction
  isNodeAvailable: true,
  milestones: [
    {
      name: 'Karak Network Early Access Launch',
      link: 'https://x.com/Karak_Network/status/1762561646999068899?s=20',
      date: '2024-02-27T00:00:00Z',
      description: 'Karak Network is live on mainnet.',
    },
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'KarakMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Challenger and Guardian of the OptimismPortal, meaning it can halt withdrawals and change incorrect state roots. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
  ],
})
