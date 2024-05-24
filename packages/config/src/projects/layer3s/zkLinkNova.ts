import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const zklinknova: Layer3 = underReviewL3({
  id: 'zklinknova',
  // TODO(Linea, zkSync Era): zkLink Nexus is a multi-chain zkRollup architecture. In addition to Linea, it currently supports zkSync Era and will support more Layer2s in the future.
  hostChain: ProjectId('linea'),
  display: {
    name: 'zkLink Nova',
    slug: 'zklinknova',
    description:
      'zkLink Nova is a Layer 3 zkEVM Rollup network leveraging ZK Stack that allows for scattered assets across Ethereum Layer 2s to be aggregated for interoperable trade and transactions.',
    purposes: ['Universal'],
    category: 'Validium',
    provider: 'zkLink Nexus',
    links: {
      websites: ['https://zklink.io', 'https://zk.link'],
      apps: ['https://app.zklink.io', 'https://portal.zklink.io'],
      documentation: ['https://docs.zklink.io'],
      explorers: ['https://explorer.zklink.io'],
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
      tokens: '*', // missing ~450k: USDT, wBTC, DAI
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
      tokens: '*', // missing ~ 800k: USDT, USDC.e, wBTC
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
      tokens: '*', // missing ~5M: ARPA, CYBER, BEL
    },
    {
      chain: 'mantapacific',
      includeInTotal: false,
      address: EthereumAddress('0xd784d7128b46b60ca7d8bdc17dcec94917455657'),
      sinceTimestamp: new UnixTime(1709279099),
      tokens: ['ETH'],
    },
    {
      chain: 'mantapacific',
      includeInTotal: false,
      address: EthereumAddress('0x44a65dc12865a1e5249b45b4868f32b0e37168ff'),
      sinceTimestamp: new UnixTime(1709295839),
      tokens: '*', // missing ~3M: wUSDM, USDC, USDT
    },
    {
      chain: 'mantle',
      includeInTotal: false,
      address: EthereumAddress('0xD784d7128B46B60Ca7d8BdC17dCEC94917455657'),
      sinceTimestamp: new UnixTime(1709279309),
      tokens: ['ETH'],
    },
    {
      chain: 'mantle',
      includeInTotal: false,
      address: EthereumAddress('0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2'),
      sinceTimestamp: new UnixTime(1709296907),
      tokens: '*', // missing ~12M: wMNT, mETH, USDT, USDC
    },
    {
      chain: 'zksync2',
      includeInTotal: false,
      address: EthereumAddress('0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A'),
      sinceTimestamp: new UnixTime(1709280600),
      tokens: ['ETH'],
    },
    {
      chain: 'zksync2', // zkync-era?
      includeInTotal: false,
      address: EthereumAddress('0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08'),
      sinceTimestamp: new UnixTime(1709297040),
      tokens: '*', // missing ~700K: wBTC, DAI, USDC.e, USDT
    },
    {
      chain: 'arbitrum',
      includeInTotal: false,
      address: EthereumAddress('0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A'),
      sinceTimestamp: new UnixTime(1709280428),
      tokens: ['ETH'],
    },
    {
      chain: 'arbitrum',
      includeInTotal: false,
      address: EthereumAddress('0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585'),
      sinceTimestamp: new UnixTime(1709296973),
      tokens: '*', // missing ~3M: USDT, wBTC, wstETH, USDC.e
    },
    {
      chain: 'blast',
      includeInTotal: false,
      address: EthereumAddress('0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD'),
      sinceTimestamp: new UnixTime(1710417729),
      tokens: ['ETH'],
    },
    {
      chain: 'blast',
      includeInTotal: false,
      address: EthereumAddress('0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b'),
      sinceTimestamp: new UnixTime(1710427013),
      tokens: '*', // missing 300k BAJA
    },
    {
      chain: 'base',
      includeInTotal: false,
      address: EthereumAddress('0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd'),
      sinceTimestamp: new UnixTime(1711095697),
      tokens: ['ETH'],
    },
    {
      chain: 'base',
      includeInTotal: false,
      address: EthereumAddress('0x80d12A78EfE7604F00ed07aB2f16F643301674D5'),
      sinceTimestamp: new UnixTime(1711098033),
      tokens: '*', // missing 100k USDC
    },
  ],
})
