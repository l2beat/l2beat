import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../layer2s/common'
import { Bridge } from './types'

export const xdai: Bridge = {
  type: 'bridge',
  id: ProjectId('xdai'),
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
      'xDai Bridge is the official bridge dedicated to transferring Dai from Ethereum into xDai on Gnosis Chain. It uses a set of trusted validators to confirm deposits for a Lock-Mint swap. Tokens sent to the bridge escrow can be further sent to Compound to generate interest for external recipient, although this functionality has been disabled at the time of Ethereum Merge.',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016'),
        sinceTimestamp: new UnixTime(1539028166),
        tokens: ['cDAI', 'DAI'],
      },
    ],
  },
  technology: {
    destination: ['Gnosis Chain'],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        "xDai Bridge is the native Gnosis Chain bridge for swapping Dai on Ethereum into xDai on Gnosis, which is the native asset used for gas and transaction fees. Due to this native aspect of xDai it is minted via block reward contract by Gnosis consensus mechanism. Specifically, when a user deposits Dai to Bridge Contract on Ethereum, it is noticed by an external Bridge Validator Oracle service (4/6 Multisig). After collecting required signatures, the service calls a Bridge Contract on the Gnosis chain which instructs a Block Reward Contract that recipient's xDai balance needs to be increased (as an EVM state update by consensus engine). To transfer xDai to Ethereum, a user deposits xDai to Bridge Contract on Gnosis chain, which is then burned. The Bridge Validator Service provides required signatures for a Bridge Contract on Ethereum which releases Dai to the user. Bridge contract on Ethereum supports sending deposited tokens to Compound to accrue yield, which can be transferred to EOA account with intention to be spent on supporting bridge operations.",
      references: [
        {
          text: 'xDai Bridge Documentation',
          href: 'https://docs.gnosischain.com/bridges/tokenbridge/xdai-bridge',
        },
        {
          text: 'Earning yield on Bridge Deposit',
          href: 'https://docs.gnosischain.com/bridges/tokenbridge/xdai-bridge#earning-yield-on-bridge-deposits',
        },
      ],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'Dai and xDai deposits to Bridge Contracts are validated by a 4/6 Validator MultiSig. A separate Governor 7/16 Multisig is used for updating validator set, signature thresholds, bridge parameters and bridge contracts.',
      references: [
        {
          text: 'xDai Bridge Documentation',
          href: 'https://docs.gnosischain.com/bridges/tokenbridge/xdai-bridge',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'validators decide to not pass selected messages between chains.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators relay a fake message to Gnosis chain to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators relay a fake message to Ethereum chain allowing a user to withdraw tokens from Ethereum escrow when equivalent amount of tokens has not been deposited and burned on Gnosis chain.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: "there's an exploit in Compound when it holds part of user deposit.",
          isCritical: true,
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
      description: '4/6 Validator MultiSig',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description: 'Contracts can be upgraded by 7/16 MultiSig',
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
    addresses: [
      {
        address: EthereumAddress('0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016'),
        name: 'XDaiForeignBridge',
        description: 'xDai Bridge Contract (Escrow).',
        upgradeability: {
          type: 'Custom',
          admin: EthereumAddress('0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6'),
          implementation: EthereumAddress(
            '0xEeE4f8dB4410beBD74A76cB711D096c5E66d0473',
          ),
        },
      },
      {
        address: EthereumAddress('0xe1579dEbdD2DF16Ebdb9db8694391fa74EeA201E'),
        name: 'BridgeValidators',
        description: 'Validator Management Contract.',
        upgradeability: {
          type: 'Custom',
          admin: EthereumAddress('0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6'),
          implementation: EthereumAddress(
            '0x6943A218d58135793F1FE619414eD476C37ad65a',
          ),
        },
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6',
          ),
          type: 'MultiSig',
        },
      ],
      name: 'Bridge Governance 7/16 MultiSig',
      description:
        'Can update bridge contracts, validator set, signature thresholds and bridge parameters',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0xb8173f558f75EE263013fd6294177bf75279a21e',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xDdf2d07267EAF2cE3E13ee4319bE1F34D55ed992',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x262d23a2d916f6CF08e0235315aA51E22d142d0b',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x86Da253817DC599059e3AD5A1F098F7b96aBf34c',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x1685324Bf373670ad5C9c56bd88A1dc1C063b0f9',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x0101016044726994aFd16f4A99f0d960090D35e7',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x0f49459e26aBB496C9B5f46b0bfd7bDEb8Ec0bdC',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x81f202D0E73894dA6966BF5AabC85d6Ce3aC91f8',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x839395e20bbB182fa440d08F850E6c7A8f6F0780',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x3615Fa045f00ae0eD60Dc0141911757c2AdC5E03',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x10DD75875a2a8a284529Ae7223B1aCE410d606bd',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x80BA18503a1Fa16Ea22F3ef1Af23e2994EaC1d97',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xd26a3F686D43f2A62BA9eaE2ff77e9f516d945B9',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x865c2F85C9fEa1C6Ac7F53de07554D68cB92eD88',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x57B11cC8F93f2cfeC4c1C5B95213f17cAD81332B',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xF96E3bb5e06DaA129B9981E1467e2DeDd6451DbE',
          ),
          type: 'EOA',
        },
      ],
      name: 'Participants in Bridge Governance 7/16 MultiSig',
      description: 'Participants in Bridge Governance 7/16 MultiSig',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x97630E2aE609D4104aBdA91F3066C556403182dd',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x587C0d02B40822f15f05301d87c16f6a08AaDDde',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x1312E98995bbCc30fc63Db3cef807e20CDd33dca',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xfe24Cfb2F8872e9ed097C451dE065A9F6048915b',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x4D1c96B9A49C4469A0b720a22b74b034EDdFe051',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xc073C8E5ED9Aa11CF6776C69b3e13b259Ba9F506',
          ),
          type: 'EOA',
        },
      ],
      name: 'Participants in BridgeValidators 4/6 MultiSig',
      description: 'Bridge Validators',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x5eD64f02588C8B75582f2f8eFd7A5521e3F897CC',
          ),
          type: 'EOA',
        },
      ],
      name: 'Interest Receiver',
      description:
        'Address set to receive interest from investing deposited tokens.',
    },
  ],
}
