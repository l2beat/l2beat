import type { BigNumber, BytesLike } from 'ethers'

type ChangeL2BlockHeader = {
  deltaTimestamp: number
  indexL1InfoTree: number
}

export type RawPolygonZkEvmBlock = {
  transactions: PolygonZkEvmTransaction[]
} & ChangeL2BlockHeader

export interface PolygonZkEvmTransaction {
  nonce: BigNumber
  gasPrice: BigNumber
  gasLimit: BigNumber
  to?: string
  value: BigNumber
  data: BytesLike
  chainId?: BigNumber

  v: BigNumber
  r: BigNumber
  s: BigNumber
}
