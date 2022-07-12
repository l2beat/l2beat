import { providers } from 'ethers'

import { getEip1967Admin, getEip1967Implementation } from '../../common/eip1967'
import { ZkSwap2Verifier__factory } from '../../typechain'
import { ContractParameters } from '../../types'
import { addresses } from '../constants'

export async function getVerifier(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const verifier = ZkSwap2Verifier__factory.connect(
    addresses.verifier,
    provider,
  )

  return {
    name: 'Verifier',
    address: verifier.address,
    upgradeability: {
      type: 'proxy',
      implementation: await getEip1967Implementation(provider, verifier),
    },
    values: [
      {
        name: 'admin',
        value: await getEip1967Admin(provider, verifier),
      },
    ],
  }
}
