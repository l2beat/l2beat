export function adminTypeColor(adminType: string): string {
  switch (adminType) {
    case 'EOA':
    case 'EOAPermissioned':
      return '#EF4444'
    case 'Multisig':
      return '#F59E0B'
    case 'Timelock':
      return '#10B981'
    case 'Governance':
      return '#8B5CF6'
    case 'Contract':
    case 'Diamond':
    case 'Upgradeable':
      return '#3B82F6'
    case 'Revoked':
    case 'Immutable':
      return '#10B981'
    default:
      return '#6B7280'
  }
}

export function adminTypeBgClass(adminType: string): string {
  switch (adminType) {
    case 'EOA':
    case 'EOAPermissioned':
      return 'bg-status-red/10 text-status-red'
    case 'Multisig':
      return 'bg-status-amber/10 text-status-amber'
    case 'Timelock':
      return 'bg-status-green/10 text-status-green'
    case 'Contract':
    case 'Diamond':
    case 'Upgradeable':
      return 'bg-status-blue/10 text-status-blue'
    case 'Revoked':
    case 'Immutable':
      return 'bg-status-green/10 text-status-green'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}
