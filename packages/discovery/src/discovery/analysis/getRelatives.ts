import { ContractValue } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { DiscoveryContractField } from '../config/RawDiscoveryConfig'
import { HandlerResult } from '../handlers/Handler'
import { AddressesWithTemplates } from './AddressAnalyzer'

export function getRelatives(
  parameters: HandlerResult[],
  ignoredFields?: string[],
  knownRelatives?: EthereumAddress[],
  ignoredAddresses?: EthereumAddress[],
  fields?: { [key: string]: DiscoveryContractField },
): AddressesWithTemplates {
  const result: AddressesWithTemplates = {}

  for (const param of parameters) {
    if (param.ignoreRelative || ignoredFields?.includes(param.field)) {
      continue
    }
    const addresses = getAddresses(param.value)
    const withKnownRelatives = addresses.concat(knownRelatives ?? [])
    const deduplicated = withKnownRelatives.filter(
      (address, index, self) => self.indexOf(address) === index,
    )
    const withoutIgnored = deduplicated.filter(
      (address) => !ignoredAddresses?.includes(address),
    )
    const template = fields?.[param.field]?.target?.handler ?? undefined
    for (const address of withoutIgnored) {
      const addressStr = address.toString()
      const curTemplates = result[addressStr] ?? new Set()
      result[addressStr] = curTemplates

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
