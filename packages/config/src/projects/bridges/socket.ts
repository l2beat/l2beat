import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('socket')

export const socket: Bridge = {
  type: 'bridge',
  id: ProjectId('socket'),
  display: {
    name: 'Socket',
    slug: 'socket',
    warning:
      'The security parameters of each individual token and vault must be individually assessed, and can be changed by the developers. DYOR and use Socket at your own risk.',
    category: 'Token Bridge',
    links: {
      websites: ['https://socketscan.io/'],
      repositories: [
        'https://github.com/SocketDotTech/socket-DL',
        'https://github.com/SocketDotTech/socket-plugs/blob/main/contracts/superbridge',
      ],
      documentation: ['https://developer.socket.tech/Learn/protocol-design'],
      socialMedia: ['https://twitter.com/SocketDotTech'],
    },
    description:
      'This page gathers Socket vaults built on top of Socket Data Layer cross chain messaging protocol.',
    detailedDescription:
      'Socket is highly flexible and configurable and risks vary depending on the current configuration of the specific route. It allows to define custom Token Vaults that communicate using different messaging protocols.\
    Token Vaults are connected via Plugs and Switchboards to their remote counterparts. The central contract on each chain, Socket, stores the configuration of all Plugs and Switchboards.\
    Some Switchboards may be as secure as "native" (canonical) bridge, some may use simple Relayers/Watchers to move messages across chains.',
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Depending on the Switchboard, transfers may need to be independently confirmed by third parties, for example when using FastSwitchboard there is a set of WATCHERS that need to authorize the transfer event.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'Vaults can be individually upgradable and the security assumptions must be individually assessed for each individual vault.',
      sentiment: 'bad',
    },
    destinationToken: {
      ...RISK_VIEW.CANONICAL_OR_WRAPPED,
      description:
        RISK_VIEW.CANONICAL_OR_WRAPPED.description +
        ' Tokens transferred end up as ERC20 proxies, some of them are upgradable. The contract is named UChildERC20Proxy.',
    },
  },
  technology: {
    destination: ['Various'],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Socket is a bridge framework connecting different chains via a set of "switchboards". Every chain using Socket for some of its tokens can mix & match many switchboards with varying trust assumptions, for example mixing a "fast" route via "Fast Switchboard" with a "Standard Route" using a native rollup AMB.',
      risks: [],
      references: [],
    },
    validation: {
      name: 'Various switchboards',
      description:
        'Vaults can use any registered switchboards. The validation model is chosen by the switchboard and their security can vary from using a canonical bridge to a third-party validation model.',
      references: [
        {
          text: 'Protocol Design - Socket Documentation',
          href: 'https://developer.socket.tech/Learn/protocol-design#architecture',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'watchers fail to facilitate the transfer.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'watchers submit fraudulent block hash and relay fraudulent transfer.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'the Socket Vault owners change the Vault configuration.',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d'),
        name: 'USDC Vault',
        tokens: ['USDC'],
      }),
    ],
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'Socket',
        'Central contract in Socket SuperBridge holding configuration of all Plugs and associated Switchboards.',
      ),
      discovery.getContractDetails(
        'FastSwitchboard',
        'Fast Switchboard having set of Watchers authorizing transfers. If the transfer is not explicitly authorized within certain period of time, it is optimistically considered to be valid. Watchers can also stop (trip) an invalid transfer.',
      ),
      discovery.getContractDetails(
        'PolygonL1Switchboard',
        'Switchboard using native Polygon message passing.',
      ),
      discovery.getContractDetails(
        'OptimismSwitchboard',
        'Switchboard using native Optimism message passing.',
      ),
      discovery.getContractDetails(
        'ArbitrumL1Switchboard',
        'Switchboard using native Arbitrum message passing.',
      ),
      discovery.getContractDetails('ExecutionManager', ''),
      discovery.getContractDetails('TransmitManager', ''),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    isIncomplete: true,
  },
  permissions: [
    {
      name: 'Socket Owner.',
      description:
        'Account privileged to set up different roles in the main Socket contract.',
      accounts: [discovery.getPermissionedAccount('Socket', 'owner')],
    },
  ],
  knowledgeNuggets: [],
}
