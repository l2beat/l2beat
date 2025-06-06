import { ProjectId } from '@l2beat/shared-pure'
import type { Bridge, ScalingProject } from '../internalTypes'
import type {
  BaseProject,
  ProjectPermissions,
  ProjectUnverifiedContract,
} from '../types'

function getUnverifiedContracts(
  project: ScalingProject | Bridge | BaseProject,
): ProjectUnverifiedContract[] {
  return Object.values(project.contracts?.addresses ?? {})
    .flat()
    .filter((c) => !c.isVerified)
    .map((c) => ({
      chain: c.chain,
      address: c.address,
    }))
}

function getUnverifiedPermissions(
  project: ScalingProject | Bridge | BaseProject,
): ProjectUnverifiedContract[] {
  return Object.values(project.permissions ?? {})
    .flat()
    .flatMap((p) => [...(p.roles ?? []), ...(p.actors ?? [])])
    .flatMap((p) =>
      p.accounts.map((a) => ({
        chain: p.chain,
        address: a.address,
        isVerified: a.isVerified,
      })),
    )
    .filter((c) => !c.isVerified)
}

function getUnverifiedDaLayerContracts(
  project: ScalingProject,
  daBridges: BaseProject[],
): ProjectUnverifiedContract[] {
  const bridge = daBridges.find(
    (p) => p.id === project.dataAvailability?.bridge.projectId,
  )
  if (!bridge) {
    return []
  }

  const hostChainId = project.hostChain ?? ProjectId.ETHEREUM

  const unverifiedDaBridgePermissions = (
    Object.values(
      bridge?.permissions?.[hostChainId] ?? {},
    ) as ProjectPermissions[]
  )
    .flatMap((p) => [...(p.roles ?? []), ...(p.actors ?? [])])
    .flatMap((p) =>
      p.accounts.map((a) => ({
        chain: p.chain,
        address: a.address,
        isVerified: a.isVerified,
      })),
    )
    .filter((c) => !c.isVerified)

  const unverifiedDaBridgeContracts = bridge?.contracts?.addresses?.[
    hostChainId
  ]
    .filter((c) => !c.isVerified)
    .map((c) => ({
      chain: c.chain,
      address: c.address,
    }))

  return [
    ...(unverifiedDaBridgeContracts ?? []),
    ...(unverifiedDaBridgePermissions ?? []),
  ]
}

function getUnverifiedEscrows(
  project: ScalingProject | Bridge,
): ProjectUnverifiedContract[] {
  return project.config.escrows.filter((e) => !e.contract?.isVerified)
}

export function getProjectUnverifiedContracts(
  project: ScalingProject | Bridge | BaseProject,
  daBridges?: BaseProject[],
): ProjectUnverifiedContract[] {
  const contracts = getUnverifiedContracts(project)
  const permissions = getUnverifiedPermissions(project)

  const isBaseProject = !('type' in project)
  if (isBaseProject) {
    return [...contracts, ...permissions]
  }

  const escrows = getUnverifiedEscrows(project)
  const daLayer =
    (project.type === 'layer2' || project.type === 'layer3') && daBridges
      ? getUnverifiedDaLayerContracts(project, daBridges)
      : []

  return [...contracts, ...permissions, ...escrows, ...daLayer]
}
