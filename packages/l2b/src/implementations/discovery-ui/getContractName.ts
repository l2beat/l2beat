import type { ContractParameters } from '@l2beat/discovery-types'
import type { ApiAddressEntry } from './types'

export function getContractName(
  c: ContractParameters,
): ApiAddressEntry['name'] {
  if (c.values?.['$members']) {
    const threshold = c.values?.['$threshold'] as number
    const members = c.values?.['$members'] as string[]

    return `${c.name} | ${threshold}/${members.length}`
  }

  return c.name
}
