import { ContractValue, EthereumAddress } from '@l2beat/shared-pure'

import { HandlerResult } from '../handlers/Handler'

export function getRelatives(
  parameters: HandlerResult[],
  ignoredFields?: string[],
  knownRelatives?: EthereumAddress[],
  ignoredAddresses?: EthereumAddress[],
) {
  return parameters
    .filter((x) => !x.ignoreRelative)
    .filter((x) => !ignoredFields?.includes(x.field))
    .flatMap((x) => getAddresses(x.value))
    .concat(knownRelatives ?? [])
    .filter((x) => !ignoredAddresses?.includes(x))
    .filter((x, i, a) => a.indexOf(x) === i)
}

function getAddresses(value: ContractValue | undefined): EthereumAddress[] {
  if (Array.isArray(value)) {
    return value.flatMap(getAddresses)
  } else if (typeof value === 'object') {
    return Object.values(value).flatMap(getAddresses)
  } else if (typeof value === 'string') {
    try {
      return [EthereumAddress(value)]
    } catch {
      return []
    }
  }
  return []
}
