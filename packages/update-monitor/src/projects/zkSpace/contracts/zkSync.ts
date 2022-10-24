import { providers } from 'ethers'

import { bytes32ToAddress } from '../../../common/address'
import { Eip1967Proxy } from '../../../common/proxies/Eip1967Proxy'
import { ZkSpaceZkSync, ZkSpaceZkSync__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getZkSync(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const zkSync = ZkSpaceZkSync__factory.connect(addresses.zkSync, provider)

  return {
    name: 'zkSync',
    address: zkSync.address,
    upgradeability: await Eip1967Proxy.getUpgradeability(provider, zkSync),
    values: {
      zkSyncCommitBlock: await zkSync.zkSyncCommitBlockAddress(),
      zkSyncExit: await zkSync.zkSyncExitAddress(),
      zkSea: await zkSync.zkSeaAddress(),
      verifier: await getAddressAt(zkSync, 5),
      verifierExit: await getAddressAt(zkSync, 6),
      governance: await getAddressAt(zkSync, 7),
      zkSeaNFT: await getAddressAt(zkSync, 8),
      pairManager: await getAddressAt(zkSync, 9),
    },
  }
}

async function getAddressAt(zkSync: ZkSpaceZkSync, slot: number) {
  const value = await zkSync.provider.getStorageAt(zkSync.address, slot)
  return bytes32ToAddress(value)
}
