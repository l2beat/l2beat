import { BigNumber, constants, Contract, providers } from 'ethers'

import { bytes32ToAddress } from '../utils/address'
import { getStorage } from '../utils/getStorage'
import { extendDetect } from './extendDetect'
import { ProxyDetection } from './types'

// keccak256("StarkWare2019.implemntation-slot")
const IMPLEMENTATION_SLOT =
  '0x177667240aeeea7e35eabe3a35e18306f336219e1386f7710a6bf8783f761b24'

async function getImplementation(
  provider: providers.Provider,
  contract: Contract | string,
) {
  return bytes32ToAddress(
    await getStorage(provider, contract, IMPLEMENTATION_SLOT),
  )
}

// keccak256("'StarkWare2020.CallProxy.Implemntation.Slot'")
const CALL_IMPLEMENTATION_SLOT =
  '0x7184681641399eb4ad2fdb92114857ee6ff239f94ad635a1779978947b8843be'

async function getCallImplementation(
  provider: providers.Provider,
  contract: Contract | string,
) {
  return bytes32ToAddress(
    await getStorage(provider, contract, CALL_IMPLEMENTATION_SLOT),
  )
}

// Web3.solidityKeccak(['string'], ['StarkWare.Upgradibility.Delay.Slot'])
const UPGRADE_DELAY_SLOT =
  '0xc21dbb3089fcb2c4f4c6a67854ab4db2b0f233ea4b21b21f912d52d18fc5db1f'

async function getUpgradeDelay(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const value = await getStorage(provider, contract, UPGRADE_DELAY_SLOT)
  return BigNumber.from(value).toNumber()
}

async function detect(
  provider: providers.Provider,
  address: string,
): Promise<ProxyDetection | undefined> {
  const implementation = await getImplementation(provider, address)
  if (implementation === constants.AddressZero) {
    return
  }
  const [callImplementation, upgradeDelay] = await Promise.all([
    getCallImplementation(provider, address),
    getUpgradeDelay(provider, address),
  ])

  return {
    implementations:
      callImplementation !== constants.AddressZero
        ? [implementation, callImplementation]
        : [implementation],
    relatives: [],
    upgradeability: {
      type: 'StarkWare proxy',
      implementation,
      callImplementation,
      upgradeDelay,
    },
  }
}

export const StarkWareProxy = {
  getImplementation,
  getCallImplementation,
  getUpgradeDelay,
  ...extendDetect(detect),
}
