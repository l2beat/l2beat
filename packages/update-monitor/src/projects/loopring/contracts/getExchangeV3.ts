import { providers } from 'ethers'

import { LoopringProxy } from '../../../common/proxies/LoopringProxy'
import { ExchangeV3__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getExchangeV3(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const exchangeV3 = ExchangeV3__factory.connect(addresses.exchangeV3, provider)

  return {
    name: 'ExchangeV3',
    address: exchangeV3.address,
    upgradeability: await LoopringProxy.getUpgradeability(provider, exchangeV3),
    values: {
      agentRegistry: await exchangeV3.getAgentRegistry(),
      depositContract: await exchangeV3.getDepositContract(),
      owner: await exchangeV3.owner(),
      version: await exchangeV3.version(),
    },
  }
}
