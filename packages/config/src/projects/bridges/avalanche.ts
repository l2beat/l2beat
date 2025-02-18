import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { NUGGETS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../types'

const discovery = new ProjectDiscovery('avalanche')

export const avalanche: Bridge = {
  type: 'bridge',
  id: ProjectId('avalanche'),
  addedAt: new UnixTime(1662628329), // 2022-09-08T09:12:09Z
  display: {
    name: 'Avalanche Bridge',
    slug: 'avalanche',
    description:
      'Avalanche Bridge is an externally validated bridge. It uses a set of Wardens using secure SGX Enclave to sign transfers. On Ethereum side it uses periodically rotated EOA address for an Escrow. In the announcement, 3 out of 4 Warden signatures are required, however the exact number is impossible to verify for an external observer.',
    category: 'Token Bridge',
    links: {
      websites: ['https://avax.network/'],
      explorers: ['https://subnets.avax.network/'],
      apps: ['https://bridge.avax.network/'],
      repositories: ['https://github.com/ava-labs'],
      socialMedia: [
        'https://twitter.com/avax',
        'https://t.me/avalancheavax',
        'https://discord.gg/RwXY7P6',
        'https://linkedin.com/company/avalancheavax',
        'https://facebook.com/avalancheavax',
        'https://youtube.com/@Avalancheavax',
        'https://reddit.com/r/avax/',
      ],
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0xE78388b4CE79068e89Bf8aA7f218eF6b9AB0e9d0'), // old
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
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x8EB8a3b98659Cce290402893d0123abb75E3ab28'), // new
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
        chain: 'ethereum',
      },
    ],
  },
  chainConfig: {
    name: 'avalanche',
    chainId: 43114,
    explorerUrl: 'https://snowtrace.io',
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 11907934,
        version: '3',
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
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
    destination: ['Avalanche'],
    canonical: true,
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Avalanche Bridge is a Token Bridge that locks tokens in the escrow account and mints tokens on Avalanche network. When bridging back to Ethereum tokens are burned on Avalanche and transferred back to the receiver on Ethereum.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'Outgoing transfers on Ethereum side are being watched by external entity which informs Avalanche side of the bridge about incoming transfer. The mechanism in other direction works very similar, users can burn tokens signaling external entity intention to transfer, which later informs Ethereum Bridge Wardens about incoming transfer.',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'wardens decide to maliciously takeover them or there is an external exploit which will result in signing malicious transaction.',
        },
        {
          category: 'Users can be censored if',
          text: 'wardens decide to censor certain transactions.',
        },
        {
          category: 'Funds can be lost if',
          text: 'wardens loose the private key.',
        },
        {
          category: 'Funds can be frozen if',
          text: 'wardens decide to stop processing transfers.',
        },
      ],
      isIncomplete: true,
    },
    destinationToken: {
      name: 'Destination tokens are wrapped',
      description:
        'Tokens transferred end up as wrapped ERC20 proxies. The contract is named BridgeToken.',
      references: [],
      risks: [],
      isIncomplete: true,
    },
  },
  contracts: {
    addresses: {},
    risks: [],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'Bridge Wardens',
          discovery.formatPermissionedAccounts([
            EthereumAddress('0x8EB8a3b98659Cce290402893d0123abb75E3ab28'),
          ]),
          'Off-chain Multisig 6/8 using Intel SGX, which controls all the funds deposited to the bridge. There is no possibility to verify whether Intel SGX technology is being used.',
        ),
      ],
    },
  },
  knowledgeNuggets: [
    {
      title: 'Avalanche Bridge deep dive',
      url: 'https://li.fi/knowledge-hub/avalanche-bridge-a-deep-dive/',
      thumbnail: NUGGETS.THUMBNAILS.LIFI_01,
    },
  ],
}
