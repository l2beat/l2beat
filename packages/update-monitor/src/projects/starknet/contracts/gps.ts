import { providers } from 'ethers'

import { getStarkWare2019Implementation } from '../../../common/starkWareProxy'
import { CallProxy__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getGps(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const callProxy = CallProxy__factory.connect(
    addresses.gpsStatementVerifier,
    provider,
  )

  return {
    name: 'GpsStatementVerifier',
    address: callProxy.address,
    upgradeability: {
      type: 'call proxy',
      implementation: await getStarkWare2019Implementation(provider, callProxy),
      callProxyImplementation: await callProxy.callProxyImplementation(),
    },
    values: {},
  }
}
