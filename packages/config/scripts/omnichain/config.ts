import { EthereumAddress, UnixTime } from '@l2beat/shared'

import { ProjectEscrow } from '../../src'

export const ESCROWS: ProjectEscrow[] = [
  {
    address: EthereumAddress('0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6'),
    sinceTimestamp: new UnixTime(1647504559),
    tokens: ['STG'],
  },
]

export const IGNORED = [
  '0xc72633f995e98ac3bb8a89e6a9c4af335c3d6e44', // low cap ERC20
  '0xfecba472b2540c5a2d3700b2c9e06f0aa7dc6462', // low cap ERC20
  '0x296f55f8fb28e498b858d0bcda06d955b2cb3f97', // StarGate
  '0x50002cdfe7ccb0c41f519c6eb0653158d11cd907', // Aptos
  '0xacf63e56fd08970b43401492a02f6f38b6635c91', // NFT
  '0x2f05e799c61b600c65238a9df060caba63db8e78', // ERC1155
  '0x89aef982de66fe6df58ed0251e0841ccb2da6e4a', // deployed by Hashflow
  '0xa74ae2c6fca0cedbaef30a8ceef834b247186bcf', // low cap ERC20
  '0x7ffe2672c100bfb0094ad0b4d592dd9f9416f1ac', // low cap ERC20
  '0x4fa745fccc04555f2afa8874cd23961636cdf982', // LayerZero Bridge agEUR
  '0x611747cc4576aab44f602a65df3557150c214493', // NFT
  ...ESCROWS.map((e) => e.address.toString().toLowerCase()),
]

// some projects look like they are still being developed
// and can be tracked in the future
// this list is created so that we do not miss this
export const CHECK = [
  IGNORED[6], // deployed by Hashflow, not sure what is this exactly
  IGNORED[9], // LayerZero Bridge agEUR, currently agEUR is out of Coingecko TOP300
]
