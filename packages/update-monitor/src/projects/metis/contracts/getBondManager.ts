import { providers } from 'ethers'

import { BondManager__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getBondManager(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const bondManager = BondManager__factory.connect(
    addresses.bondManager,
    provider,
  )

  const addressManager: string = await bondManager.libAddressManager()

  return {
    name: 'BondManager',
    address: bondManager.address,
    upgradeability: { type: 'immutable' },
    values: {
      libAddressManager: addressManager,
    },
  }
}
