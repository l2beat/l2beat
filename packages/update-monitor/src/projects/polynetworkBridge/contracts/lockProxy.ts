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
    // There can be multiple LockProxies, so appending address prefix to the name
    name: `LockProxy ${address.slice(0, 6)}...`,
    address: address,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      isOwner: await lockProxy.isOwner(),
      managerProxyContract: await lockProxy.managerProxyContract(),
      managerProxyContractImplementation: ethCrossChainManagerAddress,
      owner: await lockProxy.owner(),
    },
  }
}
