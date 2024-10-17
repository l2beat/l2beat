import { assert, ProjectId } from '@l2beat/shared-pure'

import { subtractOne } from '../../common/assessCount'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('popboss', 'arbitrum')

export const popboss: Layer3 = orbitStackL3({
  badges: [Badge.DA.DAC, Badge.L3ParentChain.Arbitrum, Badge.RaaS.Conduit],
  additionalPurposes: ['Gaming'],
  discovery,
  hostChain: ProjectId('arbitrum'),
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  display: {
    name: 'Proof of Play Boss',
    shortName: 'PoP Boss',
    slug: 'popboss',
    description:
      'Proof of Play Boss is a gaming-focused L3 settling on Arbitrum using the Orbit Stack and AnyTrust DA. It is the second L3 built by Proof of Play.',
    links: {
      websites: ['https://proofofplay.com/'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=pop-boss&sourceChain=arbitrum-one',
        'https://piratenation.game/',
      ],
      documentation: [],
      explorers: ['https://explorer.boss.proofofplay.com'],
      repositories: ['https://github.com/proofofplay'],
      socialMedia: [
        'https://x.com/ProofOfPlay/',
        'https://discord.com/invite/piratenation',
        'https://piratenation.medium.com/',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  transactionApi: {
    type: 'rpc',
    startBlock: 1,
    defaultUrl: 'https://rpc.boss.proofofplay.com',
    defaultCallsPerMinute: 3000,
    assessCount: subtractOne,
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ConduitMultisig2',
      (() => {
        const discoveredAdminOwner = discovery.getAddressFromValue(
          'ProxyAdmin',
          'owner',
        )
        const discoveredUpgradeExecutorAddy =
          discovery.getContract('UpgradeExecutor').address
        const discoveredExecutor = discovery.getAccessControlField(
          'UpgradeExecutor',
          'EXECUTOR_ROLE',
        ).members[0]
        const discoveredRollupOwnerMultisig =
          discovery.getContract('ConduitMultisig2').address
        assert(
          discoveredAdminOwner === discoveredUpgradeExecutorAddy &&
            discoveredExecutor === discoveredRollupOwnerMultisig,
          'Update the permissions section if this changes.',
        )
        const description =
          'Has the executor role of the UpgradeExecutor and indirectly owns the ProxyAdmin (can upgrade the whole system).'
        return description
      })(),
    ),
  ],
})
