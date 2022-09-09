import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const avalanche: Bridge = {
  id: ProjectId('avalanche'),
  name: 'Avalanche',
  slug: 'avalanche',
  description:
    'Avalanche Bridge is an externally validated bridge. It uses a set of Wardens using secure SGX Enclave to sign tansfers. On Ethereum side it uses periodically rotated EOA address for an Escdrow. In the announcement, 3 out of 4 Warden signatures are required, however the exact number is impossible to verify for an external observer.',
  validation: 'EV Bridge',
  links: {
    websites: ['https://bridge.avax.network/'],
  },
  escrows: [
    {
      address: '0xE78388b4CE79068e89Bf8aA7f218eF6b9AB0e9d0', // old
      sinceTimestamp: new UnixTime(1634135918),
      tokens: [
        'ETH',
        'USDC',
        'WETH',
        'WBTC',
        'USDT',
        'DAI',
        'LINK',
        'WOO',
        'AAVE',
        //'SWAP',
        'BUSD',
        'SUSHI',
        'SHIB',
        'UNI',
        'GRT',
        'MKR',
      ],
    },
    {
      address: '0x8EB8a3b98659Cce290402893d0123abb75E3ab28', // new
      sinceTimestamp: new UnixTime(1657207546),
      tokens: [
        'ETH',
        'USDC',
        'WETH',
        'WBTC',
        'USDT',
        'DAI',
        'LINK',
        'WOO',
        'AAVE',
        //'SWAP',
        'BUSD',
        'SUSHI',
        'SHIB',
        'UNI',
        'GRT',
        'MKR',
      ],
    },
  ],
  connections: [{ network: 'Avalanche', tokens: ['*'] }],
}
