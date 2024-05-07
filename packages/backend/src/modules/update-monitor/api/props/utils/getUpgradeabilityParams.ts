import type {
  ContractParameters,
  DiscoveryOutput,
} from '@l2beat/discovery-types'
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
            value: isObject(value) ? JSON.stringify(value) : value.toString(),
            discoveryChild: getDiscoveryChild(discovery, contract, value),
          },
        ],
      })
    } else {
      result.push({
        name: key,
        values: value.map((v) => ({
          value: v,
          discoveryChild: getDiscoveryChild(discovery, contract, v),
        })),
      })
    }
  })

  return result
}
