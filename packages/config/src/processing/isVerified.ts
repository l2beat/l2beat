import type { Bridge, ScalingProject } from '../internalTypes'
import type { BaseProject } from '../types'

function getContractsVerification(
  project: ScalingProject | Bridge | BaseProject,
): boolean {
  return Object.values(project.contracts?.addresses ?? {})
    .flat()
    .every((c) => c.isVerified)
}

function getPermissionsVerification(
  project: ScalingProject | Bridge | BaseProject,
): boolean {
  return Object.values(project.permissions ?? {})
    .flat()
    .flatMap((p) => [...(p.roles ?? []), ...(p.actors ?? [])])
    .flatMap((p) => p.accounts)
    .every((a) => a.isVerified)
}

export function isVerified(project: ScalingProject | Bridge): boolean {
  const contracts = getContractsVerification(project)
  const permissions = getPermissionsVerification(project)

  const escrows = project.config.escrows.every(
    (e) => e.contract?.isVerified ?? true,
  )

  return escrows && permissions && contracts
}

export function isProjectVerified(project: BaseProject): boolean {
  return (
    getContractsVerification(project) && getPermissionsVerification(project)
  )
}
