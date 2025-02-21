import type { BaseProject } from '../'

export function arePermissionsDiscoveryDriven(project: BaseProject): boolean {
  if (!project.permissions) {
    return true
  }
  return Object.values(project.permissions).every((e) => {
    const all = [...(e?.roles ?? []), ...(e?.actors ?? [])]
    return all.every((p) => p.discoveryDrivenData === true)
  })
}

export function areContractsDiscoveryDriven(project: BaseProject): boolean {
  return Object.values(project.contracts?.addresses ?? {}).every((e) =>
    e.every((a) => a.discoveryDrivenData === true),
  )
}

export function isDiscoveryDriven(project: BaseProject): boolean {
  const permissions = arePermissionsDiscoveryDriven(project)
  const contracts = arePermissionsDiscoveryDriven(project)

  return permissions && contracts
}
