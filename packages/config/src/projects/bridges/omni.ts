import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../types'
import { RISK_VIEW } from './common'

const discovery = new ProjectDiscovery('omni')
const threshold = discovery.getContractValue<number>(
  'BridgeValidators',
  'requiredSignatures',
)
const size = discovery.getContractValue<number>(
  'BridgeValidators',
  'validatorCount',
)
const validatorsString = `${threshold} / ${size}`

const upgrades = {
  upgradableBy: [{ name: 'OmniBridgeGovernance', delay: 'no' }],
}

const paused =
  discovery.getContractValue<number>('ForeignAMB', 'maxGasPerTx') < 21000
const warningText = paused ? 'The bridge is currently paused.' : undefined

const pausable = {
  paused,
  pausableBy: ['OmniBridgeGovernance'],
}

export const omni: Bridge = {
  type: 'bridge',
  id: ProjectId('omni'),
  addedAt: new UnixTime(1662628329), // 2022-09-08T09:12:09Z
  display: {
    name: 'Omnibridge',
    slug: 'omni',
    warning: warningText,
    category: 'Token Bridge',
    links: {
      websites: ['https://omni.gnosischain.com/'],
      apps: ['https://omni.gnosischain.com/'],
      documentation: [
        'https://docs.gnosischain.com/bridges/tokenbridge/omnibridge',
      ],
      explorers: [
        'https://gnosisscan.io/',
        'https://explorer.anyblock.tools/ethereum/poa/xdai/',
        'https://blockscout.com/xdai/mainnet',
        'https://beacon.gnosischain.com/',
        'https://xdai.tokenview.io/',
      ],
      socialMedia: [
        'https://twitter.com/gnosischain',
        'https://discord.gg/VQb3WzsywU',
        'https://t.me/gnosischain',
      ],
      repositories: [
        'https://github.com/omni',
        'https://github.com/gnosischain',
      ],
    },
    description: 'Omnibridge is the official bridge of Gnosis Chain.',
    detailedDescription:
      'It uses a set of trusted validators to confirm deposits for a Lock-Mint swap. Tokens sent to the bridge escrow can be further sent to yield generating contracts (e.g. AAVE) to accrue interest for external recipient, although this functionality has been disabled at the time of Ethereum Merge.',
  },
  config: {
    associatedTokens: ['GNO'],
    escrows: [
      {
        address: EthereumAddress('0x88ad09518695c6c3712AC10a214bE5109a655671'),
        sinceTimestamp: new UnixTime(1596501090),
        tokens: '*',
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
      description: 'Contracts can be upgraded by BridgeGovernance MultiSig',
      sentiment: 'bad',
    },
    destinationToken: {
      ...RISK_VIEW.CANONICAL,
      description:
        RISK_VIEW.CANONICAL.description +
        ' Tokens transferred end up as wrapped ERC677.',
    },
  },
  technology: {
    destination: ['Gnosis Chain'],
    canonical: true,
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'This is a Lock-Mint bridge that takes ownership of tokens in escrow contracts on Ethereum and mints "representation tokens" on the Gnosis Chain. When bridging back to Ethereum, tokens are burned on the Gnosis Chain and then released from the escrow on Ethereum. Tokens in Ethereum escrow are not effectively locked, as deposited tokens can be invested to generate yield (interest is intended to go to GnosisDAO). Bridge contract enables its owner (BridgeGovernance) to specify or disable a separate external contract with investment logic. Currently investment contracts have been disabled around the time of the Ethereum Merge. Previously used investment contract sent part of deposited USDC and USDT to Aave. A special care needs to be taken when bridging xDai token that is native to Gnosis Chain.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Incoming transfers are externally verified',
      description: `Incoming messages to Ethereum are managed by the Arbitrary Message Bridge (AMB), a trusted message relaying mechanism currently validated by a ${validatorsString} Validator MultiSig. The GovernanceMultisig is used for updating validator set, signature thresholds, bridge parameters and bridge contracts. For Omnibridge, messages are passed between "Mediator" contracts deployed on both chains. When user deposits a token to Mediator escrow on Ethereum, an AMB message is passed to Mediator on Gnosis chain, which mints a "representation token", optionally deploying a necessary token contract on Gnosis chain if this is the first time this token is transferred. Transfers from Gnosis chain to Ethereum use the same mechanism in the opposite direction but tokens on Gnosis are burned and tokens on Ethereum are released from escrow. Outgoing messages are verified on the Gnosis chain using a ZK Ethereum light client.`,
      references: [
        {
          title: 'Omnibridge documentation',
          url: 'https://docs.gnosischain.com/bridges/tokenbridge/omnibridge',
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
          text: "there's insufficient liquidity of requested token in escrow and Aave.",
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Users receive wrapped ERC677 tokens on Gnosis Chain. There\'s a separate bridge for xDai and Omnibridge should not be used, as it mints non-native "representation version" of xDai.',
      references: [],
      risks: [],
    },
  },
  contracts: {
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails('ForeignAMB', {
          description:
            'Arbitrary Message Bridge validated by the BridgeValidators.',
          ...upgrades,
          pausable,
        }),
        discovery.getContractDetails('MultiTokenMediator', {
          description: 'Mediator contract and escrow.',
          ...upgrades,
        }),
        discovery.getContractDetails('BridgeValidators', {
          description: `Bridge validators contract, acts as a ${validatorsString} multisig.`,
          ...upgrades,
        }),
        discovery.getContractDetails('AAVEInterestERC20', {
          description:
            'Contract that was used to invest token deposits to Aave.',
          ...upgrades,
        }),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getMultisigPermission(
          'OmniBridgeGovernance',
          'Can update the contracts and parameters of the bridge.',
        ),
        discovery.getPermissionDetails(
          'Bridge validators',
          discovery.getPermissionedAccounts(
            'BridgeValidators',
            'validatorList',
          ),
          'List of actors that can validate incoming messages.',
        ),
      ],
    },
  },
}
