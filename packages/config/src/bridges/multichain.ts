import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

/* TODO: Get tokens from SwapOut entries
Note: Timestamp is entered manually as all these accounts are EOAs
*/

export const multichain: Bridge = {
  id: ProjectId('multichain'),
  name: 'Multichain',
  slug: 'multichain',
  validation: 'EV Bridge and LN',
  description:
    'Multichain is an externally validated bridge. It uses a network of nodes running SMPC (Secure Multi Party Computation) protocol. It supports dozens of blockchains and thousands of tokens with both Token Bridge and Liquidity Network.',
  links: {
    websites: ['https://multichain.xyz/'],
  },
  escrows: [
    {
      address: '0xC564EE9f21Ed8A2d8E7e76c085740d5e4c5FaFbE', // Fantom
      sinceTimestamp: new UnixTime(1621464847),
      tokens: [
        'USDC',
        'WBTC',
        'DAI',
        'WETH',
        'FRAX',
        //'DOLA',
        'LINK',
        'YFI',
        'CRV',
        'TUSD',
        'FXS',
        //'WOOFY',
      ],
    },
    {
      address: '0x13B432914A996b0A48695dF9B2d701edA45FF264', // BSC
      sinceTimestamp: new UnixTime(1603967461),
      tokens: ['COMP', 'OMG', 'UNI', 'SUPER'],
    },
    {
      address: '0x46290B0c3A234E3d538050d8F34421797532A827', // Fusion
      sinceTimestamp: new UnixTime(1603878551),
      tokens: ['COMP', 'DAI', 'WETH', 'LINK', 'OMG', 'UNI', 'USDT', 'YFI'],
    },
    {
      address: '0x353B98DDc927173005dD8B293B043Bd950cDA468', // RSK
      sinceTimestamp: new UnixTime(1648556921),
      tokens: ['DAI', 'WETH', 'USDC', 'WBTC'],
    },
    {
      address: '0x8cC49FE67A4bD7a15674c4ffD4E969D94304BBbf', //Syscoin Mainnet
      sinceTimestamp: new UnixTime(1640232068),
      tokens: ['DAI', 'WETH', 'USDT', 'TUSD', 'USDC', 'WBTC'],
    },
    {
      address: '0x7F923dB3d90047D75D078e29b1f8Eac03e30F761', // Ethereum Classic
      sinceTimestamp: new UnixTime(1653727408),
      tokens: ['DAI', 'WETH', 'USDT', 'USDC', 'WBTC'],
    },
    {
      address: '0xCDd83050f045ab31B884f0Dc49581BC7b3e0B84C', //Velas EVM Mainnet
      sinceTimestamp: new UnixTime(1644314057),
      tokens: ['DAI', 'WBTC'],
    },
    {
      address: '0x4E67df0f232C3bc985F8a63326D80ce3d9A40400', //Shiden
      sinceTimestamp: new UnixTime(1633774886),
      tokens: ['DAI', 'WETH', 'LINK', 'USDT', 'USDC', 'WBTC'],
    },
    {
      address: '0x373590a576ccb8143f377DB5f1c16F9f8528a8B4', //Conflux eSpace
      sinceTimestamp: new UnixTime(1647431776),
      tokens: ['DAI', 'WETH', 'USDT', 'USDC', 'WBTC'],
    },
    {
      address: '0xEC4486a90371c9b66f499Ff3936F29f0D5AF8b7E', //Moonbeam
      sinceTimestamp: new UnixTime(1641977895),
      tokens: ['DAI', 'WETH', 'USDT', 'AAVE', 'CRV', 'SUSHI', 'USDC', 'WBTC'],
    },
    {
      address: '0x10c6b61DbF44a083Aec3780aCF769C77BE747E23', //Moonriver
      sinceTimestamp: new UnixTime(1630688114),
      tokens: [
        'DAI',
        'WETH',
        'LINK',
        'UNI',
        'USDT',
        'YFI',
        'FRAX',
        'FXS',
        'OCEAN',
        'AAVE',
        'CRV',
        'SNX',
        'SUSHI',
        'USDC',
        'WBTC',
      ],
    },
    {
      address: '0x55F089d5f6aeDfdACBD5E3aCB0e8F31FBAb44088', //Dogechain
      sinceTimestamp: new UnixTime(1659327840),
      tokens: ['DAI', 'WETH', 'USDT', 'FRAX', 'FXS', 'USDC', 'WBTC'],
    },
    {
      address: '0xbd40733A2F223fF32195a759a81df25E35DD4dEA', //Milkomeda C1 Mainnet
      sinceTimestamp: new UnixTime(1648298611),
      tokens: [
        'DAI',
        'WETH',
        'UNI',
        'USDT',
        'AAVE',
        'SNX',
        'USDC',
        'WBTC',
        'SAND',
        'AXS',
        'MANA',
      ],
    },
    {
      address: '0xF62385C78f3BDBff33145703546b0377853AAa77', // Evmos 1651243633
      sinceTimestamp: new UnixTime(1651243633),
      tokens: ['DAI', 'WETH', 'USDT', 'USDC', 'WBTC'],
    },
    {
      address: '0xE4cf417081A0Ab3f964b44D904BC2b534351A9a7', //Emerald Paratime Mainnet 1644232219
      sinceTimestamp: new UnixTime(1644232219),
      tokens: ['DAI', 'WETH', 'USDC', 'WBTC'],
    },
    {
      address: '0x896be9f48b225154593A84b382d927F9d7Bc2361', // REI Network
      sinceTimestamp: new UnixTime(1649770011),
      tokens: ['DAI', 'WETH', 'USDT', 'USDC', 'WBTC'],
    },
    {
      address: '0x57ed6BD35a6CE815079855CD0b21331d1D5D0A0e', //Telos EVM Mainnet
      sinceTimestamp: new UnixTime(1637074549),
      tokens: ['WETH', 'USDT', 'SUSHI', 'USDC', 'WBTC'],
    },
    {
      address: '0x87bCB3038988ca2A89605fFa8f237FB78Df1c3Ae', // Fuse
      sinceTimestamp: new UnixTime(1639549406),
      tokens: ['WETH'],
    },
    {
      address: '0x533e3c0e6b48010873B947bddC4721b1bDFF9648', // BSC (Old)
      sinceTimestamp: new UnixTime(1615022851),
      tokens: [
        'ACH',
        'BFC',
        'FRAX',
        'FXS',
        'OCEAN',
        'PEOPLE',
        'REQ',
        'AMP',
        // 'OCT',
        'ORBS',
      ],
    },
    {
      address: '0x183D0dC5867c01bFB1dbBc41d6a9d3dE6e044626', // Arbitrum ONE
      sinceTimestamp: new UnixTime(1632319221),
      tokens: ['FRAX', 'FXS'],
    },
    {
      address: '0x820A9eb227BF770A9dd28829380d53B76eAf1209', // Avalanche C-Chain
      sinceTimestamp: new UnixTime(1616747753),
      tokens: ['FRAX', 'FXS', 'AMP', 'ORBS', 'CRV', 'ANKR'],
    },
  ],
  connections: [],
}
