import { providers } from 'ethers'

import { bytes32ToAddress } from '../../common/address'
import { getEip1967Admin, getEip1967Implementation } from '../../common/eip1967'
import { ZkSwap1ZkSync, ZkSwap1ZkSync__factory } from '../../typechain'
import { ContractParameters } from '../../types'
import { addresses } from '../constants'

export async function getZkSync(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const zkSync = ZkSwap1ZkSync__factory.connect(addresses.zkSync, provider)

  return {
    name: 'zkSync',
    address: zkSync.address,
    upgradeability: {
      type: 'proxy',
      implementation: await getEip1967Implementation(provider, zkSync),
    },
    values: {
      admin: await getEip1967Admin(provider, zkSync),
      zkSyncCommitBlock: await zkSync.zkSyncCommitBlockAddress(),
      zkSyncExit: await zkSync.zkSyncExitAddress(),
      verifier: await getAddressAt(zkSync, 5),
      verifierExit: await getAddressAt(zkSync, 6),
      governance: await getAddressAt(zkSync, 7),
      pairManager: await getAddressAt(zkSync, 8),
    },
  }
}

async function getAddressAt(zkSync: ZkSwap1ZkSync, slot: number) {
  const value = await zkSync.provider.getStorageAt(zkSync.address, slot)
  return bytes32ToAddress(value)
}
