import { providers } from 'ethers'

import { getEip897Implementation } from '../../../common/eip897'
import {  OrbitBridgeProxy__factory } from '../../../typechain'
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
      implementation: await getEip897Implementation(provider, addresses.bridge),
    },
    values: {
      validators: await bridgeProxy.getOwners(),
      threshold: (await bridgeProxy.required()).toNumber(),
    },
  }
}
