import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { ScalingProjectPermissionedAccount } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('xai', 'arbitrum')

const roles = discovery.getContractValue<{
  EXECUTOR_ROLE: { members: string[] }
}>('UpgradeExecutor', 'accessControl')

const MultisigExecutor: ScalingProjectPermissionedAccount = {
  address: EthereumAddress(roles.EXECUTOR_ROLE.members[0]),
  type: 'MultiSig',
}

export const xai: Layer3 = orbitStackL3({
  discovery,
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Xai',
    slug: 'xai',
    description:
      'Xai is an Ethereum Layer-3 that leverages Arbitrum AnyTrust to enable open trade in the next generation of video games.',
    purposes: ['Gaming'],
    links: {
      websites: ['https://xai.games/'],
      apps: [],
      documentation: ['https://xai-foundation.gitbook.io/xai-network/'],
      explorers: [],
      repositories: ['https://github.com/OffchainLabs/nitro'],
      socialMedia: [
        'https://twitter.com/xai_games',
        'https://t.me/XaiSentryNodes',
        'https://discord.gg/xaigames',
      ],
    },
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  associatedTokens: ['XAI'],
  nativeToken: 'XAI',
  nonTemplatePermissions: [
    {
      name: 'RollupOwner',
      accounts: [MultisigExecutor],
      description:
        'Multisig that can execute upgrades via the UpgradeExecutor.',
    },
  ],
  milestones: [
    {
      name: 'XAI Mainnet Launch',
      link: 'https://x.com/XAI_GAMES/status/1744815749410242568',
      date: '2024-01-09T00:00:00Z',
      description: 'XAI launches on Arbitrum One.',
    },
  ],
})
