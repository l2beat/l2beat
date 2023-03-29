import { ContractParameters } from '@l2beat/shared'
import { ethers } from 'ethers'

import { DiscoveryConfig } from '../../../../../../core/discovery/DiscoveryConfig'
import { DashboardContractField } from '../utils/getValues'
import { getDescription } from './getDescription'
import { getFieldName } from './getFieldName'

export function getIgnoredMethods(
  config: DiscoveryConfig,
  contract: ContractParameters,
  viewABI: ethers.utils.Interface,
) {
  let ignoreMethods: DashboardContractField[] | undefined = undefined
  if (config.overrides?.[contract.address.toString()]) {
    const override = config.overrides[contract.address.toString()]
    if (override.ignoreMethods) {
      ignoreMethods = override.ignoreMethods.map((field) => {
        return {
          name: getFieldName(viewABI, field),
          description: getDescription(config, contract.address, field),
        }
      })
    }
  }
  return ignoreMethods
}
