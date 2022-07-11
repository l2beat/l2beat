import { providers } from 'ethers'

import { getEip1967Admin, getEip1967Implementation } from '../../common/eip1967'
import { ZkSwap1Verifier__factory } from '../../typechain'
import { ContractParameters } from '../../types'
import { addresses } from '../constants'

export async function getVerifierExit(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const verifierExit = ZkSwap1Verifier__factory.connect(
    addresses.verifierExit,
    provider,
  )

  return {
    name: 'VerifierExit',
    address: verifierExit.address,
    upgradeability: {
      type: 'proxy',
      implementation: await getEip1967Implementation(provider, verifierExit),
    },
    values: [
      {
        name: 'admin',
        value: await getEip1967Admin(provider, verifierExit),
      },
    ],
  }
}
