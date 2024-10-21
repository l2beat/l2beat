import { ProjectId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('apechain', 'arbitrum')

export const apechain: Layer3 = orbitStackL3({
  hostChain: ProjectId('arbitrum'),
  badges: [Badge.DA.DAC, Badge.L3ParentChain.Arbitrum, Badge.RaaS.Caldera],
  display: {
    name: 'ApeChain',
    slug: 'apechain',
    description:
      'ApeChain is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It scales $APE and supports the growth of the ApeCoin ecosystem. Powered by the $APE token and the home of assets and games in the ApeCoin ecosystem with development and growth led by Horizen Labs.',
    links: {
      websites: ['https://apechain.com/'],
      apps: ['https://apechain.com/portal'],
      documentation: ['https://docs.apechain.com/'],
      explorers: ['https://apescan.io/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/apecoin',
        'https://discord.gg/apecoindao',
        'https://t.me/apechainofficial',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  rpcUrl: 'https://rpc.apechain.com/http',
  // associatedTokens: ['APE'],
  // nativeToken: 'APE',
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ApeChainMultisig',
      'Can upgrade any system contract and potentially steal all funds.',
    ),
  ],
})
