import { ProjectId } from '@l2beat/shared-pure'
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

function getDaLayerVerification(
  project: ScalingProject,
  daBridges: BaseProject[],
): boolean {
  const bridge = daBridges.find(
    (p) => p.id === project.dataAvailability?.bridge.projectId,
  )
  if (!bridge) {
    return true
  }

  const hostChainId = project.hostChain ?? ProjectId.ETHEREUM

  const daBridgePermissionsNotVerified = Object.values(
    bridge?.permissions?.[hostChainId] ?? {},
  )
    .flatMap((p) => [...(p.roles ?? []), ...(p.actors ?? [])])
    .flatMap((p) => p.accounts)
    .some((a) => !a.isVerified)

  const daBridgeContractsNotVerified = bridge?.contracts?.addresses?.[
    hostChainId
  ].some((c) => !c.isVerified)

  return !daBridgeContractsNotVerified && !daBridgePermissionsNotVerified
}

export function isVerified(
  project: ScalingProject | Bridge,
  daBridges?: BaseProject[],
): boolean {
  const contracts = getContractsVerification(project)
  const permissions = getPermissionsVerification(project)

  const escrows = project.config.escrows.every(
    (e) => e.contract?.isVerified ?? true,
  )

  const daLayer =
    (project.type === 'layer2' || project.type === 'layer3') && daBridges
      ? getDaLayerVerification(project, daBridges)
      : true

  return escrows && permissions && contracts && daLayer
}

export function isProjectVerified(project: BaseProject): boolean {
  return (
    getContractsVerification(project) && getPermissionsVerification(project)
  )
}
