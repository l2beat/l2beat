export type Chain = {
  /** Id for internal purposes, set it to an arbitrary string*/
  id: string
  /** This will be displayed on the UOPS explorer */
  name: string
  /** Currently we support two types of blockchain APIs. Provide the type and the working url.*/
  blockchainApi: {
    type: 'rpc' | 'starknet'
    url: string
  }
  /** If the chain has Etherscan instance deployed provide the address here. With this configured UOPS explorer will show contract names.*/
  etherscanApiUrl?: string
  /** Go to block explorer and find out how the link looks for the block */
  getBlockLink: (blockNumber: number) => string
  /** Go to block explorer and find out how the link looks for the transaction */
  getTxLink: (txHash: string) => string
  /** Go to block explorer and find out how the link looks for the address */
  getContractLink: (address: string) => string

  // Backend logic related
  customSuggestedBlocksCount?: number
  customBatchSize?: number
}

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 'abstract',
    name: 'Abstract',
    blockchainApi: {
      type: 'rpc',
      url: 'https://api.mainnet.abs.xyz',
    },
    getBlockLink: (blockNumber: number) =>
      `https://abscan.org/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://abscan.org/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://abscan.org/address/${address}`,
  },
  {
    id: 'alephzero',
    name: 'Aleph Zero EVM',
    blockchainApi: {
      type: 'rpc',
      url: 'https://rpc.alephzero-testnet.gelato.digital',
    },
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
    blockchainApi: {
      type: 'rpc',
      url: 'https://arbitrum-one.publicnode.com',
    },
    etherscanApiUrl: 'https://api.arbiscan.io',
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
    blockchainApi: {
      type: 'rpc',
      url: 'https://mainnet.base.org',
    },
    etherscanApiUrl: 'https://api.basescan.org',
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
    blockchainApi: {
      type: 'rpc',
      url: 'https://rpc.blast.io/',
    },
    getBlockLink: (blockNumber: number) =>
      `https://blastscan.io/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://blastscan.io/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://blastscan.io/address/${address}`,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    blockchainApi: {
      type: 'rpc',
      url: 'https://ethereum-rpc.publicnode.com',
    },
    etherscanApiUrl: 'https://api.etherscan.io',
    getBlockLink: (blockNumber: number) =>
      `https://etherscan.io/block/${blockNumber}`,
    getTxLink: (txHash: string) =>
      `https://app.blocksec.com/explorer/tx/eth/${txHash}`,
    getContractLink: (address: string) =>
      `https://etherscan.io/address/${address}`,
  },
  {
    id: 'facet',
    name: 'Facet',
    blockchainApi: {
      type: 'rpc',
      url: 'https://mainnet.facet.org/',
    },
    getBlockLink: (blockNumber: number) =>
      `https://explorer.facet.org/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://explorer.facet.org/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://explorer.facet.org/address/${address}`,
  },
  {
    id: 'gravity',
    name: 'Gravity',
    blockchainApi: {
      type: 'rpc',
      url: 'https://rpc.gravity.xyz',
    },
    getBlockLink: (blockNumber: number) =>
      `https://explorer.gravity.xyz/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://explorer.gravity.xyz/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://explorer.gravity.xyz/address/${address}`,
  },
  {
    id: 'immutable',
    name: 'Immutable zkEVM',
    blockchainApi: {
      type: 'rpc',
      url: 'https://rpc.immutable.com',
    },
    getBlockLink: (blockNumber: number) =>
      `https://explorer.immutable.com/block/${blockNumber}`,
    getTxLink: (txHash: string) =>
      `https://explorer.immutable.com/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://explorer.immutable.com/address/${address}`,
  },
  {
    id: 'linea',
    name: 'Linea',
    blockchainApi: {
      type: 'rpc',
      url: 'https://linea-rpc.publicnode.com',
    },
    etherscanApiUrl: 'https://api.lineascan.build',
    getBlockLink: (blockNumber: number) =>
      `https://lineascan.build/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://lineascan.build/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://lineascan.build/address/${address}`,
  },
  {
    id: 'lyra',
    name: 'Derive',
    blockchainApi: {
      type: 'rpc',
      url: 'https://rpc.lyra.finance',
    },
    getBlockLink: (blockNumber: number) =>
      `https://explorer.lyra.finance/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://explorer.lyra.finance/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://explorer.lyra.finance/address/${address}`,
  },
  {
    id: 'mantle',
    name: 'Mantle',
    blockchainApi: {
      type: 'rpc',
      url: 'https://rpc.mantle.xyz',
    },
    getBlockLink: (blockNumber: number) =>
      `https://explorer.mantle.xyz/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://explorer.mantle.xyz/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://explorer.mantle.xyz/address/${address}`,
  },
  {
    id: 'nova',
    name: 'Arbitrum Nova',
    blockchainApi: {
      type: 'rpc',
      url: 'https://nova.arbitrum.io/rpc',
    },
    etherscanApiUrl: 'https://api-nova.arbiscan.io',
    getBlockLink: (blockNumber: number) =>
      `https://nova.arbiscan.io/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://nova.arbiscan.io/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://nova.arbiscan.io/address/${address}`,
  },
  {
    id: 'optimism',
    name: 'OP Mainnet',
    blockchainApi: {
      type: 'rpc',
      url: 'https://mainnet.optimism.io',
    },
    etherscanApiUrl: 'https://api.polygonscan.com',
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
    blockchainApi: {
      type: 'rpc',
      url: 'https://polygon-rpc.com/',
    },
    etherscanApiUrl: 'https://api.polygonscan.com',
    getBlockLink: (blockNumber: number) =>
      `https://polygonscan.com/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://polygonscan.com/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://polygonscan.com/address/${address}`,
  },
  {
    id: 'polynomial',
    name: 'Polynomial',
    blockchainApi: {
      type: 'rpc',
      url: 'https://rpc.polynomial.fi',
    },
    getBlockLink: (blockNumber: number) =>
      `https://polynomialscan.io/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://polynomialscan.io/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://polynomialscan.io/address/${address}`,
  },
  {
    id: 'scroll',
    name: 'Scroll',
    blockchainApi: {
      type: 'rpc',
      url: 'https://rpc.scroll.io',
    },
    getBlockLink: (blockNumber: number) =>
      `https://scrollscan.com/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://scrollscan.com/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://scrollscan.com/address/${address}`,
  },
  {
    id: 'silicon',
    name: 'Silicon',
    blockchainApi: {
      type: 'rpc',
      url: 'https://rpc.silicon.network',
    },
    getBlockLink: (blockNumber: number) =>
      `https://scope.silicon.network/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://scope.silicon.network/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://scope.silicon.network/address/${address}`,
  },
  {
    id: 'starknet',
    name: 'Starknet',
    blockchainApi: {
      type: 'starknet',
      url: 'https://starknet-mainnet.public.blastapi.io',
    },
    getBlockLink: (blockNumber: number) =>
      `https://starkscan.co/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://starkscan.co/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://starkscan.co/contract/${address}`,
  },
  {
    id: 'taiko',
    name: 'Taiko',
    blockchainApi: {
      type: 'rpc',
      url: 'https://rpc.taiko.xyz',
    },
    etherscanApiUrl: 'https://api.taikoscan.io',
    getBlockLink: (blockNumber: number) =>
      `https://taikoscan.io/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://taikoscan.io/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://taikoscan.io/address/${address}`,
  },
  {
    id: 'worldchain',
    name: 'World Chain',
    blockchainApi: {
      type: 'rpc',
      url: 'https://worldchain-mainnet.g.alchemy.com/public',
    },
    etherscanApiUrl: 'https://api.worldscan.org',
    getBlockLink: (blockNumber: number) =>
      `https://worldscan.org/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://worldscan.org/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://worldscan.org/address/${address}`,
  },
  {
    id: 'xai',
    name: 'Xai',
    blockchainApi: {
      type: 'rpc',
      url: 'https://xai-chain.net/rpc',
    },
    etherscanApiUrl: 'https://api.xaiscan.io',
    getBlockLink: (blockNumber: number) =>
      `https://xaiscan.io/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://xaiscan.io/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://xaiscan.io/address/${address}`,
  },
  {
    id: 'zircuit',
    name: 'Zircuit',
    blockchainApi: {
      type: 'rpc',
      url: 'https://zircuit1-mainnet.p2pify.com',
    },
    getBlockLink: (blockNumber: number) =>
      `https://explorer.zircuit.com//blocks/${blockNumber}`,
    getTxLink: (txHash: string) => `https://explorer.zircuit.com/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://explorer.zircuit.com/address/${address}`,
  },
  {
    id: 'zksync-era',
    name: 'ZKsync Era',
    blockchainApi: {
      type: 'rpc',
      url: 'https://mainnet.era.zksync.io',
    },
    etherscanApiUrl: 'https://api-era.zksync.network',
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
    blockchainApi: {
      type: 'rpc',
      url: 'https://rpc.zora.energy',
    },
    getBlockLink: (blockNumber: number) =>
      `https://explorer.zora.energy/block/${blockNumber}`,
    getTxLink: (txHash: string) => `https://explorer.zora.energy/tx/${txHash}`,
    getContractLink: (address: string) =>
      `https://explorer.zora.energy/address/${address}`,
  },
]
