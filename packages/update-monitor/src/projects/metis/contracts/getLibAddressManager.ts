import { providers } from 'ethers'

import { Lib_AddressManager__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getLibAddressManager(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const libAddressManager = Lib_AddressManager__factory.connect(
    addresses.libAddressManager,
    provider,
  )

  return {
    name: 'LibAddressManager',
    address: libAddressManager.address,
    upgradeability: { type: 'immutable' },
    values: {
      owner: await libAddressManager.owner(),
    },
  }
}
