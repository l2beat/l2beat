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

/*  Slots
1 - 
2 - MemoryPageFact Registry
0xc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b - CPU Friless Verifier (verifier[0])
0xc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85c - CPU Friless Verifier (verifier[1])
0xc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85d - CPU Friless Verifier (verifier[2])
*/
