import { providers } from 'ethers'

import { OrbitBridgeProxy__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getBridgeWithGovernance(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const bridgeProxy = OrbitBridgeProxy__factory.connect(
    addresses.bridge,
    provider,
  )

  return {
    name: 'Bridge with Governance',
    address: addresses.bridge,
    upgradeability: {
      type: 'proxy',
      implementation: await bridgeProxy.implementation(),
    },
    values: {
      owners: await bridgeProxy.getOwners(),
      required: (await bridgeProxy.required()).toNumber(),
    },
  }
}
