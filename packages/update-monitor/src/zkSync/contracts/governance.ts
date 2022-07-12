import { providers } from 'ethers'

import { getEip1967Admin, getEip1967Implementation } from '../../common/eip1967'
import { ZkSyncGovernance, ZkSyncGovernance__factory } from '../../typechain'
import { ContractParameters } from '../../types'
import { addresses } from '../constants'

export async function getGovernance(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const governance = ZkSyncGovernance__factory.connect(
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
    values: [
      {
        name: 'admin',
        value: await getEip1967Admin(provider, governance),
      },
      {
        name: 'validators',
        value: await getValidators(governance),
      },
      {
        name: 'networkGovernor',
        value: await governance.networkGovernor(),
      },
      {
        name: 'tokenGovernance',
        value: await governance.tokenGovernance(),
      },
    ],
  }
}

async function getValidators(governance: ZkSyncGovernance) {
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
