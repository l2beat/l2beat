export type ChainId =
  | 'starknet'
  | 'base'
  | 'ethereum'
  | 'xai'
  | 'taiko'
  | 'arbitrum'
  | 'immutablex'
  | 'gravity'
  | 'optimism'
  | 'zksync-era'

export type Chain = {
  id: ChainId
  name: string
  suggestedBlocksCount: number
  batchSize: number
  getBlockLink: (blockNumber: number) => string
  getTxLink: (txHash: string) => string
  getContractLink: (address: string) => string
  getTransactionTypeName?: (type: number) => string
}

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 'starknet',
    name: 'Starknet',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://starkscan.co/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://starkscan.co/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://starkscan.co/contract/${address}`,
  },
  {
    id: 'base',
    name: 'Base',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://basescan.org/block/${blockNumber}`,
    getTxLink: (txHash: string) =>
      `https://app.blocksec.com/explorer/tx/base/${txHash}`,
    getContractLink: (address: string) =>
      `https://basescan.org/address/${address}`,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://etherscan.io/block/${blockNumber}`,
    getTxLink: (txHash: string) =>
      `https://app.blocksec.com/explorer/tx/eth/${txHash}`,
    getContractLink: (address: string) =>
      `https://etherscan.io/address/${address}`,
  },
  {
    id: 'xai',
    name: 'Xai',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://xaiscan.io//block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://xaiscan.io/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://xaiscan.io/address/${address}`,
  },
  {
    id: 'taiko',
    name: 'Taiko',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://taikoscan.io//block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://taikoscan.io/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://taikoscan.io/address/${address}`,
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://arbiscan.io//block/${blockNumber}`,
    getTxLink: (txHash: string) =>
      `https://app.blocksec.com/explorer/tx/arbitrum/${txHash}`,
    getContractLink: (address: string) =>
      `https://arbiscan.io//address/${address}`,
  },
  {
    id: 'gravity',
    name: 'Gravity',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://explorer.gravity.xyz/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://explorer.gravity.xyz/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://explorer.gravity.xyz/address/${address}`,
  },
  {
    id: 'optimism',
    name: 'Optimism',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://optimistic.etherscan.io/block/${blockNumber}`,
    getTxLink: (txHash: string) =>
      `https://app.blocksec.com/explorer/tx/optimism/${txHash}`,
    getContractLink: (address: string) =>
      `https://optimistic.etherscan.io/address/${address}`,
  },
  {
    id: 'zksync-era',
    name: 'ZKsync Era',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://era.zksync.network//block/${blockNumber}`,
    getTxLink: (txHash: string) =>
      `https://app.blocksec.com/explorer/tx/zksync-era/${txHash}`,
    getContractLink: (address: string) =>
      `https://era.zksync.network//address/${address}`,
  },
]
