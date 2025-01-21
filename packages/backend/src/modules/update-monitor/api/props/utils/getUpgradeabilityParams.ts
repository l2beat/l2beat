import type {
  ContractParameters,
  ContractValue,
  DiscoveryOutput,
} from '@l2beat/discovery-types'
import { isArray, isObject } from 'lodash'

import { getDiscoveryChild } from './getDiscoveryChild'
import type { DashboardContractField } from './getValues'

export function getUpgradeabilityParams(
  discovery: DiscoveryOutput,
  contract: ContractParameters,
): DashboardContractField[] {
  const result: DashboardContractField[] = []

  const fields: [string, ContractValue | undefined][] = [
    ['proxyType', contract.proxyType],
    ['admin', contract.values?.$admin],
    ['implementation', contract.values?.$implementation],
  ]

  fields.forEach(([key, value]) => {
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
