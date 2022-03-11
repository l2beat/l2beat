import {
  AddressAnalyzer,
  AnalyzedAddress,
  EthereumAddress,
} from '@l2beat/common'
import { Contract, providers, utils } from 'ethers'

import { MainBridgeConfig } from './config'

export interface AnalyzedMainBridge {
  owner: string
  proxy: AnalyzedAddress
  implementationAddress: string
  implementation: AnalyzedAddress
  [key: string]: unknown
}

/* 
Analyze Main Bridge:
1. Analyze Proxy
2. Check owner and implementation for EIP1967 Proxy type
3. Analyze Implementation
4. Query Implementation for parameters
*/
export async function analyzeMainBridge(
  provider: providers.Provider,
  addressAnalyzer: AddressAnalyzer,
  mainBridge: MainBridgeConfig
): Promise<AnalyzedMainBridge> {
  const proxyContract = await addressAnalyzer.analyze(
    EthereumAddress(mainBridge.proxyAddress)
  )
  const [implementationSlot, ownerSlot] = await Promise.all([
    provider.getStorageAt(
      mainBridge.proxyAddress,
      '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
    ),
    provider.getStorageAt(
      mainBridge.proxyAddress,
      '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103'
    ),
  ])
  const implementation = wordToAddress(implementationSlot)
  if (implementation != mainBridge.implementation) {
    console.log(
      `Warning: bridge implementation is not ${mainBridge.implementation}`
    )
  }
  const owner = wordToAddress(ownerSlot)
  const implementationContract = await addressAnalyzer.analyze(
    EthereumAddress(implementation)
  )

  // TODO: Refactor fetching parameters, fetch parameters from the bridge similarly to fetching parameters from other contracts

  return {
    owner,
    proxy: proxyContract as AnalyzedAddress,
    implementationAddress: implementation,
    implementation: implementationContract as AnalyzedAddress,
  }
}

function wordToAddress(word: string) {
  return utils.getAddress('0x' + word.substr(26, 40))
}
