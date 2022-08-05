import { providers } from 'ethers'

import { getStarkWare2019Implementation } from '../../../common/starkWareProxy'
import { StarkNet__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getStarkNet(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const starkNet = StarkNet__factory.connect(addresses.starkNet, provider)

  return {
    name: 'StarkNet',
    address: starkNet.address,
    upgradeability: {
      type: 'proxy',
      implementation: await getStarkWare2019Implementation(provider, starkNet),
    },
    values: {
      upgradeActivationDelay: (
        await starkNet.getUpgradeActivationDelay()
      ).toNumber(),
      configHash: (await starkNet.configHash()).toHexString(),
      programHash: (await starkNet.programHash()).toHexString(),
    },
  }
}
