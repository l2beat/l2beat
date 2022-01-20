import { BigNumber, Contract, providers } from 'ethers'

import { toAddress, toBoolean } from './cast'
import { createCompare } from './compare'

async function getStarkWareImplementation(
  provider: providers.Provider,
  address: string
) {
  const SLOT =
    '0x177667240aeeea7e35eabe3a35e18306f336219e1386f7710a6bf8783f761b24'
  const result = await provider.getStorageAt(address, SLOT)
  return toAddress(result)
}

export const checkStarkWareImplementation = createCompare(
  'StarkWare implementation',
  getStarkWareImplementation
)

async function getStarkWareCallImplementation(
  provider: providers.Provider,
  address: string
) {
  const SLOT =
    '0x7184681641399eb4ad2fdb92114857ee6ff239f94ad635a1779978947b8843be'
  const result = await provider.getStorageAt(address, SLOT)
  return toAddress(result)
}

export const checkStarkWareCallImplementation = createCompare(
  'StarkWare call implementation',
  getStarkWareCallImplementation
)

async function getStarkWareConstantUpgradeDelay(
  provider: providers.Provider,
  address: string
) {
  const contract = new Contract(
    address,
    ['function UPGRADE_ACTIVATION_DELAY() view returns(uint256)'],
    provider
  )
  const result: BigNumber = await contract.UPGRADE_ACTIVATION_DELAY()
  return result.toNumber()
}

export const checkStarkWareConstantUpgradeDelay = createCompare(
  'StarkWare upgrade delay (const)',
  getStarkWareConstantUpgradeDelay
)

async function getStarkWareUpgradeDelay(
  provider: providers.Provider,
  address: string
) {
  const contract = new Contract(
    address,
    ['function getUpgradeActivationDelay() view returns(uint256)'],
    provider
  )
  const result: BigNumber = await contract.getUpgradeActivationDelay()
  return result.toNumber()
}

export const checkStarkWareUpgradeDelay = createCompare(
  'StarkWare upgrade delay',
  getStarkWareUpgradeDelay
)

async function getStarkWareIsFinal(
  provider: providers.Provider,
  address: string
) {
  const SLOT =
    '0x7d433c6f837e8f93009937c466c82efbb5ba621fae36886d0cac433c5d0aa7d2'
  const result = await provider.getStorageAt(address, SLOT)
  return toBoolean(result)
}

export const checkStarkWareIsFinal = createCompare(
  'StarkWare final',
  getStarkWareIsFinal
)
