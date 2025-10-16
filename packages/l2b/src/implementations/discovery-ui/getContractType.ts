import type { EntryParameters } from '@l2beat/discovery'
import type { ApiAddressEntry } from './types'

export function getContractType(
  entry: EntryParameters,
): ApiAddressEntry['type'] {
  if (entry.unverified) {
    return 'Unverified'
  }
  if (entry.values?.['$members']) {
    return 'Multisig'
  }
  if (
    !!entry.values?.['name'] &&
    !!entry.values?.['symbol'] &&
    !!entry.values?.['decimals']
  ) {
    return 'Token'
  }
  if (entry.values?.['TIMELOCK_ADMIN_ROLE']) {
    return 'Timelock'
  }
  if (Array.isArray(entry.values?.['$implementation'])) {
    return 'Diamond'
  }
  if (entry.template === undefined) {
    return 'Untemplatized'
  }
  return 'Contract'
}
