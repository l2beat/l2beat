import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const harmony: Bridge = {
  id: ProjectId('harmony'),
  name: 'Harmony',
  slug: 'harmony',
  type: 'Lock-Mint',
  destination: ['Harmony'],

  validation: 'EV Bridge',
  description: 'Externally Validated Token Bridge secured by a multisig.',
  links: {
    websites: ['https://bridge.harmony.one/erc20'],
  },
  risks: {
    validation: {
      value: 'External',
      description: '2/5 MultiSig',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'No',
      description: '',
    },
    destinationToken: {
      value: 'BridgedToken',
      description:
        'BridgedTokens cannot be upgraded. They can be minted by approved Minters.',
    },
  },
  escrows: [
    {
      address: '0xF9Fb1c508Ff49F78b60d3A96dea99Fa5d7F3A8A6',
      sinceTimestamp: new UnixTime(1610602801),
      tokens: ['ETH'],
    },
    {
      address: '0xfD53b1B4AF84D59B20bF2C20CA89a6BeeAa2c628',
      sinceTimestamp: new UnixTime(1602456041),
      tokens: ['BUSD'],
    },
    {
      address: '0x2dCCDB493827E15a5dC8f8b72147E6c4A5620857',
      sinceTimestamp: new UnixTime(1602456188),
      tokens: [
        'USDC',
        'USDT',
        'WBTC',
        'DAI',
        'FRAX',
        //'AAG',
        'FXS',
        'SUSHI',
        'AAVE',
        'CRV',
        'WETH',
        'MATIC',
      ],
    },
  ],
  connections: [{ network: 'Harmony One', tokens: ['*'] }],
}
