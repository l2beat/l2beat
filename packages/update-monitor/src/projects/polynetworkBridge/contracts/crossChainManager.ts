import { providers } from 'ethers'

import { EthCrossChainManager__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'

export async function getEthCrossChainManager(
  provider: providers.JsonRpcProvider,
  ethCrossChainManagerAddress: string,
): Promise<ContractParameters> {
  const manager = EthCrossChainManager__factory.connect(
    ethCrossChainManagerAddress,
    provider,
  )

  return {
    name: 'EthCrossChainManager',
    address: ethCrossChainManagerAddress,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      EthCrossChainDataAddress: await manager.EthCrossChainDataAddress(),
      chainId: (await manager.chainId()).toNumber(),
      isOwner: await manager.isOwner(),
      owner: await manager.owner(),
      paused: await manager.paused(),
      whiteLister: await manager.whiteLister(),
    },
  }
}
