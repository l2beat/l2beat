import { ContractValue } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { DiscoveryContractField } from '../config/RawDiscoveryConfig'
import { HandlerResult } from '../handlers/Handler'
import { AddressesWithTemplates } from './AddressAnalyzer'

export function getRelativesWithSuggestedTemplates(
  parameters: HandlerResult[],
  ignoredFields?: string[],
  knownRelatives?: EthereumAddress[],
  ignoredAddresses?: EthereumAddress[],
  fields?: { [field: string]: DiscoveryContractField },
): AddressesWithTemplates {
  const result: AddressesWithTemplates = {}
  for (const known of knownRelatives ?? []) {
    result[known.toString()] = new Set()
  }
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

function getAddresses(
  value: ContractValue | undefined,
  template?: string,
): EthereumAddress[] {
  if (Array.isArray(value)) {
    return value.flatMap((v) => getAddresses(v, template))
  } else if (typeof value === 'object') {
    return Object.values(value).flatMap((v) => getAddresses(v, template))
  } else if (typeof value === 'string') {
    try {
      return [EthereumAddress(value)]
    } catch {
      return []
    }
  }
  return []
}
