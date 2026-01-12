import type { InteropDashboardParams } from './types'
import { getTopPaths, type InteropPathData } from './utils/getTopPaths'

export type InteropDashboardData = {
  top3Paths: InteropPathData[]
}

export async function getInteropDashboardData(
  params: InteropDashboardParams,
): Promise<InteropDashboardData> {
  const records = await Promise.resolve(mockData)

  return {
    top3Paths: getTopPaths(records, params.from, params.to),
  }
}

export const mockData: {
  protocolId: string
  srcChain: string
  dstChain: string
  volume: number
}[] = [
  // Stargate combinations
  {
    protocolId: 'stargate',
    srcChain: 'ethereum',
    dstChain: 'arbitrum',
    volume: 12500000,
  },
  {
    protocolId: 'stargate',
    srcChain: 'ethereum',
    dstChain: 'base',
    volume: 9800000,
  },
  {
    protocolId: 'stargate',
    srcChain: 'ethereum',
    dstChain: 'optimism',
    volume: 8700000,
  },
  {
    protocolId: 'stargate',
    srcChain: 'arbitrum',
    dstChain: 'base',
    volume: 5400000,
  },
  {
    protocolId: 'stargate',
    srcChain: 'arbitrum',
    dstChain: 'optimism',
    volume: 3200000,
  },
  {
    protocolId: 'stargate',
    srcChain: 'base',
    dstChain: 'optimism',
    volume: 2100000,
  },
  {
    protocolId: 'stargate',
    srcChain: 'ethereum',
    dstChain: 'polygonpos',
    volume: 15600000,
  },
  {
    protocolId: 'stargate',
    srcChain: 'arbitrum',
    dstChain: 'zksync2',
    volume: 4300000,
  },

  // LayerZero combinations
  {
    protocolId: 'layerzero-v2',
    srcChain: 'ethereum',
    dstChain: 'arbitrum',
    volume: 8900000,
  },
  {
    protocolId: 'layerzero-v2',
    srcChain: 'ethereum',
    dstChain: 'base',
    volume: 7200000,
  },
  {
    protocolId: 'layerzero-v2',
    srcChain: 'ethereum',
    dstChain: 'optimism',
    volume: 6100000,
  },
  {
    protocolId: 'layerzero-v2',
    srcChain: 'arbitrum',
    dstChain: 'base',
    volume: 3800000,
  },
  {
    protocolId: 'layerzero-v2',
    srcChain: 'base',
    dstChain: 'zksync2',
    volume: 2900000,
  },
  {
    protocolId: 'layerzero-v2',
    srcChain: 'optimism',
    dstChain: 'arbitrum',
    volume: 2700000,
  },
  {
    protocolId: 'layerzero-v2',
    srcChain: 'ethereum',
    dstChain: 'zksync2',
    volume: 5200000,
  },
  {
    protocolId: 'layerzero-v2',
    srcChain: 'polygonpos',
    dstChain: 'arbitrum',
    volume: 3400000,
  },

  // Wormhole combinations
  {
    protocolId: 'wormhole',
    srcChain: 'ethereum',
    dstChain: 'arbitrum',
    volume: 11200000,
  },
  {
    protocolId: 'wormhole',
    srcChain: 'ethereum',
    dstChain: 'base',
    volume: 8300000,
  },
  {
    protocolId: 'wormhole',
    srcChain: 'ethereum',
    dstChain: 'optimism',
    volume: 7400000,
  },
  {
    protocolId: 'wormhole',
    srcChain: 'arbitrum',
    dstChain: 'base',
    volume: 4600000,
  },
  {
    protocolId: 'wormhole',
    srcChain: 'base',
    dstChain: 'optimism',
    volume: 2800000,
  },
  {
    protocolId: 'wormhole',
    srcChain: 'ethereum',
    dstChain: 'polygonpos',
    volume: 9200000,
  },
  {
    protocolId: 'wormhole',
    srcChain: 'arbitrum',
    dstChain: 'zksync2',
    volume: 3500000,
  },
  {
    protocolId: 'wormhole',
    srcChain: 'optimism',
    dstChain: 'zksync2',
    volume: 1900000,
  },

  // Across combinations
  {
    protocolId: 'across',
    srcChain: 'ethereum',
    dstChain: 'arbitrum',
    volume: 15600000,
  },
  {
    protocolId: 'across',
    srcChain: 'ethereum',
    dstChain: 'base',
    volume: 12400000,
  },
  {
    protocolId: 'across',
    srcChain: 'ethereum',
    dstChain: 'optimism',
    volume: 11300000,
  },
  {
    protocolId: 'across',
    srcChain: 'arbitrum',
    dstChain: 'ethereum',
    volume: 9800000,
  },
  {
    protocolId: 'across',
    srcChain: 'base',
    dstChain: 'ethereum',
    volume: 8700000,
  },
  {
    protocolId: 'across',
    srcChain: 'optimism',
    dstChain: 'ethereum',
    volume: 7600000,
  },
  {
    protocolId: 'across',
    srcChain: 'arbitrum',
    dstChain: 'base',
    volume: 5200000,
  },
  {
    protocolId: 'across',
    srcChain: 'base',
    dstChain: 'arbitrum',
    volume: 4100000,
  },

  // Axelar combinations
  {
    protocolId: 'axelar',
    srcChain: 'ethereum',
    dstChain: 'arbitrum',
    volume: 6700000,
  },
  {
    protocolId: 'axelar',
    srcChain: 'ethereum',
    dstChain: 'base',
    volume: 5400000,
  },
  {
    protocolId: 'axelar',
    srcChain: 'ethereum',
    dstChain: 'optimism',
    volume: 4800000,
  },
  {
    protocolId: 'axelar',
    srcChain: 'arbitrum',
    dstChain: 'base',
    volume: 3100000,
  },
  {
    protocolId: 'axelar',
    srcChain: 'base',
    dstChain: 'polygonpos',
    volume: 2600000,
  },
  {
    protocolId: 'axelar',
    srcChain: 'polygonpos',
    dstChain: 'arbitrum',
    volume: 2200000,
  },
  {
    protocolId: 'axelar',
    srcChain: 'ethereum',
    dstChain: 'polygonpos',
    volume: 5800000,
  },
  {
    protocolId: 'axelar',
    srcChain: 'zksync2',
    dstChain: 'arbitrum',
    volume: 1800000,
  },

  // CCTP combinations
  {
    protocolId: 'cctp-v2',
    srcChain: 'ethereum',
    dstChain: 'arbitrum',
    volume: 14300000,
  },
  {
    protocolId: 'cctp-v2',
    srcChain: 'ethereum',
    dstChain: 'base',
    volume: 11200000,
  },
  {
    protocolId: 'cctp-v2',
    srcChain: 'ethereum',
    dstChain: 'optimism',
    volume: 10100000,
  },
  {
    protocolId: 'cctp-v2',
    srcChain: 'arbitrum',
    dstChain: 'ethereum',
    volume: 8900000,
  },
  {
    protocolId: 'cctp-v2',
    srcChain: 'base',
    dstChain: 'ethereum',
    volume: 7800000,
  },
  {
    protocolId: 'cctp-v2',
    srcChain: 'optimism',
    dstChain: 'ethereum',
    volume: 6900000,
  },
  {
    protocolId: 'cctp-v2',
    srcChain: 'arbitrum',
    dstChain: 'base',
    volume: 4500000,
  },
  {
    protocolId: 'cctp-v2',
    srcChain: 'base',
    dstChain: 'arbitrum',
    volume: 3600000,
  },

  // OpStack combinations
  {
    protocolId: 'opstack',
    srcChain: 'ethereum',
    dstChain: 'base',
    volume: 23400000,
  },
  {
    protocolId: 'opstack',
    srcChain: 'ethereum',
    dstChain: 'optimism',
    volume: 19800000,
  },
  {
    protocolId: 'opstack',
    srcChain: 'base',
    dstChain: 'ethereum',
    volume: 18700000,
  },
  {
    protocolId: 'opstack',
    srcChain: 'optimism',
    dstChain: 'ethereum',
    volume: 17600000,
  },
  {
    protocolId: 'opstack',
    srcChain: 'ethereum',
    dstChain: 'apechain',
    volume: 3200000,
  },
  {
    protocolId: 'opstack',
    srcChain: 'apechain',
    dstChain: 'ethereum',
    volume: 2800000,
  },

  // OrbitStack combinations
  {
    protocolId: 'orbitstack',
    srcChain: 'arbitrum',
    dstChain: 'ethereum',
    volume: 12300000,
  },
  {
    protocolId: 'orbitstack',
    srcChain: 'ethereum',
    dstChain: 'arbitrum',
    volume: 11500000,
  },
  {
    protocolId: 'orbitstack',
    srcChain: 'arbitrum',
    dstChain: 'base',
    volume: 5600000,
  },
  {
    protocolId: 'orbitstack',
    srcChain: 'base',
    dstChain: 'arbitrum',
    volume: 4900000,
  },

  // Additional smaller protocol combinations
  {
    protocolId: 'debridge',
    srcChain: 'ethereum',
    dstChain: 'arbitrum',
    volume: 4200000,
  },
  {
    protocolId: 'debridge',
    srcChain: 'ethereum',
    dstChain: 'base',
    volume: 3300000,
  },
  {
    protocolId: 'debridge',
    srcChain: 'arbitrum',
    dstChain: 'base',
    volume: 2100000,
  },

  {
    protocolId: 'celer',
    srcChain: 'ethereum',
    dstChain: 'polygonpos',
    volume: 5100000,
  },
  {
    protocolId: 'celer',
    srcChain: 'polygonpos',
    dstChain: 'ethereum',
    volume: 4400000,
  },
  {
    protocolId: 'celer',
    srcChain: 'arbitrum',
    dstChain: 'polygonpos',
    volume: 2700000,
  },

  {
    protocolId: 'ccip',
    srcChain: 'ethereum',
    dstChain: 'arbitrum',
    volume: 3800000,
  },
  {
    protocolId: 'ccip',
    srcChain: 'ethereum',
    dstChain: 'base',
    volume: 2900000,
  },
  {
    protocolId: 'ccip',
    srcChain: 'arbitrum',
    dstChain: 'optimism',
    volume: 1700000,
  },

  // Abstract and Apechain combinations
  {
    protocolId: 'stargate',
    srcChain: 'ethereum',
    dstChain: 'abstract',
    volume: 2100000,
  },
  {
    protocolId: 'layerzero-v2',
    srcChain: 'abstract',
    dstChain: 'arbitrum',
    volume: 1500000,
  },
  {
    protocolId: 'wormhole',
    srcChain: 'apechain',
    dstChain: 'base',
    volume: 1200000,
  },
  {
    protocolId: 'across',
    srcChain: 'abstract',
    dstChain: 'ethereum',
    volume: 1800000,
  },
]
