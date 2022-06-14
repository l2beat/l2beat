import { providers } from 'ethers'

import { toAddress } from './cast'
import { createCompare } from './compare'

async function getZeppelinOsImplementation(
  provider: providers.Provider,
  address: string,
) {
  const SLOT =
    '0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3'
  const result = await provider.getStorageAt(address, SLOT)
  return toAddress(result)
}

export const checkZeppelinOsImplementation = createCompare(
  'Zeppelin OS implementation',
  getZeppelinOsImplementation,
)

async function getZeppelinOsAdmin(
  provider: providers.Provider,
  address: string,
) {
  const SLOT =
    '0x337c729c04082e3bdd94ba7d2b5a8a642f3a138702366a91707825373a2029ba'
  const result = await provider.getStorageAt(address, SLOT)
  return toAddress(result)
}

export const checkZeppelinOsAdmin = createCompare(
  'Zeppelin OS admin',
  getZeppelinOsAdmin,
)
