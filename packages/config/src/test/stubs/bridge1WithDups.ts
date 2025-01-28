import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Bridge } from '../../projects/bridges'

export const bridge1WithDups: Bridge = {
  type: 'bridge',
  id: ProjectId('bridge1'),
  addedAt: new UnixTime(1688643599), // 2023-07-06T11:39:59Z
  display: {
    name: 'Bridge1',
    slug: 'bridge1',
    category: 'Token Bridge',
    description: 'Bridge1 description',
    links: {},
  },
  riskView: {
    validatedBy: {
      value: 'Bridge1 Validator',
      sentiment: 'good',
      description: 'Bridge1 Validator',
    },
  },
  config: {
    escrows: [],
  },
  technology: {
    destination: ['Dest chain'],
  },
  contracts: {
    addresses: [
      {
        address: EthereumAddress('0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e'),
        name: 'ForeignAMB Proxy',
        upgradeability: {
          proxyType: 'Custom',
          admins: [
            EthereumAddress('0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6'),
          ],
          implementations: [
            EthereumAddress('0x82B67a43b69914E611710C62e629dAbB2f7AC6AB'),
          ],
        },
        isVerified: true,
      },
      {
        address: EthereumAddress('0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e'),
        name: 'Duplicate ForeignAMB Proxy',
        upgradeability: {
          proxyType: 'Custom',
          admins: [
            EthereumAddress('0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6'),
          ],
          implementations: [
            EthereumAddress('0x82B67a43b69914E611710C62e629dAbB2f7AC6AB'),
          ],
        },
        isVerified: true,
      },
      {
        address: EthereumAddress('0x88ad09518695c6c3712AC10a214bE5109a655671'),
        name: 'ForeignBridge1bridge (Mediator Contract, Escrow)',
        upgradeability: {
          proxyType: 'Custom',
          admins: [
            EthereumAddress('0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6'),
          ],
          implementations: [
            EthereumAddress('0x8eB3b7D8498a6716904577b2579e1c313d48E347'),
          ],
        },
        isVerified: true,
      },
      {
        address: EthereumAddress('0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064'),
        name: 'BridgeValidators',
        upgradeability: {
          proxyType: 'Custom',
          admins: [
            EthereumAddress('0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6'),
          ],
          implementations: [
            EthereumAddress('0xD83893F31AA1B6B9D97C9c70D3492fe38D24d218'),
          ],
        },
        isVerified: true,
      },
      {
        address: EthereumAddress('0x87D48c565D0D85770406D248efd7dc3cbd41e729'),
        name: 'AAVEInterestERC20',
        isVerified: true,
      },
    ],
    risks: [],
  },
  permissions: [
    {
      name: 'Duplicate Layer2a MultiSig',
      accounts: [
        {
          address: EthereumAddress(
            '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
          ),
          type: 'MultiSig',
        },
      ],
      description: '',
    },
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
            '0xbDc141c8D2343f33F40Cb9edD601CcF460CD0dDe',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x674c97db4cE6caC04A124d745979f3E4cBa0E9f0',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x258667E543C913264388B33328337257aF208a8f',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x19aC7c69e5F1AC95b8d49b30Cbb79e81f1ab0dba',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x459A3bd49F1ff109bc90b76125533699AaAAf9A6',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x105CD22eD3D089Bf5589C59b452f9dE0796Ca52d',
          ),
          type: 'EOA',
        },
      ],
      name: 'Participants in BridgeValidators 4/6 MultiSig',
      description: 'Bridge Validators',
    },
  ],
}
