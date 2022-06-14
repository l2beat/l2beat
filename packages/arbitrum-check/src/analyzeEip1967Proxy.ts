import { AddressAnalyzer, EthereumAddress } from '@l2beat/common'
import { providers, utils } from 'ethers'

const IMPLEMENTATION_SLOT = slot('eip1967.proxy.implementation')
const ADMIN_SLOT = slot('eip1967.proxy.admin')

export async function analyzeEip1967Proxy(
  provider: providers.Provider,
  addressAnalyzer: AddressAnalyzer,
  proxyAddress: string,
) {
  const [implementationSlot, adminSlot] = await Promise.all([
    provider.getStorageAt(proxyAddress, IMPLEMENTATION_SLOT),
    provider.getStorageAt(proxyAddress, ADMIN_SLOT),
  ])
  if (implementationSlot === '0x' + '0'.repeat(64)) {
    return undefined
  }
  const implementation = wordToAddress(implementationSlot)
  const admin = wordToAddress(adminSlot)
  const { name } = await addressAnalyzer.analyze(
    EthereumAddress(implementation),
  )
  return {
    name,
    eip1967Implementation: implementation,
    eip1967Admin: admin,
  }
}

function wordToAddress(word: string) {
  return utils.getAddress('0x' + word.substr(26, 40))
}

function slot(name: string) {
  const hash = utils.solidityKeccak256(['string'], [name])
  return '0x' + (BigInt(hash) - 1n).toString(16).padStart(64, '0')
}
