import { providers } from 'ethers'

import { bytes32ToAddress } from '../../../common/address'
import { Eip1967Proxy } from '../../../common/proxies/Eip1967Proxy'
import { ZkSwap1ZkSync, ZkSwap1ZkSync__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getZkSync(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const zkSync = ZkSwap1ZkSync__factory.connect(addresses.zkSync, provider)

  return {
    name: 'zkSync',
    address: zkSync.address,
    upgradeability: await Eip1967Proxy.getUpgradeability(provider, zkSync),
    values: {
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
