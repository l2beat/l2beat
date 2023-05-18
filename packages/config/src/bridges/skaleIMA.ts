import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { Bridge } from './types'

export const skaleIMA: Bridge = {
  type: 'bridge',
  id: ProjectId('skale-ima'),
  display: {
    name: 'SKALE IMA Bridge',
    slug: 'skale-ima',
    links: {
      websites: ['https://skale.space'],
      apps: ['https://bridge.skale.network'],
      socialMedia: [
        'https://twitter.com/SkaleNetwork',
        'https://t.me/skaleofficial',
        'https://youtube.com/channel/UCpUk0eMmD00C7RXLT0g8SuA',
        'https://www.reddit.com/r/skalenetwork/',
        'https://www.linkedin.com/company/skale-labs/',
      ],
      documentation: [
        'https://docs.skale.network/ima/1.4.x/',
        'https://mainnet.skalenodes.com',
      ],
      repositories: ['https://github.com/skalenetwork/IMA'],
      explorers: ['https://elated-tan-skat.explorer.mainnet.skalenodes.com'],
    },
    description:
      'SKALE IMA Bridge is a part of SKALE Network ecosystem. It is a cross-chain BLS threshold bridge that allows users to transfer tokens and arbitrary messages between supported blockchains.',
  },
  config: {
    associatedTokens: ['SKL'],
    escrows: [
      {
        address: EthereumAddress('0x49F583d263e4Ef938b9E09772D3394c71605Df94'),
        sinceTimestamp: new UnixTime(1626719733),
        tokens: ['ETH'],
      },
      {
        address: EthereumAddress('0x8fB1A35bB6fB9c47Fb5065BE5062cB8dC1687669'),
        sinceTimestamp: new UnixTime(1626719900),
        tokens: [
          // 'RAZOR',
          'USDP',
          'USDC',
          'SKL',
          'DAI',
          'USDT',
          'WBTC',
          // 'HMT',
          'LINK',
        ],
      },
    ],
  },
  technology: {
    category: 'Token Bridge',
    //TODO: Originally for SKALE chains, it supports transfers between all SKALE chains and between each SKALE chain and Ethereum, currently there are 20 chains in the network, but the number is increasing
    destination: ['Ethereum', 'SKALE'],
    principleOfOperation: {
      name: 'Principle of Operation',
      description:
        'It is a cross-chain BLS threshold bridge that allows users to transfer Eth, ERC20, ERC721, ERC1155 and arbitrary messages between Ethereum and SKALE chains without fees and between SKALE chains without gas fees. Locks/Unlocks on main chain(Ethereum or SKALE chain which is origin of the asset), Burns/Mints on target chain.',
      references: [
        {
          text: 'Bridging transactions',
          href: 'https://bridge-docs.orbitchain.io/bridging-transaction',
        },
      ],
      risks: [],
      isIncomplete: true,
    },
    validation: {
      name: 'Validation',
      description:
        'SKALE IMA Bridge operates on SKALE Network nodes for connected SKALE chain. Each node validates a tx and sign tx by BLS secret key and one of the node send tx to the SKALE chain or Ethereum when 11 out of 16 nodes validated and signed the tx.',
      references: [
        {
          text: 'SKALE IMA Bridge - Overview',
          href: 'https://docs.skale.network/ima/1.4.x/',
        },
      ],
      risks: [],
      isIncomplete: true,
    },
  },
  riskView: {},
  contracts: {
    addresses: [
      {
        address: EthereumAddress('0x49F583d263e4Ef938b9E09772D3394c71605Df94'),
        name: 'DepositBoxEth',
        description:
          'Bridge contract to transfer ETH to Skale chains, Proxy, Source code of implementation is verified on Etherscan.',
      },
      {
        address: EthereumAddress('0x8fB1A35bB6fB9c47Fb5065BE5062cB8dC1687669'),
        name: 'DepositBoxERC20',
        description:
          'Bridge contract to transfer ERC20 tokens to Skale chains, Proxy, Source code of implementation is verified on Etherscan.',
      },
      {
        address: EthereumAddress('0x7343d31eb99Fd31424bcca9f0a7EAFBc1F515f2d'),
        name: 'DepositBoxERC721',
        description:
          'Bridge contract to transfer ERC721 tokens to Skale chains, Proxy, Source code of implementation is verified on Etherscan.',
      },
      {
        address: EthereumAddress('0x3C02FdEe8E05B6dc4d44a6555b3ff5762D03871a'),
        name: 'DepositBoxERC1155',
        description:
          'Bridge contract to transfer ERC1155 tokens to Skale chains, Proxy, Source code of implementation is verified on Etherscan.',
      },
      {
        address: EthereumAddress('0x9f8196D864ee9476bF8DBE68aD07cc555d6B7986'),
        name: 'DepositBoxERC721withMetadata',
        description:
          'Bridge contract to transfer ERC721 tokens with metadata to Skale chains, Proxy, Source code of implementation is verified on Etherscan.',
      },
    ],
    risks: [],
  },
  permissions: [],
}
