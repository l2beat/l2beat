import { ContractParameters, DiscoveryOutput } from '@l2beat/shared'
import { isArray, isObject } from 'lodash'

import { getDiscoveryChild } from './getDiscoveryChild'
import { DashboardContractField } from './getValues'

export function getUpgradeabilityParams(
  discovery: DiscoveryOutput,
  contract: ContractParameters,
): DashboardContractField[] {
  const result: DashboardContractField[] = []

  Object.entries(contract.upgradeability).forEach(([key, value]) => {
    if (key === 'type' || value === undefined) {
      return
    }

    if (!isArray(value)) {
      result.push({
        name: key,
        values: [
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            value: isObject(value) ? JSON.stringify(value) : value.toString(),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            discoveryChild: getDiscoveryChild(discovery, contract, value),
          },
        ],
      })
    } else {
      result.push({
        name: key,
        values: value.map((v) => ({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value: v,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          discoveryChild: getDiscoveryChild(discovery, contract, v),
        })),
      })
    }
  })

  return result
}
