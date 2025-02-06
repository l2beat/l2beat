import type { ContractParameters } from '@l2beat/discovery-types'
import type { ApiAddressEntry } from './types'

export function getContractName(
  c: ContractParameters,
): ApiAddressEntry['name'] {
  if (c.values?.['$members']) {
    const threshold = c.values?.['$threshold'] as number
    const members = (c.values?.['$members'] as string[]).length
    const percentage = ((threshold / members) * 100).toFixed(0)

    const nodeName = [
      `${threshold}/${members}`,
      ...(threshold === members ? [] : [`${percentage}%`]),
      c.name,
    ].join(' ')

    return nodeName
  }

  return c.name
}
