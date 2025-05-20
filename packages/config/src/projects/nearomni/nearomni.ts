import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { BRIDGE_RISK_VIEW, CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'

const discovery = new ProjectDiscovery('nearomni')
const nearBridgeDerivedAddress = discovery.getContractValue(
  'OmniBridge',
  'nearBridgeDerivedAddress',
)

export const nearomni: Bridge = {
  type: 'bridge',
  id: ProjectId('nearomni'),
  addedAt: UnixTime(1747748934),
  display: {
    name: 'Near Omni Bridge',
    slug: 'nearomni',
    links: {
      websites: ['https://rainbowbridge.app/'],
      explorers: ['https://explorer.near.org/', 'https://aurorascan.dev/'],
      apps: ['https://rainbowbridge.app/transfer'],
      repositories: ['https://github.com/Near-One/omni-bridge'],
      socialMedia: [
        'https://discord.com/invite/GZ7735Xjce',
        'https://x.com/NEARProtocol',
      ],
    },
    description:
      'The NEAR Omni Bridge (also called Rainbow Bridge) is an MPC-validated multichain bridge. The MPC signature request/response logic is implemented on the NEAR blockchan and is called "Chain Signatures" there.',
    category: 'Single-chain',
  },
  config: {
    associatedTokens: ['AURORA', 'NEAR'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xe00c629aFaCCb0510995A2B95560E446A24c85B9'),
        tokens: '*',
        description:
          'Main escrow for all tokens bridged from Ethereum via Near Omni Bridge to other chains.',
      }),
    ],
  },
  riskView: {
    validatedBy: {
      value: 'MPC',
      description: `The derived EVM address of the multi-party computation signer is ${nearBridgeDerivedAddress}. MPC setup is offchain and members are not public.`,
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: `Multisig (${discovery.getMultisigStats('Near Omni Multisig')})`,
      secondLine: 'EOA',
      description: `Critical contracts can be upgraded by the ${discovery.getMultisigStats('Near Omni Multisig')} Near Omni Multisig.`,
      sentiment: 'bad',
    },
    livenessFailure: {
      value: 'No mechanism',
      description:
        'If the operators do not service the bridge, deposited funds do not arrive at the destination chain and are stuck.',
      sentiment: 'bad',
    },
    destinationToken: BRIDGE_RISK_VIEW.CANONICAL,
  },
  technology: {
    canonical: true,
    destination: ['Near', 'Aurora'], // to be expanded when chain sigs expand to more chains
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'The NEAR Omni Bridge is a Token Bridge that allows transferring assets and passing arbitrary messages between Ethereum, NEAR, and Aurora chains (and more chains in the future). The bridge locks tokens in the escrow contracts on Ethereum and mints / releases tokens on the Aurora or NEAR networks. When bridging back to Ethereum, tokens are burned / locked on Aurora / NEAR and then released from the escrow on Ethereum.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'MPC validation',
      description: `Multi-party computation (MPC) is used to validate all bridge transactions. This usually means that multiple distributed signers need to combine their signatures to create a single signature which authorizes a transaction. The MPC setup is offchain and from an onchain perspective is equal to an EOA.`,
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'the MPC signers collude or the MPC implementation is exploited.',
        },
        {
          category: 'Funds can be frozen if',
          text: 'the MPC signers stop signing bridge messages.',
        },
        {
          category: 'Users can be censored if',
          text: 'the MPC signers do not sign bridge messages.',
        },
      ],
    },
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  milestones: [
    {
      title: 'Rainbow becomes Omni',
      url: 'https://x.com/NEARProtocol/status/1908247501032824914',
      date: '2025-04-04T00:00:00Z',
      description:
        'NEAR transitions from the lightclient-validated Rainbow Bridge to the MPC-validated Omni Bridge.',
      type: 'general',
    },
  ],
}
