import type { ContractParameters } from '@l2beat/discovery-types'
import type { ApiAddressEntry } from './types'

export function getContractType(
  contract: ContractParameters,
): ApiAddressEntry['type'] {
  if (contract.unverified) {
    return 'Unverified'
  }
  if (contract.values?.['$members']) {
    return 'Multisig'
  }
  if (
    !!contract.values?.['name'] &&
    !!contract.values?.['symbol'] &&
    !!contract.values?.['decimals']
  ) {
    return 'Token'
  }
  if (contract.values?.['TIMELOCK_ADMIN_ROLE']) {
    return 'Timelock'
  }
  if (Array.isArray(contract.values?.['$implementation'])) {
    return 'Diamond'
  }
  return 'Contract'
}
