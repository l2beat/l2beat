import {
  AddressAnalyzer,
  AnalyzedAddress,
  EthereumAddress,
} from '@l2beat/common'
import { Contract, providers, utils } from 'ethers'
import { keccak256 } from 'ethers/lib/utils'

import { MainBridgeConfig } from './config'

export interface AnalyzedMainBridge {
  owner: string
  proxy: AnalyzedAddress
  implementationAddress: string
  implementation: AnalyzedAddress
  messengerAddress: string
  messenger: AnalyzedAddress
  libResolvedDelegateProxyImplementationName: string
  libResolvedDelegateProxyAddressManager: string
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

  const abi = ['function messenger() view returns (address)']

  const bridgeContract = new Contract(mainBridge.proxyAddress, abi, provider)
  const messenger = await bridgeContract.messenger()

  const analyzedMessenger = await addressAnalyzer.analyze(
    EthereumAddress(messenger)
  )

  let libResolvedDelegateProxyImplementationName = ''
  let libResolvedDelegateProxyAddressManager = ''
  if (analyzedMessenger.name === 'Lib_ResolvedDelegateProxy') {
    const slot1 = '0'.padStart(64, '0')
    const slot2 = '1'.padStart(64, '0')
    const key = messenger.slice(2).toLowerCase().padStart(64, '0')

    const [implementationName, addressManagerAddress] = await Promise.all([
      provider.getStorageAt(messenger, keccak256('0x' + key + slot1)),
      provider.getStorageAt(messenger, keccak256('0x' + key + slot2)),
    ])
    libResolvedDelegateProxyAddressManager = wordToAddress(
      addressManagerAddress
    )
    libResolvedDelegateProxyImplementationName = Buffer.from(
      implementationName.slice(2),
      'hex'
    )
      .toString('utf8')
      .slice(0, -1)
  }

  return {
    owner,
    proxy: proxyContract as AnalyzedAddress,
    implementationAddress: implementation,
    implementation: implementationContract as AnalyzedAddress,
    messengerAddress: messenger,
    messenger: analyzedMessenger as AnalyzedAddress,
    libResolvedDelegateProxyImplementationName,
    libResolvedDelegateProxyAddressManager,
  }
}

function wordToAddress(word: string) {
  return utils.getAddress('0x' + word.substr(26, 40))
}
