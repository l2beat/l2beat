import type { ProjectContracts, ProjectPermissions } from '../'

export function arePermissionsDiscoveryDriven(
  permissions?: Record<string, ProjectPermissions>,
): boolean {
  if (!permissions) {
    return true
  }
  return Object.values(permissions).every((e) => {
    const all = [...(e?.roles ?? []), ...(e?.actors ?? [])]
    return all.every((p) => p.discoveryDrivenData === true)
  })
}

export function areContractsDiscoveryDriven(
  contracts?: ProjectContracts,
): boolean {
  return Object.values(contracts?.addresses ?? {}).every((e) =>
    e.every((a) => a.discoveryDrivenData === true),
  )
}
