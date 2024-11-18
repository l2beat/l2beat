import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { subtractOne } from '../../common/assessCount'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('degen', 'base')

export const degen: Layer3 = orbitStackL3({
  createdAt: new UnixTime(1712135735), // 2024-04-03T09:15:35Z
  hostChain: ProjectId('base'),
  discovery,
  badges: [Badge.DA.DAC, Badge.L3ParentChain.Base, Badge.RaaS.Conduit],
  additionalPurposes: ['Social'],
  nativeToken: 'DEGEN',
  display: {
    name: 'Degen Chain',
    slug: 'degen',
    description:
      'Degen Chain is an ultra-low-cost L3 for the Degen community built with Arbitrum Orbit, Base for settlement, and AnyTrust for data availability. DEGEN is the native gas token.',
    links: {
      websites: ['https://syndicate.io/blog/degen-chain'],
      apps: ['https://bridge.degen.tips/', 'https://degen.tips/'],
      documentation: ['https://docs.syndicate.io/get-started/introduction'],
      explorers: ['https://explorer.degen.tips/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/degentokenbase',
        'https://warpcast.com/~/channel/degen',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  blockNumberOpcodeTimeSeconds: 2, // block.number opcode on Base (Degen host chain) counts Base L2 block numbers that have 2 seconds block time (different to OP stack host chains that count the L1 blocks)
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.degen.tips',
    defaultCallsPerMinute: 5000,
    assessCount: subtractOne,
    startBlock: 1,
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'DegenMultisig',
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
          discovery.getContract('DegenMultisig').address
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
    {
      name: 'UTBAdmin',
      accounts: discovery.getAccessControlRolePermission(
        'UTBDecent',
        'DEFAULT_ADMIN_ROLE',
      ),
      description:
        'The UTBAdmin directly controls the UTB contracts critical functions like updating all roles and modules.',
    },
    {
      name: 'OftAdapterEOA',
      accounts: [
        discovery.getPermissionedAccount('OrbitERC20OFTAdapter', 'owner'),
      ],
      description:
        'Can control the OrbitERC20OFTAdapter contract for the DEGEN token and thus potentially steal all funds from the canonical bridge.',
    },
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('UTBDecent', {
      description:
        'The UTB contract serves as an L2<->L3 gateway by integrating with Decent (LayerZero app) to allow bridging and swapping in- and out of Degen L3. This is achieved using external modules (smart contracts) like swappers and bridgers that can be registered in the UTB contract.',
    }),
    discovery.getContractDetails('OrbitERC20OFTAdapter', {
      description:
        'as a desiganted allowed outbox, this contract can access all funds of the canonical bridge escrow. It also interfaces with the LayerZero AMB, giving this external bridge access to the Degen L3 canonical bridge and making canonical bridge security dependent on LayerZero security.',
    }),
  ],
  nonTemplateContractRisks: [
    {
      category: 'Funds can be stolen if',
      text: 'the security stack of the whitelisted LayerZero adapter changes or is compromised.',
      isCritical: true,
    },
  ],
  associatedTokens: ['DEGEN'],
  milestones: [
    {
      name: 'Degen Chain halts for two days',
      date: '2024-05-13T00:00:00Z',
      link: 'https://x.com/degentokenbase/status/1789944238731297188',
      description:
        'Degen Chain halts for two days due to a chain misconfiguration.',
      type: 'incident',
    },
  ],
})
