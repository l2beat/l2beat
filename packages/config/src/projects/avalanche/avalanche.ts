import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('avalanche')

export const avalanche: Bridge = {
  type: 'bridge',
  id: ProjectId('avalanche'),
  addedAt: UnixTime(1662628329), // 2022-09-08T09:12:09Z
  display: {
    name: 'Avalanche Bridge',
    slug: 'avalanche',
    description:
      'Avalanche Bridge is an externally validated bridge. It uses a set of Wardens using secure SGX Enclave to sign transfers. On Ethereum side it uses periodically rotated EOA address for an Escrow. In the announcement, 3 out of 4 Warden signatures are required, however the exact number is impossible to verify for an external observer.',
    category: 'Single-chain',
    links: {
      websites: ['https://avax.network/'],
      explorers: ['https://subnets.avax.network/'],
      bridges: ['https://bridge.avax.network/'],
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
        sinceTimestamp: UnixTime(1634135918),
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
        sinceTimestamp: UnixTime(1657207546),
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
    apis: [],
  },
  riskView: {
    validatedBy: {
      value: 'Offchain 6/8',
      description:
        'A 6/8 Intel SGX allegedgly controls the escrowing EOA. Identities of the signers are not publicly disclosed.',
      sentiment: 'bad',
    },
    governance: {
      upgrade: {
        value: 'EOA',
        description: 'Avalanche Bridge uses an EOA as escrow.',
        sentiment: 'bad',
      },
      pause: {
        value: 'EOA',
        sentiment: 'bad',
        description:
          'There is no formal pause function as this bridge does not use smart contracts, but the operator can stop processing messages anytime.',
      },
    },
    livenessFailure: {
      value: 'No mechanism',
      description:
        'If the operators do not service the bridge, deposited funds do not arrive at the destination chain and are stuck.',
      sentiment: 'bad',
    },
    destinationToken: {
      value: 'Wrapped',
      description:
        'Tokens transferred end up as wrapped ERC20 tokens, the contract implementation is named BridgeToken',
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
            ChainSpecificAddress(
              'eth:0x8EB8a3b98659Cce290402893d0123abb75E3ab28',
            ),
          ]),
          'Off-chain Multisig 6/8 (EOA on Ethereum) using Intel SGX, which controls all the funds deposited to the bridge. There is no possibility to verify whether Intel SGX technology is being used.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
