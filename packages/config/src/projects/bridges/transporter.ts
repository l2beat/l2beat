import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('transporter')

export const transporter: Bridge = {
  type: 'bridge',
  id: ProjectId('transporter'),
  display: {
    name: 'Transporter',
    slug: 'transporter',
    category: 'Token Bridge',
    links: {
      websites: ['https://app.transporter.io/'],
      repositories: ['https://docs.chain.link/ccip/architecture'],
      documentation: ['https://docs.chain.link/ccip'],
      socialMedia: ['https://x.com/transporter_io'],
    },
    description:
      'This page gathers Socket vaults built on top of Socket Data Layer cross chain messaging protocol.',
    detailedDescription:
      'Transporter is a hybrid bridge that can work either as a Token Bridge or Liqudity Network depending on the requirements of tokens.\
      It is using Chainlink CCIP standard for cross-chain communication.',
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Chainlink Oracle network is responsibile for validating cross-chain messages. For additional security it uses off-chain secondary validation network called Risk Management Network.\
        These validators are tasked with montioring anomalous behavior and can halt the network if necessary.',
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
    destination: ['Ethereum', 'Reya', 'Lyra', 'Hook'],
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
    escrows: [], // a long list of escrows from Discovery
  },
  contracts: {
    // this is not a full list of contracts - there would be too many. There should be a comment saying that example Line is listed here.
    addresses: [
      discovery.getContractDetails(
        'Router',
        'Central contract in CCIP responsible for the configuration of OnRamp, OffRamp and Commit Stores for different chains.',
      ),
      discovery.getContractDetails(
        'OnRamp1',
        'OnRamp for outgoing messages to Arbitrum.',
      ),
      discovery.getContractDetails(
        'OffRamp1',
        'OffRamp for incoming messages from Arbitrum.',
      ),
      discovery.getContractDetails(
        'CommitStore1',
        'CommitStore for storing incoming message roots from Arbitrum.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    isIncomplete: true,
  },
  permissions: [
    {
      name: 'Teleport Owner',
      description:
        'Account privileged to set up different roles in the main Socket contract and owner of the Socket USDC vault associated with Reya.',
      accounts: [discovery.getPermissionedAccount('Router', 'owner')],
    },
  ],
  knowledgeNuggets: [],
}
