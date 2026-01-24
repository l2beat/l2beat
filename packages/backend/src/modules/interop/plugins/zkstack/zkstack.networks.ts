import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import { defineNetworks } from '../types'

export interface ZkStackNetwork {
  chainId: number
  chain: string
  diamondAddress: ChainSpecificAddress
  l2SharedBridge: ChainSpecificAddress
  l2L1Messenger: ChainSpecificAddress
  l2EthToken: ChainSpecificAddress
}

// this would equally work without all specific addresses except diamond
// but they are probably good for perf/resyncing
export const ZKSTACK_SUPPORTED = defineNetworks<ZkStackNetwork>('zkstack', [
  {
    chainId: 324,
    chain: 'zksync2',
    diamondAddress: ChainSpecificAddress(
      'eth:0x32400084C286CF3E17e7B677ea9583e60a000324',
    ),
    l2SharedBridge: ChainSpecificAddress(
      'zksync:0x0000000000000000000000000000000000010004',
    ),
    l2L1Messenger: ChainSpecificAddress(
      'zksync:0x0000000000000000000000000000000000008008',
    ),
    l2EthToken: ChainSpecificAddress(
      'zksync:0x000000000000000000000000000000000000800A',
    ),
  },
  {
    chainId: 2741,
    chain: 'abstract',
    diamondAddress: ChainSpecificAddress(
      'eth:0x2EDc71E9991A962c7FE172212d1aA9E50480fBb9',
    ),
    l2SharedBridge: ChainSpecificAddress(
      'abstract:0x0000000000000000000000000000000000010004',
    ),
    l2L1Messenger: ChainSpecificAddress(
      'abstract:0x0000000000000000000000000000000000008008',
    ),
    l2EthToken: ChainSpecificAddress(
      'abstract:0x000000000000000000000000000000000000800A',
    ),
  },
])

export const ZKSTACK_L1_NATIVE_TOKEN_VAULT = ChainSpecificAddress(
  'eth:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6',
)

export const ZKSTACK_L1_ASSET_ROUTER = ChainSpecificAddress(
  'eth:0x8829AD80E425C646DAB305381ff105169FeEcE56',
)

export function getNetworkByChainId(
  chainId: bigint,
): ZkStackNetwork | undefined {
  return ZKSTACK_SUPPORTED.find((n) => BigInt(n.chainId) === chainId)
}

export function getNetworkByDiamondAddress(
  address: EthereumAddress,
): ZkStackNetwork | undefined {
  return ZKSTACK_SUPPORTED.find(
    (n) => ChainSpecificAddress.address(n.diamondAddress) === address,
  )
}

export function getNetworkByL2Chain(chain: string): ZkStackNetwork | undefined {
  return ZKSTACK_SUPPORTED.find((n) => n.chain === chain)
}

export const ETH_ASSET_ID =
  '0x05e1c3ae4b9732444ae25217ac7666e46fa365fee1768de00c9fcb65532b7609'
