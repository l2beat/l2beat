import { Contract, providers } from 'ethers'
import { toAddress } from './cast'
import { createCompare } from './compare'

async function getNutBerryImplementation(
  provider: providers.Provider,
  address: string
) {
  const SLOT =
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  const result = await provider.getStorageAt(address, SLOT)
  return toAddress(result)
}

export const checkNutBerryImplementation = createCompare(
  'NutBerry implementation',
  getNutBerryImplementation
)

async function getNutBerryAdmin(provider: providers.Provider, address: string) {
  const contract = new Contract(
    address,
    ['function ROLLUP_MANAGER() view returns(address)'],
    provider
  )
  const result: string = await contract.ROLLUP_MANAGER()
  return result
}

export const checkNutBerryAdmin = createCompare(
  'NutBerry admin',
  getNutBerryAdmin
)
