import { providers } from 'ethers'

import {
  getEip1967Admin,
  getEip1967Implementation,
} from '../../../common/eip1967'
import {
  ZkSwap1Governance,
  ZkSwap1Governance__factory,
} from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getGovernance(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const governance = ZkSwap1Governance__factory.connect(
    addresses.governance,
    provider,
  )

  return {
    name: 'Governance',
    address: governance.address,
    upgradeability: {
      type: 'proxy',
      implementation: await getEip1967Implementation(provider, governance),
    },
    values: {
      admin: await getEip1967Admin(provider, governance),
      validators: await getValidators(governance),
      networkGovernor: await governance.networkGovernor(),
    },
  }
}

async function getValidators(governance: ZkSwap1Governance) {
  const events = await governance.queryFilter(
    governance.filters.ValidatorStatusUpdate(),
    0,
  )
  const validators = new Set<string>()
  for (const event of events) {
    if (event.args.isActive) {
      validators.add(event.args.validatorAddress)
    } else {
      validators.delete(event.args.validatorAddress)
    }
  }
  return [...validators]
}
