import { providers } from 'ethers'

import { bytes32ToAddress } from '../../common/address'
import { getEip1967Admin, getEip1967Implementation } from '../../common/eip1967'
import { ZkSync, ZkSync__factory } from '../../typechain'
import { ContractParameters } from '../../types'
import { addresses, securityCouncil } from '../constants'

export async function getZkSync(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const zkSync = ZkSync__factory.connect(addresses.zkSync, provider)

  const additional = await getAdditional(zkSync)

  return {
    name: 'zkSync',
    address: zkSync.address,
    upgradeability: {
      type: 'proxy',
      implementation: await getEip1967Implementation(provider, zkSync),
    },
    values: {
      admin: await getEip1967Admin(provider, zkSync),
      additional,
      securityCouncil:
        additional === addresses.additional ? securityCouncil : 'unknown',
    },
  }
}

async function getAdditional(zkSync: ZkSync) {
  const slot = 19 // checked manually in contract code
  const value = await zkSync.provider.getStorageAt(zkSync.address, slot)
  return bytes32ToAddress(value)
}
