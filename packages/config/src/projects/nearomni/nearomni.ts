import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { BRIDGE_RISK_VIEW, CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('nearomni')
const nearBridgeDerivedAddress = ChainSpecificAddress.address(
  discovery.getContractValue<ChainSpecificAddress>(
    'OmniBridge',
    'nearBridgeDerivedAddress',
  ),
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
      bridges: ['https://rainbowbridge.app/transfer'],
      repositories: ['https://github.com/Near-One/omni-bridge'],
      socialMedia: [
        'https://discord.com/invite/GZ7735Xjce',
        'https://x.com/NEARProtocol',
      ],
    },
    description:
      'The NEAR Omni Bridge (also called Rainbow Bridge) is an MPC-validated multichain bridge. The MPC signature request/response logic is implemented on the NEAR blockchain and is called "Chain Signatures" there. Although it currently is limited to sending tokens between Ethereum and Near + Aurora, future plans include other chains and more light clients on the NEAR blockchain.',
    category: 'Single-chain',
  },
  config: {
    associatedTokens: ['AURORA', 'NEAR'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xe00c629aFaCCb0510995A2B95560E446A24c85B9',
        ),
        tokens: '*',
        description:
          'Main escrow for all tokens bridged from Ethereum via Near Omni Bridge to other chains.',
      }),
    ],
  },
  riskView: {
    validatedBy: {
      value: 'MPC',
      description: `The derived EVM address of the multi-party computation signer is ${nearBridgeDerivedAddress}. The MPC setup is offchain and members are not public. Transfers from Ethereum to NEAR are validated by an Ethereum light client on NEAR.`,
      sentiment: 'bad',
    },
    governance: {
      upgrade: {
        value: `Multisig (${discovery.getMultisigStats('Near Omni Multisig')})`,
        description: `Critical contracts can be upgraded by the ${discovery.getMultisigStats('Near Omni Multisig')} Near Omni Multisig.`,
        sentiment: 'bad',
      },
      pause: {
        value: 'EOA',
        sentiment: 'bad',
        description:
          'An EOA (PAUSABLE_ADMIN_ROLE) can pause the bridge directly.',
      },
    },
    livenessFailure: {
      value: 'No mechanism',
      description:
        'If the operators do not service the bridge, deposited funds do not arrive at the destination chain and are stuck. For Ethereum -> NEAR transfers, users can potentially self-relay but the destination smart contract is unverified.',
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
      risks: [
        {
          category: 'Funds can be frozen if', // no validation in initTransfer()
          text: 'a user bridges an unsupported token or specifies an unsupported destination address.',
        },
      ],
    },
    validation: {
      name: 'MPC validation and ethereum light client',
      description:
        'Multi-party computation (MPC) is used to validate bridge transactions going out from NEAR. This usually means that multiple distributed signers need to combine their signatures to create a single signature authorizings a transaction. The MPC setup is offchain and from an Ethereum L1 perspective is equal to an EOA. Transfers from Ethereum to NEAR are validated by an Ethereum light client implemented as a smart contract on NEAR, of which the source code is unverified.',
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
  discoveryInfo: getDiscoveryInfo([discovery]),
}
