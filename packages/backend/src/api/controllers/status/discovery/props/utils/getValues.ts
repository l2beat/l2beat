import {
  ContractParameters,
  ContractValue,
  DiscoveryOutput,
} from '@l2beat/shared'
import { isArray } from 'lodash'

import { getDiscoveryChild } from './getDiscoveryChild'

export interface DashboardContractField {
  name: string
  values?: DashboardContractFieldValue[]
  description?: string
}

export interface DashboardContractFieldValue {
  value: ContractValue
  discoveryChild?: string
}

export function getValues(
  discovery: DiscoveryOutput,
  contract: ContractParameters,
  field: string,
): DashboardContractFieldValue[] {
  const value = discovery.contracts.find((c) => c.address === contract.address)
    ?.values?.[field]

  if (value === undefined) {
    return []
  }

  if (!isArray(value)) {
    return [
      {
        value: value,
        discoveryChild: getDiscoveryChild(discovery, contract, value),
      },
    ]
  }

  return value.map((v) => ({
    value: v,
    discoveryChild: getDiscoveryChild(discovery, contract, v),
  }))
}
