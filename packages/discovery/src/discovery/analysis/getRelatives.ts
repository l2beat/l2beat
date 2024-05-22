import { ContractValue } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { HandlerResult } from '../handlers/Handler'
import { DiscoveryContractField } from '../config/RawDiscoveryConfig'

export function getRelatives(
  parameters: HandlerResult[],
  ignoredFields?: string[],
  knownRelatives?: EthereumAddress[],
  ignoredAddresses?: EthereumAddress[],
  fields?: { [key: string]: DiscoveryContractField }
): { address: EthereumAddress, template?: string }[] {
  const result = parameters
    .filter((x) => !x.ignoreRelative)
    .filter((x) => !ignoredFields?.includes(x.field))
    .flatMap((x) => getAddresses(x.value, fields?.[x.field]?.target?.handler ?? undefined))
    .concat(knownRelatives?.map(a => ({ address: a })) ?? [])
    .filter((x) => !ignoredAddresses?.includes(x.address))
  return result
    // .filter((x, i, a) => a.indexOf(x) === i) // removes duplicates
}

function getAddresses(value: ContractValue | undefined, template?: string): { address: EthereumAddress, template?: string}[] {
  if (Array.isArray(value)) {
    return value.flatMap((v) => getAddresses(v, template))
  } else if (typeof value === 'object') {
    return Object.values(value).flatMap((v) => getAddresses(v, template))
  } else if (typeof value === 'string') {
    try {
      return [{ address: EthereumAddress(value), template }]
    } catch {
      return []
    }
  }
  return []
}
