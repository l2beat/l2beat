import { providers } from 'ethers'

import { Governance__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getGovernance(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const governance = Governance__factory.connect(addresses.governance, provider)

  const MAX_ACTIVE_PERIOD = (await governance.MAX_ACTIVE_PERIOD()).toNumber()
  const MIN_ACTIVE_PERIOD = (await governance.MIN_ACTIVE_PERIOD()).toNumber()
  const THRESHOLD_DECIMAL = (await governance.THRESHOLD_DECIMAL()).toNumber()
  const [voters, votersPowers] = await governance.getVoters()

  return {
    name: 'SimpleGovernance',
    address: addresses.governance,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      MAX_ACTIVE_PERIOD,
      MIN_ACTIVE_PERIOD,
      THRESHOLD_DECIMAL,
      voters,
      votersPowers: votersPowers.map((p) => p.toNumber()),
    },
  }
}
