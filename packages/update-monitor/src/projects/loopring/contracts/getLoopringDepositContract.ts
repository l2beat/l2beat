import { providers } from 'ethers'

import { DefaultDepositContract__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getLoopringDepositContract(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const depositContract = DefaultDepositContract__factory.connect(
    addresses.loopringDeposit,
    provider,
  )

  return {
    name: 'DefaultDepositContract',
    address: depositContract.address,
    upgradeability: { type: 'immutable' },
    values: {
      exchange: await depositContract.exchange(),
      owner: await depositContract.owner(),
    },
  }
}
