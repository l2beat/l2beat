import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { TECHNOLOGY } from './common'
import { UNDER_REVIEW_RISK_VIEW } from './common/riskView'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('aevo')

const upgradesProxy = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const aevo: Layer2 = {
  type: 'layer2',
  id: ProjectId('aevo'),
  display: {
    name: 'Aevo',
    slug: 'aevo',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Aevo is a high-performance decentralized options exchange, powered by the OP Stack.',
    purpose: 'DEX',
    provider: 'OP Stack',
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://www.aevo.xyz/'],
      apps: ['https://app.aevo.xyz/'],
      documentation: ['https://docs.aevo.xyz/'],
      explorers: ['https://explorer.aevo.xyz/'],
      repositories: ['https://github.com/aevoxyz'],
      socialMedia: ['https://twitter.com/aevoxyz'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x787A0ACaB02437c60Aafb1a29167A3609801e320'),
        sinceTimestamp: new UnixTime(1679193119),
        tokens: ['ETH'],
        description: 'Main entry point for users depositing ETH.',
        ...upgradesProxy,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x4082C9647c098a6493fb499EaE63b5ce3259c574'),
        sinceTimestamp: new UnixTime(1679193119),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 token that do not require custom gateway.',
        ...upgradesProxy,
      }),
    ],
  },
  riskView: UNDER_REVIEW_RISK_VIEW,
  technology: TECHNOLOGY.UNDER_REVIEW,
  permissions: [
    ...discovery.getMultisigPermission(
      'AevoMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
    {
      name: 'ProxyAdmin',
      accounts: [discovery.getPermissionedAccount('AddressManager', 'owner')],
      description:
        'Admin of the OptimismPortal, OptimismMintableERC20Factory, L1StandardBridge, AddressManager proxies. It’s controlled by the AevoMultisig.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('OptimismPortal', {
        description:
          'The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.',
        ...upgradesProxy,
      }),
    ],
    risks: [],
  },
}
