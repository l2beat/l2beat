import { providers } from 'ethers'

import { SolletBridge__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getBridge(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const bridge = SolletBridge__factory.connect(addresses.bridge, provider)

  return {
    name: 'SplTokenSwap',
    address: addresses.bridge,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      owner: await bridge.owner(),
      paused: await bridge.paused(),
    },
  }
}
