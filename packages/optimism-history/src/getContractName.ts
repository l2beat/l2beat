import { Cache } from './Cache'
import { EtherscanApi } from './EtherscanApi'

const contractNameCache = new Cache<string>('contract-names.json')

export async function getContractName(
  etherscanApi: EtherscanApi,
  address: string
) {
  if (!contractNameCache.has(address)) {
    const name = await etherscanApi.getContractName(address)
    contractNameCache.set(address, name ?? '')
  }
  return contractNameCache.get(address) ?? ''
}
