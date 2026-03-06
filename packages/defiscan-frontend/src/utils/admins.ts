import type { CompiledAdmin } from '../types'

const HUMAN_ADMIN_TYPES = new Set([
  'EOA',
  'EOAPermissioned',
  'Multisig',
  'Timelock',
])

export function isHumanAdminType(adminType: string): boolean {
  return HUMAN_ADMIN_TYPES.has(adminType)
}

export function getHumanAdmins(admins: CompiledAdmin[]): CompiledAdmin[] {
  return admins.filter((a) => isHumanAdminType(a.adminType) || a.isGovernance)
}
