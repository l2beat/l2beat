export type ChainId =
  | 'alephzero'
  | 'arbitrum'
  | 'base'
  | 'blast'
  | 'ethereum'
  | 'gravity'
  | 'immutablex'
  | 'linea'
  | 'lyra'
  | 'mantle'
  | 'nova'
  | 'optimism'
  | 'polygonpos'
  | 'polynomial'
  | 'scroll'
  | 'silicon'
  | 'starknet'
  | 'taiko'
  | 'worldchain'
  | 'xai'
  | 'zircuit'
  | 'zksync-era'
  | 'zora'

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
    id: 'alephzero',
    name: 'Aleph Zero EVM',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://evm-explorer.alephzero.org/block/${blockNumber}`,
    getTxLink: (txHash: string) =>
      `https://evm-explorer.alephzero.org/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://evm-explorer.alephzero.org/address/${address}`,
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum One',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://arbiscan.io/block/${blockNumber}`,
    getTxLink: (txHash: string) =>
      `https://app.blocksec.com/explorer/tx/arbitrum/${txHash}`,
    getContractLink: (address: string) =>
      `https://arbiscan.io/address/${address}`,
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
    id: 'blast',
    name: 'Blast',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://blastscan.io/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://blastscan.io/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://blastscan.io/address/${address}`,
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
    id: 'linea',
    name: 'Linea',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://lineascan.build/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://lineascan.build/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://lineascan.build/address/${address}`,
  },
  {
    id: 'lyra',
    name: 'Derive',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://explorer.lyra.finance/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://explorer.lyra.finance/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://explorer.lyra.finance/address/${address}`,
  },
  {
    id: 'mantle',
    name: 'Mantle',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://explorer.mantle.xyz/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://explorer.mantle.xyz/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://explorer.mantle.xyz/address/${address}`,
  },
  {
    id: 'nova',
    name: 'Arbitrum Nova',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://nova.arbiscan.io/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://nova.arbiscan.io/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://nova.arbiscan.io/address/${address}`,
  },
  {
    id: 'optimism',
    name: 'OP Mainnet',
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
    id: 'polygonpos',
    name: 'Polygon PoS',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://polygonscan.com/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://polygonscan.com/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://polygonscan.com/address/${address}`,
  },
  {
    id: 'polynomial',
    name: 'Polynomial',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://polynomialscan.io/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://polynomialscan.io/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://polynomialscan.io/address/${address}`,
  },
  {
    id: 'scroll',
    name: 'Scroll',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://scrollscan.com/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://scrollscan.com/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://scrollscan.com/address/${address}`,
  },
  {
    id: 'silicon',
    name: 'Silicon',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://scope.silicon.network/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://scope.silicon.network/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://scope.silicon.network/address/${address}`,
  },
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
    id: 'worldchain',
    name: 'World Chain',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://worldscan.org/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://worldscan.org/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://worldscan.org/address/${address}`,
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
    id: 'zircuit',
    name: 'Zircuit',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://explorer.zircuit.com//blocks/${blockNumber}`,
    getTxLink: (txHash: string) => `https://explorer.zircuit.com/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://explorer.zircuit.com/address/${address}`,
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
  {
    id: 'zora',
    name: 'Zora',
    suggestedBlocksCount: 100,
    batchSize: 10,
    getBlockLink: (blockNumber: number) =>
      `https://explorer.zora.energy/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://explorer.zora.energy/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://explorer.zora.energy/address/${address}`,
  },
]
