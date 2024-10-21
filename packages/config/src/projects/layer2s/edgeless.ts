import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('edgeless')

const strategiesUpgrades = {
  upgradableBy: ['StrategyManager'],
  upgradeDelay: 'No delay',
}

export const edgeless: Layer2 = orbitStackL2({
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
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.edgeless.network/http',
  badges: [Badge.DA.CustomDA, Badge.RaaS.Caldera],
  nonTemplateEscrows: [
    // this is not the bridge escrow itself but the strategy contract that holds all funds backing the ewETH in the canonical bridge escrow. The normal escrow can be used as soon as we track the ewETH token
    {
      address: EthereumAddress('0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b'),
      sinceTimestamp: new UnixTime(1711057199),
      tokens: ['ETH', 'stETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9'),
      sinceTimestamp: new UnixTime(1713942971),
      tokens: ['ETH', 'ezETH'],
      chain: 'ethereum',
    },
  ],
  nonTemplatePermissions: [
    discovery.contractAsPermissioned(
      discovery.getContract('OrbitProxyAdmin'),
      'Admin of main Orbit contracts. Controlled by the UpgradeExecutor.',
    ),
    ...discovery.getMultisigPermission(
      'ExecutorMultisig',
      'Multisig that can execute upgrades on the main Orbit contracts via the UpgradeExecutor.',
    ),
    discovery.contractAsPermissioned(
      discovery.getContract('StrategiesProxyAdmin'),
      'Admin of the strategies contracts.',
    ),
    {
      name: 'StrategyManager',
      accounts: [
        discovery.getPermissionedAccount('StrategiesProxyAdmin', 'owner'),
      ],
      description:
        'Can upgrade the StakingManager, EdgelessDeposit, RenzoStrategy and EthStrategy contracts via the StrategiesProxyAdmin, including adding and removing strategies.',
    },
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('EdgelessDeposit', {
      description:
        'Receives deposits and issues ewETH tokens. Funds are forwarded to the StakingManger contract.',
      ...strategiesUpgrades,
    }),
    discovery.getContractDetails('StakingManager', {
      description:
        'Manages strategies to be used with funds forwarded from the EdgelessDeposit contract.',
      ...strategiesUpgrades,
    }),
    discovery.getContractDetails('RenzoStrategy', {
      description: 'Deposits funds into the Renzo protocol.',
      ...strategiesUpgrades,
    }),
    discovery.getContractDetails('EthStrategy', {
      description: 'Deposits funds into the Lido protocol.',
      ...strategiesUpgrades,
    }),
  ],
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
})
