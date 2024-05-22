import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const zklinknova: Layer3 = underReviewL3({
  id: 'zklinknova',
  // TODO(Linea, zkSync Era): zkLink Nexus is a multi-chain zkRollup architecture. In addition to Linea, it currently supports zkSync Era and will support more Layer2s in the future.
  hostChain: 'Multiple',
  display: {
    name: 'zkLink Nova',
    slug: 'zklinknova',
    description:
      'zkLink Nova is a multi-chain rollup infrastructure based on zero-knowledge technology.',
    purposes: ['Universal'],
    category: 'Validium',
    provider: 'zkLink Nexus',
    links: {
      websites: ['https://zk.link'],
      apps: ['https://playground-nexus.zk.link'],
      documentation: ['https://docs.zk.link'],
      explorers: ['https://scan-nexus.zk.link'],
      repositories: ['https://github.com/zkLinkProtocol'],
      socialMedia: [
        'https://blog.zk.link',
        'https://twitter.com/zkLink_Official',
        'http://discord.gg/zklink',
        'https://t.me/zkLinkorg',
      ],
    },
  },
  escrows: [
    {
      chain: 'optimism',
      includeInTotal: false,
      address: EthereumAddress('0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b'),
      sinceTimestamp: new UnixTime(1711092485),
      tokens: ['ETH'],
    },
    {
      chain: 'optimism',
      includeInTotal: false,
      address: EthereumAddress('0x5Bd51296423A9079b931414C1De65e7057326EaA'),
      sinceTimestamp: new UnixTime(1711095511),
      tokens: '*', //e.g. OP, USDT, USDC, DAI, WBTC...
    },
    {
      chain: 'linea',
      includeInTotal: false,
      address: EthereumAddress('0x5Cb18b6e4e6F3b46Ce646b0f4704D53724C5Df05'),
      sinceTimestamp: new UnixTime(1709218085),
      tokens: ['ETH'],
    },
    {
      chain: 'linea',
      includeInTotal: false,
      address: EthereumAddress('0x62cE247f34dc316f93D3830e4Bf10959FCe630f8'),
      sinceTimestamp: new UnixTime(1709218113),
      tokens: '*', // e.g. ezETH, USDT, USDC.e, WBTC
    },
    {
      chain: 'ethereum',
      includeInTotal: false,
      address: EthereumAddress('0x5fD9F73286b7E8683Bab45019C94553b93e015Cf'),
      sinceTimestamp: new UnixTime(1709278799),
      tokens: ['ETH'],
    },
    {
      chain: 'ethereum',
      includeInTotal: false,
      address: EthereumAddress('0xAd16eDCF7DEB7e90096A259c81269d811544B6B6'),
      sinceTimestamp: new UnixTime(1709295323),
      tokens: '*', // e.g. pufETH, WBTC, ezETH, weETH, ARPA, CYBER wstETH
    },
    // {
    //   chain: 'arbitrum',
    //   includeInTotal: false,
    //   ...discovery.getEscrowDetails({
    //     address: EthereumAddress('0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b'),
    //     tokens: '*',
    //     description:
    //       'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
    //   }),
    // },
  ],
})