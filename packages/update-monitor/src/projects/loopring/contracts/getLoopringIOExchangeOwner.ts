import { providers } from 'ethers'

import { LoopringIOExchangeOwner__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getLoopringIOExchangeOwner(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const loopringIOExchangeOwner = LoopringIOExchangeOwner__factory.connect(
    addresses.loopringIOExchangeOwner,
    provider,
  )

  return {
    name: 'LoopringIOExchangeOwner',
    address: loopringIOExchangeOwner.address,
    upgradeability: { type: 'immutable' },
    values: {
      owner: await loopringIOExchangeOwner.owner(),
      target: await loopringIOExchangeOwner.target(),
    },
  }
}
