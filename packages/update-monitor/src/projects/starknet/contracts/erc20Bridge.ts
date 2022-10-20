import { providers } from 'ethers'

import { StarkWareProxy } from '../../../common/proxies/StarkWareProxy'
import { StarknetERC20Bridge__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'

export async function getErc20Bridge(
  provider: providers.JsonRpcProvider,
  address: string,
  name: string,
): Promise<ContractParameters> {
  const erc20Bridge = StarknetERC20Bridge__factory.connect(address, provider)

  return {
    name,
    address,
    upgradeability: await StarkWareProxy.getUpgradeability(
      provider,
      erc20Bridge,
    ),
    values: {
      isFrozen: await erc20Bridge.isFrozen(),
      maxDeposit: (await erc20Bridge.maxDeposit()).toNumber(),
      maxTotalBalance: (await erc20Bridge.maxTotalBalance()).toNumber(),
    },
  }
}
