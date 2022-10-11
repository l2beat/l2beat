import { ProjectId, UnixTime } from '@l2beat/types'

import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const omni: Bridge = {
  type: 'bridge',
  id: ProjectId('omni'),
  display: {
    name: 'Omni Bridge',
    slug: 'omni',
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
    description:
      'Omni Bridge is the official bridge of Gnosis Chain. It uses a set of trusted validators to confirm deposits for a Lock-Mint swap. Tokens sent to the bridge escrow can be further sent to yield generating contracts (e.g. AAVE) to accrue interest for external recipient, although this functionality has been disabled at the time of Ethereum Merge.',
  },
  config: {
    associatedTokens: ['GNO'],
    escrows: [
      {
        address: '0x88ad09518695c6c3712AC10a214bE5109a655671',
        sinceTimestamp: new UnixTime(1596501090),
        tokens: ['GNO', 'LINK'],
      },
    ],
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
      ...RISK_VIEW.CANONICAL,
      description:
        RISK_VIEW.CANONICAL.description +
        ' Tokens transferred end up as wrapped ERC677.',
    },
  },
  technology: {
    category: 'Token Bridge',
    destination: ['Gnosis Chain'],
    canonical: true,
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'This is a Lock-Mint bridge that takes ownership of tokens in escrow contracts on Ethereum and mints "representation tokens" on the Gnosis Chain. When bridging back to Ethereum, tokens are burned on the Gnosis Chain and then released from the escrow on Ethereum. Tokens in Ethereum escrow are not effectively locked, as deposited tokens can be invested to generate yield (interest is intended to go to GnosisDAO). Bridge contract enables its owner (currently 7/16 Multisig) to specify or disable a separate external contract with investment logic. Currently investment contracts have been disabled around the time of the Ethereum Merge. Previously used investment contract sent part of deposited USDC and USDT to Aave. A special care needs to be taken when bridging xDai token that is native to Gnosis Chain. There\'s a separate bridge for xDai and Omni bridge should not be used, as it mints non-native "representation version" of xDai.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'Omni bridge is built on top of Arbitrary Message Bridge (AMB), a trusted cross-chain message relaying mechanism currently validated by a 4/6 Validator MultiSig. A separate Governor 7/16 Multisig is used for updating validator set, signature thresholds, bridge parameters and bridge contracts. For Omni bridge, messages are passed between "Mediator" contracts deployed on both chains. When user deposits a token to Mediator escrow on Ethereum, an AMB message is passed to Mediator on Gnosis chain, which mints a "representation token", optionally deploying a necessary token contract on Gnosis chain if this is the first time this token is transferred. Transfers from Gnosis chain to Ethereum use the same mechanism in the opposite direction but tokens on Gnosis are burned and tokens on Ethereum are released from escrow.',
      references: [
        {
          text: 'Omnibridge documentation',
          href: 'https://docs.gnosischain.com/bridges/tokenbridge/omnibridge',
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
          text: "there's an exploit in contracts that invest user deposit.",
          isCritical: true,
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
  },
  contracts: {
    addresses: [
      {
        address: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
        name: 'ForeignAMB Proxy',
        description:
          'Arbitrary Message Bridge (behind custom upgradeable proxy).',
        upgradeability: {
          type: 'Custom',
          admin: '0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6',
          implementation: '0x82B67a43b69914E611710C62e629dAbB2f7AC6AB',
        },
      },
      {
        address: '0x88ad09518695c6c3712AC10a214bE5109a655671',
        name: 'ForeignOmnibridge (Mediator Contract, Escrow)',
        description: 'Mediator Contract and Escrow.',
        upgradeability: {
          type: 'Custom',
          admin: '0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6',
          implementation: '0x8eB3b7D8498a6716904577b2579e1c313d48E347',
        },
      },
      {
        address: '0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064',
        name: 'BridgeValidators',
        description: 'Validator Management Contract, acts as 4/6 MultiSig.',
        upgradeability: {
          type: 'Custom',
          admin: '0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6',
          implementation: '0xD83893F31AA1B6B9D97C9c70D3492fe38D24d218',
        },
      },
      {
        address: '0x87D48c565D0D85770406D248efd7dc3cbd41e729',
        name: 'AAVEInterestERC20',
        description:
          'Recently used investment contract which sends specified amount of deposited USDC & USDT tokens to Aave. Governed by 7/16 Bridge Governance Multisig.',
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      accounts: [
        {
          address: '0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6',
          type: 'MultiSig',
        },
      ],
      name: 'Bridge Governance 7/16 MultiSig',
      description:
        'Can update bridge contracts, validator set, signature thresholds and bridge parameters',
    },
    {
      accounts: [
        { address: '0xb8173f558f75EE263013fd6294177bf75279a21e', type: 'EOA' },
        { address: '0xDdf2d07267EAF2cE3E13ee4319bE1F34D55ed992', type: 'EOA' },
        { address: '0x262d23a2d916f6CF08e0235315aA51E22d142d0b', type: 'EOA' },
        { address: '0x86Da253817DC599059e3AD5A1F098F7b96aBf34c', type: 'EOA' },
        { address: '0x1685324Bf373670ad5C9c56bd88A1dc1C063b0f9', type: 'EOA' },
        { address: '0x0101016044726994aFd16f4A99f0d960090D35e7', type: 'EOA' },
        { address: '0x0f49459e26aBB496C9B5f46b0bfd7bDEb8Ec0bdC', type: 'EOA' },
        { address: '0x81f202D0E73894dA6966BF5AabC85d6Ce3aC91f8', type: 'EOA' },
        { address: '0x839395e20bbB182fa440d08F850E6c7A8f6F0780', type: 'EOA' },
        { address: '0x3615Fa045f00ae0eD60Dc0141911757c2AdC5E03', type: 'EOA' },
        { address: '0x10DD75875a2a8a284529Ae7223B1aCE410d606bd', type: 'EOA' },
        { address: '0x80BA18503a1Fa16Ea22F3ef1Af23e2994EaC1d97', type: 'EOA' },
        { address: '0xd26a3F686D43f2A62BA9eaE2ff77e9f516d945B9', type: 'EOA' },
        { address: '0x865c2F85C9fEa1C6Ac7F53de07554D68cB92eD88', type: 'EOA' },
        { address: '0x57B11cC8F93f2cfeC4c1C5B95213f17cAD81332B', type: 'EOA' },
        { address: '0xF96E3bb5e06DaA129B9981E1467e2DeDd6451DbE', type: 'EOA' },
      ],
      name: 'Participants in Bridge Governance 7/16 MultiSig',
      description: 'Participants in Bridge Governance 7/16 MultiSig',
    },
    {
      accounts: [
        { address: '0xbDc141c8D2343f33F40Cb9edD601CcF460CD0dDe', type: 'EOA' },
        { address: '0x674c97db4cE6caC04A124d745979f3E4cBa0E9f0', type: 'EOA' },
        { address: '0x258667E543C913264388B33328337257aF208a8f', type: 'EOA' },
        { address: '0x19aC7c69e5F1AC95b8d49b30Cbb79e81f1ab0dba', type: 'EOA' },
        { address: '0x459A3bd49F1ff109bc90b76125533699AaAAf9A6', type: 'EOA' },
        { address: '0x105CD22eD3D089Bf5589C59b452f9dE0796Ca52d', type: 'EOA' },
      ],
      name: 'Participants in BridgeValidators 4/6 MultiSig',
      description: 'Bridge Validators',
    },
  ],
}
