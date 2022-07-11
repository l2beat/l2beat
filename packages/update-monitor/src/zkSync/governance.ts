import { providers } from 'ethers'
import { getEip1967Implementation } from '../common/eip1967'
import { ZkSyncGovernance__factory } from '../typechain'
import { ContractParameters } from '../types'
import { addresses } from './constants'

export async function getGovernance(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  return {
    name: 'Governance',
    address: addresses.governance,
    upgradeability: {
      type: 'proxy',
      implementation: await getEip1967Implementation(
        provider,
        addresses.governance,
      ),
    },
    roles: [],
    values: [
      {
        name: 'validators',
        value: await getValidators(provider),
      },
    ],
  }
}

async function getValidators(provider: providers.JsonRpcProvider) {
  const governance = ZkSyncGovernance__factory.connect(
    addresses.governance,
    provider,
  )
  const events = await governance.queryFilter(
    governance.filters.ValidatorStatusUpdate(),
    13_809_566,
  )
  const activeValidators = events.reduce<string[]>((acc, { args: e }) => {
    const idx = acc.indexOf(e.validatorAddress)
    if (!e.isActive && idx !== -1) acc.splice(idx, 1)
    if (e.isActive && idx === -1) acc.push(e.validatorAddress)
    return acc
  }, [])
  return activeValidators
}
