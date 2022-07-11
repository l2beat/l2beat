import { providers } from 'ethers'

import { bytes32ToAddress } from '../../common/address'
import { getEip1967Admin, getEip1967Implementation } from '../../common/eip1967'
import { ZkSpaceZkSync, ZkSpaceZkSync__factory } from '../../typechain'
import { ContractParameters } from '../../types'
import { addresses } from '../constants'

export async function getZkSync(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const zkSync = ZkSpaceZkSync__factory.connect(addresses.zkSync, provider)

  return {
    name: 'zkSync',
    address: zkSync.address,
    upgradeability: {
      type: 'proxy',
      implementation: await getEip1967Implementation(provider, zkSync),
    },
    values: [
      {
        name: 'admin',
        value: await getEip1967Admin(provider, zkSync),
      },
      {
        name: 'zkSyncCommitBlock',
        value: await zkSync.zkSyncCommitBlockAddress(),
      },
      {
        name: 'zkSyncExit',
        value: await zkSync.zkSyncExitAddress(),
      },
      {
        name: 'zkSea',
        value: await zkSync.zkSeaAddress(),
      },
      {
        name: 'verifier',
        value: await getAddressAt(zkSync, 5),
      },
      {
        name: 'verifierExit',
        value: await getAddressAt(zkSync, 6),
      },
      {
        name: 'governance',
        value: await getAddressAt(zkSync, 7),
      },
      {
        name: 'zkSeaNFT',
        value: await getAddressAt(zkSync, 8),
      },
      {
        name: 'pairManager',
        value: await getAddressAt(zkSync, 9),
      },
    ],
  }
}

async function getAddressAt(zkSync: ZkSpaceZkSync, slot: number) {
  const value = await zkSync.provider.getStorageAt(zkSync.address, slot)
  return bytes32ToAddress(value)
}
