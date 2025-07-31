import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW, CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('omni')

const omnipaused =
  discovery.getContractValue<number>('ForeignAMB', 'maxGasPerTx') < 21000
const warningText = omnipaused
  ? 'The Omni part of Gnosis Bridge is currently paused.'
  : undefined

export const omni: Bridge = {
  type: 'bridge',
  id: ProjectId('omni'),
  addedAt: UnixTime(1662628329), // 2022-09-08T09:12:09Z
  display: {
    name: 'Gnosis Bridge',
    slug: 'omni',
    warning: warningText,
    category: 'Single-chain',
    links: {
      bridges: ['https://bridge.gnosischain.com'],
      websites: ['https://bridge.gnosischain.com/bridge-explorer/bridges'],
      documentation: ['https://docs.gnosischain.com/bridges/'],
      explorers: [
        'https://bridge.gnosischain.com/bridge-explorer',
        'https://gnosisscan.io/',
        'https://gnosis.blockscout.com/',
        'https://gnosischa.in/',
        'https://xdai.tokenview.io/',
      ],
      socialMedia: [
        'https://twitter.com/gnosischain',
        'https://discord.com/invite/gnosis',
        'https://t.me/gnosischain',
        'https://gnosis.ghost.io/',
      ],
      repositories: [
        'https://github.com/omni',
        'https://github.com/gnosischain',
      ],
    },
    description:
      'Gnosis Bridge unites the former token bridges Omnibridge and xDai bridge as the official bridge between Gnosis Chain and Ethereum.',
    detailedDescription:
      'It uses a set of trusted validators to verify deposits for lock-mint bridging. Tokens sent to the bridge escrow can be further sent to yield generating contracts (e.g. AAVE, Spark) by permissioned actors to accrue interest.',
  },
  config: {
    associatedTokens: ['GNO'],
    escrows: [
      {
        address: EthereumAddress('0x88ad09518695c6c3712AC10a214bE5109a655671'),
        sinceTimestamp: UnixTime(1596501090),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016'),
        sinceTimestamp: UnixTime(1573776000),
        tokens: ['cDAI', 'DAI', 'sDAI'],
        chain: 'ethereum',
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: `Multisig (${discovery.getMultisigStats('BridgeValidators_DAI')})`,
      description: `${discovery.getMultisigStats('BridgeValidators_DAI')} BridgeValidators Multisig with publicly disclosed, external signers (DAI and Omni bridges each have their own validator set).`,
      sentiment: 'bad',
    },
    governance: {
      upgrade: {
        value: `Multisig (${discovery.getMultisigStats('Gnosis Bridge Multisig')})`,
        description: `Critical contracts can be upgraded by the ${discovery.getMultisigStats('Gnosis Bridge Multisig')} Gnosis Bridge MultiSig`,
        sentiment: 'bad',
      },
      pause: {
        value: `Multisig (${discovery.getMultisigStats('Gnosis Bridge Multisig')})`,
        sentiment: 'bad',
        description:
          'Although there is no formal pause function, the liveness of the bridge depends on the Multisig and operators.',
      },
    },
    destinationToken: {
      ...BRIDGE_RISK_VIEW.CANONICAL,
      description:
        BRIDGE_RISK_VIEW.CANONICAL.description +
        ' Tokens transferred end up as wrapped ERC677.',
    },
    livenessFailure: {
      value: 'No mechanism',
      description:
        'If the operators do not service the bridge, deposited funds do not arrive at the destination chain and are stuck.',
      sentiment: 'bad',
    },
  },
  technology: {
    otherConsiderations: [
      {
        name: 'Rehypothecation',
        description:
          'User assets in the bridge escrow are not locked and can be moved by permissioned actors. This is usually done to generate yield, which can then be forwarded to the users.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: "there's an exploit in external contracts that are used to invest user deposits.",
          },
          {
            category: 'Funds can be frozen if',
            text: 'there are not enough tokens in the escrow to service withdrawals due to investing.',
          },
        ],
        references: [],
      },
    ],
    destination: ['Gnosis Chain'],
    canonical: true,
    principleOfOperation: {
      name: 'Principle of operation',
      description: `The Gnosis bridge is comprised of two standard multisig-validated token bridges (Omni and xDAI) with similar architecture and validators. While the xDAI bridge is only used for bridging DAI-related tokens (xDAI is Gnosis Chains gas token), the Omni bridge can be used to bridge many other ERC-20 tokens. Both bridges on ethereum are served by external validators that sign bridge messages via custom multisigs. Assets that are locked in one of the escrows on ethereum can be 'invested' by permissioned actors to generate yield. In the case of DAI / sDAI (Spark protocol), the yield is handed down to sDAI users on Gnosis Chain. The addition of Hashi (EVM Hash Oracle Aggregator) and light clients for message validation is being tested but remains optional for now.`,
      references: [],
      risks: [],
    },
    validation: {
      name: 'Incoming transfers are externally verified',
      description: `Incoming messages to Ethereum are validated by Multisigs with publicly known entities as their signers.  The DAI bridge validators are validated by the ${discovery.getMultisigStats('BridgeValidators_DAI')} BridgeValidators_DAI Multisig and the Omni bridge by the ${discovery.getMultisigStats('BridgeValidators_Omni')} BridgeValidators_Omni Multisig. Only messages signed by at least the threshold amount of validators from the respective multisig are accepted for releasing funds from the escrow contract or for executing messages.`,
      references: [
        {
          title: 'Gnosis bridge documentation',
          url: 'https://docs.gnosischain.com/bridges/',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'validators decide to not pass selected messages between chains.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators sign a malicious message to mint or release tokens that they did not burn or lock on the other side.',
        },

        {
          category: 'Funds can be frozen if',
          text: "validators don't relay messages between chains.",
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        "Users receive wrapped ERC677 tokens on Gnosis Chain. There's a separate bridge for Dai.",
      references: [],
      risks: [],
    },
  },
  milestones: [
    {
      title: 'Plonky3 vulnerability patch',
      url: 'https://x.com/SuccinctLabs/status/1929773028034204121',
      date: '2025-06-04T00:00:00.00Z',
      description:
        'SP1 verifier is patched to fix critical vulnerability in Plonky3 proof system (SP1 dependency).',
      type: 'incident',
    },
  ],
  contracts: {
    addresses: discovery.getDiscoveredContracts(['gnosis']),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: discovery.getDiscoveredPermissions(['gnosis']),
  discoveryInfo: getDiscoveryInfo([discovery]),
}
