import { constants, Contract, providers } from 'ethers'

import { bytes32ToAddress } from '../address'
import { getStorage } from '../getStorage'
import { extendDetect } from './extendDetect'
import { ProxyDetection } from './types'

// keccak256('org.zeppelinos.proxy.implementation')
const IMPLEMENTATION_SLOT =
  '0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3'

async function getImplementation(
  provider: providers.Provider,
  contract: Contract | string,
) {
  return bytes32ToAddress(
    await getStorage(provider, contract, IMPLEMENTATION_SLOT),
  )
}

// keccak256("org.zeppelinos.proxy.owner")
const OWNER_SLOT =
  '0x337c729c04082e3bdd94ba7d2b5a8a642f3a138702366a91707825373a2029ba'

async function getOwner(
  provider: providers.Provider,
  contract: Contract | string,
) {
  return bytes32ToAddress(await getStorage(provider, contract, OWNER_SLOT))
}

async function detect(
  provider: providers.Provider,
  address: string,
): Promise<ProxyDetection | undefined> {
  const implementation = await getImplementation(provider, address)
  if (implementation === constants.AddressZero) {
    return
  }
  const owner = await getOwner(provider, address)
  return {
    implementations: [implementation],
    relatives: [owner],
    upgradeability: {
      type: 'Loopring proxy',
      implementation,
      owner,
    },
  }
}

export const LoopringProxy = {
  getImplementation,
  getOwner,
  ...extendDetect(detect),
}
