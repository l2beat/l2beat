import { UnixTime } from '@l2beat/shared-pure'
import { subtractOne } from '../../common/assessCount'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('sxnetwork', 'ethereum')

export const sxnetwork: Layer2 = orbitStackL2({
  createdAt: new UnixTime(1722430544), // 2024-07-31T12:55:44Z
  discovery,
  nativeToken: 'SX',
  badges: [Badge.DA.DAC, Badge.RaaS.Gelato],
  additionalPurposes: ['Betting'],
  display: {
    name: 'SX Network',
    slug: 'sxnetwork',
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    description:
      "SX Network is an Orbit stack Optimium, built to scale the SX team's existing sports betting platform.",
    links: {
      websites: ['https://sx.technology/'],
      apps: [
        'https://sx.bet/wallet/bridge',
        'https://bridge.gelato.network/bridge/sx-rollup',
      ],
      documentation: ['https://docs.sx.technology/'],
      explorers: ['https://explorerl2.sx.technology/'],
      repositories: [],
      socialMedia: [
        'https://x.com/SX_Network',
        'https://discord.com/invite/sxnetwork',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  isNodeAvailable: 'UnderReview',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  associatedTokens: ['SX'],
  rpcUrl: 'https://rpc.sx-rollup.gelato.digital', //chainid 4162
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.sx-rollup.gelato.digital',
    defaultCallsPerMinute: 1500,
    assessCount: subtractOne,
    startBlock: 1,
  },
  nonTemplatePermissions: [
    {
      name: 'SX Network Admin EOA',
      accounts: [
        {
          address: discovery.getAccessControlField(
            'UpgradeExecutor',
            'EXECUTOR_ROLE',
          ).members[0],
          type: 'EOA',
        },
      ],
      description:
        "EOA address that can upgrade the rollup's smart contract system (via UpgradeExecutor) and gain access to all funds.",
    },
  ],
})
