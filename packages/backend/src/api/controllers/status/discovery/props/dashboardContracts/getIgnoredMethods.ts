import { ContractParameters } from '@l2beat/shared'
import { ethers } from 'ethers'

import { getContractOverrides } from '../../../../../../core/discovery/discover'
import { DiscoveryConfig } from '../../../../../../core/discovery/DiscoveryConfig'
import { DashboardContractField } from '../utils/getValues'
import { getFieldName } from './getFieldName'

export function getIgnoredMethods(
  contract: ContractParameters,
  config: DiscoveryConfig,
  viewABI: ethers.utils.Interface,
) {
  let ignoreMethods: DashboardContractField[] | undefined = undefined
  const override = getContractOverrides(contract.address, config)
  if (override) {
    if (override.ignoreMethods) {
      ignoreMethods = override.ignoreMethods.map((field) => {
        return {
          name: getFieldName(field, viewABI),
        }
      })
    }
  }
  return ignoreMethods
}
