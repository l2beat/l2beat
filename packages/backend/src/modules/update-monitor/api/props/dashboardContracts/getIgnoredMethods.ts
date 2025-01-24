import type { DiscoveryConfig } from '@l2beat/discovery'
import type { ContractParameters } from '@l2beat/discovery-types'
import type { ethers } from 'ethers'

import type { DashboardContractField } from '../utils/getValues'
import { getDescription } from './getDescription'
import { getFieldName } from './getFieldName'

export function getIgnoredMethods(
  config: DiscoveryConfig,
  contract: ContractParameters,
  viewABI: ethers.utils.Interface,
) {
  let ignoreMethods: DashboardContractField[] | undefined = undefined
  const override = config.for(contract.address)
  if (override.ignoreMethods) {
    ignoreMethods = override.ignoreMethods.map((field) => {
      return {
        name: getFieldName(viewABI, field),
        description: getDescription(config, contract.address, field),
      }
    })
  }
  return ignoreMethods
}
