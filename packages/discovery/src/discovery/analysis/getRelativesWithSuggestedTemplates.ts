import type { EthereumAddress } from '@l2beat/shared-pure'

import type { DiscoveryContractField } from '../config/RawDiscoveryConfig'
import type { HandlerResult } from '../handlers/Handler'
import type { AddressesWithTemplates } from './AddressAnalyzer'
import { getAddresses } from './metaUtils'

export function getRelativesWithSuggestedTemplates(
  parameters: HandlerResult[],
  ignoredFields?: string[],
  ignoredAddresses?: EthereumAddress[],
  fields?: { [field: string]: DiscoveryContractField },
): AddressesWithTemplates {
  const result: AddressesWithTemplates = {}
  for (const param of parameters) {
    if (param.ignoreRelative || ignoredFields?.includes(param.field)) {
      continue
    }
    const addresses = getAddresses(param.value).filter(
      (address) => !ignoredAddresses?.includes(address),
    )
    const template = fields?.[param.field]?.target?.template ?? undefined
    for (const address of addresses) {
      const curTemplates = result[address.toString()] ?? new Set()
      result[address.toString()] = curTemplates

      if (template !== undefined) {
        curTemplates.add(template)
      }
    }
  }

  return result
}
