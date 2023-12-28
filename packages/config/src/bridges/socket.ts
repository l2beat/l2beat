import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS } from '../layer2s/common'
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
        'https://github.com/SocketDotTech/socket-plugs/blob/main/contracts/superbridge',
      ],
      documentation: ['https://developer.socket.tech/Learn/protocol-design'],
      socialMedia: ['https://twitter.com/SocketDotTech'],
    },
    description:
      'This page gathers Socket vaults built on top of Socket bridge framework. Socket is highly flexible and configurable and risks vary depending on the current configuration of the specific route.\
      Token Vaults are connected via so-called Plugs and Switchboards to their remote counterparts. The central contract on each chain, Socket, stores the configuration of all Plugs and Switchboards.\
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
        "Vaults can be individually upgradable and it's security assumptions must be individually assessed for each individual token.",
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.CANONICAL,
  },
  technology: {
    destination: ['Various'],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Omnichain tokens are tokenized Token Bridges. One chain is designated as main and acts as an token escrow. Transfers from the main chain are done using typical lock-mint model. Transfers between\
        other (non-main) chains are made using burn-mint model. The implementation details may vary between each individual omnichain token and must be individually assessed.',
      risks: [],
      references: [],
    },
    validation: {
      name: 'Oracles and Relayers',
      description:
        'Omnichain tokens are built on top of LayerZero protocol. LayerZero relies on Oracles to periodically submit source chain block hashes to the destination chain.\
        Once block hash is submitted, Relayers can provide the merkle proof for the transfers. The Oracle and Relayer used can be either default LayerZero contracts, or custom built by the token developers.',
      references: [
        {
          text: 'LayerZero security model analysis',
          href: 'https://medium.com/l2beat/circumventing-layer-zero-5e9f652a5d3e',
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
          text: 'watchers submit fraudulent block hash and relay fraudulent transfer .',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'socket vault owners change Vault configuration.',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d'), // USDC-Lyra Vault
        sinceTimestamp: new UnixTime(1700181143),
        tokens: ['USDC'],
      },
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
        'Fast Switchboard having set of WATCHERS authorizing transfers. If the transfer is not explicitly authorized withing XXX seconds, it is optimistically considered to be valid. WATCHERS can also stop (trip) an invalid transfer.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    isIncomplete: true,
  },
  permissions: [],
  knowledgeNuggets: [],
}
