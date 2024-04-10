import { BigNumber } from 'ethers';

export type ChangeL2BlockHeader = {
  deltaTimestamp: number;
  indexL1InfoTree: number;
};

export type RawPolygonZkEvmBlock = {
  transactions: PolygonZkEvmTransaction[];
} & ChangeL2BlockHeader;

export type BatchRawV2 = {
  blocks: RawPolygonZkEvmBlock[];
};

export interface PolygonZkEvmTransaction {
  nonce: number;
  gasPrice: BigNumber;
  gas: number;
  to?: string;
  value: BigNumber;
  data: string;
  v: BigNumber;
  r: BigNumber;
  s: BigNumber;
}
