import { UnixTime } from '@l2beat/shared-pure'

import {
  L2CostsApiProject,
  L2CostsApiResponse,
  L2CostsDetails,
} from './DELETE_THIS_FILE'

export async function fetchL2CostsApi(): Promise<L2CostsApiResponse> {
  return Promise.resolve(getMockL2CostsApiResponse())
}

function getMockL2CostsApiResponse(): L2CostsApiResponse {
  const projects = [
    'zksyncera',
    'base',
    'optimism',
    'honeypot',
    'fuelv1',
    'kroma',
    'mode',
    'zksync2',
    'zora',
  ].reduce<Record<string, L2CostsApiProject>>((acc, cur) => {
    acc[cur] = generateMockData()
    return acc
  }, {})

  return {
    projects,
  }
}

function generateMockData(): L2CostsApiProject {
  return {
    syncedUntil: UnixTime.now(),
    last24h: generateMockDataDetails(10),
    last7d: generateMockDataDetails(70),
    last30d: generateMockDataDetails(300),
    last90d: generateMockDataDetails(900),
  }
}

function generateMockDataDetails(base: number): L2CostsDetails {
  const calldataMultiplier = Math.random()
  const blobsMultiplier = Math.random()
  const computeMultiplier = Math.random()
  const overheadMultiplier = Math.random()

  const usdMultiplier = base * 3500
  const gasMultiplier = base * 100000

  const calldataEthCost = round(base * calldataMultiplier)
  const calldataUsdCost = round(base * usdMultiplier * calldataMultiplier)
  const calldataGas = round(base * gasMultiplier * calldataMultiplier)
  const blobEthCost = round(base * blobsMultiplier)
  const blobUsdCost = round(base * usdMultiplier * blobsMultiplier)
  const blobGas = round(base * gasMultiplier * blobsMultiplier)
  const computeEthCost = round(base * computeMultiplier)
  const computeUsdCost = round(base * usdMultiplier * computeMultiplier)
  const computeGas = round(base * gasMultiplier * computeMultiplier)
  const overheadEthCost = round(base * overheadMultiplier)
  const overheadUsdCost = round(base * usdMultiplier * overheadMultiplier)
  const overheadGas = round(base * gasMultiplier * overheadMultiplier)

  return {
    total: {
      ethCost: round(
        calldataEthCost + blobEthCost + computeEthCost + overheadEthCost,
      ),
      usdCost: round(
        calldataUsdCost + blobUsdCost + computeUsdCost + overheadUsdCost,
      ),
      gas: round(calldataGas + blobGas + computeGas + overheadGas),
    },
    calldata: {
      ethCost: calldataEthCost,
      usdCost: calldataUsdCost,
      gas: calldataGas,
    },
    blobs: {
      ethCost: blobEthCost,
      usdCost: blobUsdCost,
      gas: blobGas,
    },
    compute: {
      ethCost: computeEthCost,
      usdCost: computeUsdCost,
      gas: computeGas,
    },
    overhead: {
      ethCost: overheadEthCost,
      usdCost: overheadUsdCost,
      gas: overheadGas,
    },
  }
}

function round(value: number) {
  return Math.round(value * 100) / 100
}
