import { providers } from 'ethers'

import { PolynetworkBridgeLockProxy__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'

export async function getLockProxy(
  provider: providers.JsonRpcProvider,
  address: string,
  ethCrossChainManagerAddress: string,
): Promise<ContractParameters> {
  const lockProxy = PolynetworkBridgeLockProxy__factory.connect(
    address,
    provider,
  )

  return {
    name: 'LockProxy',
    address: address,
    upgradeability: {
      type: 'proxy',
      implementation: ethCrossChainManagerAddress,
    },
    values: {
      isOwner: await lockProxy.isOwner(),
      managerProxyContract: await lockProxy.managerProxyContract(),
      owner: await lockProxy.owner(),
    },
  }
}
