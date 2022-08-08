import { providers } from 'ethers'

import { getStarkWare2019Implementation } from '../../../common/starkWareProxy'
import { StarknetERC20Bridge__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'

export async function getErc20Bridge(
  provider: providers.JsonRpcProvider,
  address: string,
  name: string,
): Promise<ContractParameters> {
  const Erc20Bridge = StarknetERC20Bridge__factory.connect(address, provider)

  return {
    name,
    address,
    upgradeability: {
      type: 'proxy',
      implementation: await getStarkWare2019Implementation(provider, address),
    },
    values: {
      isFrozen: await Erc20Bridge.isFrozen(),
      maxDeposit: (await Erc20Bridge.maxDeposit()).toNumber(),
      maxTotalBalance: (await Erc20Bridge.maxTotalBalance()).toNumber(),
    },
  }
}
