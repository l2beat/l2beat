import type { CompiledAdmin } from '../types'
import { formatUsdValue } from './format'

/** Generate a human-readable one-line narrative for an admin entry. */
export function generateAdminNarrative(admin: CompiledAdmin): string {
  const capitalStr =
    admin.totalReachableCapital > 0
      ? ` with access to ${formatUsdValue(admin.totalReachableCapital)} in TVL`
      : ''

  const funcCount = admin.functions.length
  const funcStr = `${funcCount} permissioned function${funcCount !== 1 ? 's' : ''}`

  return `This ${humanAdminType(admin.adminType)} controls ${funcStr}${capitalStr}.`
}

function humanAdminType(type: string): string {
  switch (type) {
    case 'EOA':
      return 'externally owned account'
    case 'EOAPermissioned':
      return 'permissioned EOA'
    case 'Multisig':
      return 'multisig'
    case 'Timelock':
      return 'timelock'
    case 'Contract':
    case 'Untemplatized':
      return 'contract'
    case 'Diamond':
      return 'diamond proxy'
    case 'Immutable':
      return 'immutable contract'
    case 'Upgradeable':
      return 'upgradeable contract'
    case 'Revoked':
      return 'revoked address'
    default:
      return type.toLowerCase()
  }
}
