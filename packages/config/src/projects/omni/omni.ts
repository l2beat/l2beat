import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../../common'
import { BRIDGE_RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'

const discovery = new ProjectDiscovery('omni')
const threshold = discovery.getContractValue<number>(
  'BridgeValidators_Omni',
  '$threshold',
)
const size = discovery.getContractValue<number>(
  'BridgeValidators_Omni',
  'validatorCount',
)
const validatorsString = `${threshold} / ${size}`

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
      apps: ['https://bridge.gnosischain.com'],
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
      value: 'Third Party',
      description: `${validatorsString} Validator MultiSig`,
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description: 'Contracts can be upgraded by the Gnosis Bridge MultiSig',
      sentiment: 'bad',
    },
    destinationToken: {
      ...BRIDGE_RISK_VIEW.CANONICAL,
      description:
        BRIDGE_RISK_VIEW.CANONICAL.description +
        ' Tokens transferred end up as wrapped ERC677.',
    },
  },
  technology: {
    destination: ['Gnosis Chain'],
    canonical: true,
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'This is a Lock-Mint bridge that takes ownership of tokens in escrow contracts on Ethereum and mints "representation tokens" on Gnosis Chain. When bridging back to Ethereum, tokens are burned on Gnosis Chain and then released from the escrow on Ethereum. Tokens in Ethereum escrow are not effectively locked, as they can be invested in DeFi protocols to generate yield. Bridge contract enables its owner (Gnosis Bridge Multisig) to set separate external contract with investment logic. The addition of Hashi (EVM Hash Oracle Aggregator) and light clients for bridge validation is being tested.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Incoming transfers are externally verified',
      description: `Incoming messages to Ethereum are managed by the Arbitrary Message Bridge (AMB), a trusted message relaying mechanism currently validated by a ${validatorsString} Validator MultiSig. The Gnosis Bridge Multisig is used for updating validator set, signature thresholds, bridge parameters and bridge contracts. For Omnibridge, messages are passed between "Mediator" contracts deployed on both chains. When user deposits a token to Mediator escrow on Ethereum, an AMB message is passed to Mediator on Gnosis chain, which mints a "representation token", optionally deploying a necessary token contract on Gnosis chain if this is the first time this token is transferred. Transfers from Gnosis chain to Ethereum use the same mechanism in the opposite direction but tokens on Gnosis are burned and tokens on Ethereum are released from escrow. Outgoing messages are verified on Gnosis chain using a ZK Ethereum light client.`,
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
          text: 'validators relay a fake message to Gnosis chain to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators relay a fake message to Ethereum chain allowing a user to withdraw tokens from Ethereum escrow when equivalent amount of tokens has not been deposited and burned on Gnosis chain.',
        },
        {
          category: 'Funds can be stolen if',
          text: "there's an exploit in contracts that invest user deposit.",
        },
        {
          category: 'Funds can be frozen if',
          text: "validators don't relay messages between chains.",
        },
        {
          category: 'Funds can be frozen if',
          text: "there's insufficient liquidity of the requested token in the escrow due to investing.",
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
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
}
