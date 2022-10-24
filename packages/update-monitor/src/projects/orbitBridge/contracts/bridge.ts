import { tokenList } from '@l2beat/config'
import { EthereumAddress } from '@l2beat/types'
import { providers } from 'ethers'

import {
  OrbitBridgeImpl__factory,
  OrbitBridgeProxy__factory,
} from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

function getTokenAddress(symbol: string): EthereumAddress {
  const tokenInfo = tokenList.find((t) => t.symbol === symbol)
  if (!tokenInfo || !tokenInfo.address) {
    throw new Error(`Token ${symbol} not found`)
  }
  return tokenInfo.address
}

export async function getBridgeWithGovernance(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const bridgeProxy = OrbitBridgeProxy__factory.connect(
    addresses.bridge,
    provider,
  )
  const bridgeImpl = OrbitBridgeImpl__factory.connect(
    addresses.bridge,
    provider,
  )

  return {
    name: 'Bridge with Governance',
    address: addresses.bridge,
    upgradeability: {
      type: 'custom proxy',
      implementation: await bridgeProxy.implementation(),
    },
    values: {
      owners: await bridgeProxy.getOwners(),
      required: (await bridgeProxy.required()).toNumber(),
      usdtFarm: await bridgeImpl.farms(getTokenAddress('USDT').toString()),
      daiFarm: await bridgeImpl.farms(getTokenAddress('DAI').toString()),
      usdcFarm: await bridgeImpl.farms(getTokenAddress('USDC').toString()),
      wbtcFarm: await bridgeImpl.farms(getTokenAddress('WBTC').toString()),
    },
  }
}
