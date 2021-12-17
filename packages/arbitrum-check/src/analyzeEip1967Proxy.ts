import { providers, utils } from 'ethers'

import { EtherscanApi } from './EtherscanApi'

export async function analyzeEip1967Proxy(
  provider: providers.Provider,
  etherscanApi: EtherscanApi,
  proxyAddress: string
) {
  const implementationSlot = await provider.getStorageAt(
    proxyAddress,
    '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
  )
  if (implementationSlot === '0x' + '0'.repeat(64)) {
    return undefined
  }
  const adminSlot = await provider.getStorageAt(
    proxyAddress,
    '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103'
  )
  const implementation = wordToAddress(implementationSlot)
  const admin = wordToAddress(adminSlot)
  const name = await etherscanApi.getContractName(implementation)
  return {
    name,
    eip1967Implementation: implementation,
    eip1967Admin: admin,
  }
}

function wordToAddress(word: string) {
  return utils.getAddress('0x' + word.substr(26, 40))
}
