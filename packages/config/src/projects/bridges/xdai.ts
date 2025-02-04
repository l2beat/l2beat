import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../types'

const discovery = new ProjectDiscovery('xdai')

const validatorCount = discovery.getContractValue(
  'BridgeValidators',
  'validatorCount',
)
const validatorThreshold = discovery.getContractValue(
  'BridgeValidators',
  'requiredSignatures',
)
const validatorThresholdstring = `${validatorThreshold} / ${validatorCount}`

export const xdai: Bridge = {
  type: 'bridge',
  id: ProjectId('xdai'),
  addedAt: new UnixTime(1665411755), // 2022-10-10T14:22:35Z
  display: {
    name: 'xDai Bridge',
    slug: 'xdai',
    category: 'Token Bridge',
    links: {
      websites: ['https://bridge.gnosischain.com/'],
      apps: ['https://bridge.gnosischain.com/'],
      documentation: [
        'https://docs.gnosischain.com/bridges/tokenbridge/xdai-bridge',
      ],
      explorers: [
        'https://blockscout.com/xdai/mainnet',
        'https://gnosisscan.io/',
        'https://explorer.anyblock.tools/ethereum/poa/xdai/',
        'https://beacon.gnosischain.com/',
        'https://xdai.tokenview.io/',
      ],
      socialMedia: [
        'https://twitter.com/gnosischain',
        'https://discord.gg/VQb3WzsywU',
        'https://t.me/gnosischain',
      ],
      repositories: ['https://github.com/gnosischain'],
    },
    description:
      'xDai Bridge is the official bridge dedicated to transferring Dai from Ethereum into xDai on Gnosis Chain.',
    detailedDescription:
      'It uses a set of trusted validators to confirm deposits for a Lock-Mint swap. Tokens sent to the bridge escrow can be further sent to Compound to generate interest for external recipient, although this functionality has been disabled at the time of Ethereum Merge.',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016'),
        sinceTimestamp: new UnixTime(1573776000),
        tokens: ['cDAI', 'DAI', 'sDAI'],
        chain: 'ethereum',
      },
    ],
  },
  technology: {
    destination: ['Gnosis Chain'],
    principleOfOperation: {
      name: 'Principle of operation',
      description: `xDai Bridge is the native Gnosis Chain bridge for swapping Dai on Ethereum into xDai on Gnosis, which is the native asset used for gas and transaction fees. Due to this native aspect of xDai it is minted via block reward contract by Gnosis consensus mechanism. Specifically, when a user deposits Dai to Bridge Contract on Ethereum, it is noticed by an external Bridge Validator Oracle service (${validatorThresholdstring} Multisig). After collecting required signatures, the service calls a Bridge Contract on the Gnosis chain which instructs a Block Reward Contract that recipient's xDai balance needs to be increased (as an EVM state update by consensus engine). To transfer xDai to Ethereum, a user deposits xDai to Bridge Contract on Gnosis chain, which is then burned. The Bridge Validator Service provides required signatures for a Bridge Contract on Ethereum which releases Dai to the user. Bridge contract on Ethereum supports sending deposited tokens to Compound to accrue yield, which can be transferred to EOA account with intention to be spent on supporting bridge operations.`,
      references: [
        {
          title: 'xDai Bridge Documentation',
          url: 'https://docs.gnosischain.com/bridges/tokenbridge/xdai-bridge',
        },
        {
          title: 'Earning yield on Bridge Deposit',
          url: 'https://docs.gnosischain.com/bridges/tokenbridge/xdai-bridge#earning-yield-on-bridge-deposits',
        },
      ],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description: `Dai and xDai deposits to Bridge Contracts are validated by a ${validatorThresholdstring} Validator MultiSig. A separate ${discovery.getMultisigStats('GnosisBridgeGovernanceMultisig')} Governor Multisig is used for updating validator set, signature thresholds, bridge parameters and bridge contracts.`,
      references: [
        {
          title: 'xDai Bridge Documentation',
          url: 'https://docs.gnosischain.com/bridges/tokenbridge/xdai-bridge',
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
          text: "there's an exploit in Compound when it holds part of user deposit.",
        },
        {
          category: 'Funds can be frozen if',
          text: "validators don't relay messages between chains.",
        },
        {
          category: 'Funds can be frozen if',
          text: "there's insufficient liquidity of requested token in escrow and Compound.",
        },
      ],
    },
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: validatorThresholdstring + ' Validator MultiSig',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'Contracts can be upgraded by a ' +
        discovery.getMultisigStats('GnosisBridgeGovernanceMultisig') +
        ' Multisig',
      sentiment: 'bad',
    },
    destinationToken: {
      value: 'Native',
      description:
        'Tokens transferred via this bridge end up as xDAI and are used to pay for gas on the destination chain.',
      sentiment: 'good',
    },
  },
  contracts: {
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails(
          'SDaiForeignBridge',
          'Bridge Contract and Escrow for (s)DAI.',
        ),
        discovery.getContractDetails(
          'BridgeValidators',
          'Validator Management Contract.',
        ),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getMultisigPermission(
          'GnosisBridgeGovernanceMultisig',
          'Can update bridge contracts, validator set, signature thresholds and bridge parameters.',
        ),
        discovery.getPermissionDetails(
          `Participants in the BridgeValidators ${validatorThresholdstring} MultiSig`,
          discovery.getPermissionedAccounts(
            'BridgeValidators',
            'validatorList',
          ),
          'Bridge Validators.',
        ),
      ],
    },
  },
}
