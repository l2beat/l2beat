import { AddressAnalyzer, EthereumAddress } from '@l2beat/common'

import { Cache } from './Cache'

const contractNameCache = new Cache<string>('contract-names.json')

export async function getContractName(
  addressAnalyzer: AddressAnalyzer,
  address: string
) {
  if (!contractNameCache.has(address)) {
    const { name } = await addressAnalyzer.analyze(EthereumAddress(address))
    contractNameCache.set(address, name)
  }
  return contractNameCache.get(address) ?? ''
}
