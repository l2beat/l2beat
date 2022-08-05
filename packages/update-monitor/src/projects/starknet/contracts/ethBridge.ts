import { providers } from 'ethers'

import { getStarkWare2019Implementation } from '../../../common/starkWareProxy'
import { EthBridge__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getEthBridge(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const ethBridge = EthBridge__factory.connect(addresses.ethBridge, provider)

  return {
    name: 'EthBridge',
    address: ethBridge.address,
    upgradeability: {
      type: 'proxy',
      implementation: await getStarkWare2019Implementation(provider, ethBridge),
    },
    values: {
      upgradeActivationDelay: (
        await ethBridge.getUpgradeActivationDelay()
      ).toNumber(),
      maxDeposit: (await ethBridge.maxDeposit()).toString(),
      maxTotalBalance: (await ethBridge.maxTotalBalance()).toString(),
    },
  }
}
