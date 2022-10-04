import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const avalanche: Bridge = {
  type: 'bridge',
  id: ProjectId('avalanche'),
  display: {
    name: 'Avalanche Bridge',
    slug: 'avalanche',
    description:
      'Avalanche Bridge is an externally validated bridge. It uses a set of Wardens using secure SGX Enclave to sign transfers. On Ethereum side it uses periodically rotated EOA address for an Escrow. In the announcement, 3 out of 4 Warden signatures are required, however the exact number is impossible to verify for an external observer.',
    links: {
      websites: ['https://www.avax.network/'],
      explorers: ['https://subnets.avax.network/'],
      apps: ['https://bridge.avax.network/'],
      repositories: ['https://github.com/ava-labs'],
      socialMedia: [
        'https://twitter.com/avalancheavax',
        'https://t.me/avalancheavax',
        'https://discord.gg/RwXY7P6',
      ],
    },
  },
  config: {
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
  },
  riskView: {
    validation: {
      value: 'External',
      description: '6/8 Intel SGX',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'EOA',
      description: 'Avalanche Bridge uses EOA for Escrow',
      sentiment: 'bad',
    },
    destinationToken: {
      value: 'Wrapped',
      description:
        'Tokens transferred end up as wrapped ERC20 proxies, the contract is named BridgeToken',
      sentiment: 'bad',
    },
  },
  technology: {
    canonical: true,
    category: 'Lock-Mint',
    destination: ['Avalanche'],
  },
  permissions: [
    {
      name: 'Escrow owner',
      description:
        'Controls all the funds deposited to the bridge. The owner of this account can potentially withdraw all the funds. In the event of potential private key exploit the hacker can quickly drain all the funds.',
      accounts: [
        {
          address: '0x8EB8a3b98659Cce290402893d0123abb75E3ab28',
          type: 'EOA',
        },
      ],
    },
  ],
}
