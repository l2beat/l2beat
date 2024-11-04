import { bridges, layer2s, layer3s } from '@l2beat/config'
import { ApiPreviewPermission, ApiPreviewResponse } from './types'

const allProjects = [...layer2s, ...layer3s, ...bridges]

export function getPreview(projectId: string): ApiPreviewResponse | undefined {
  const project = allProjects.find((p) => p.id === projectId)
  if (!project) {
    return undefined
  }

  const permissions =
    project.permissions === 'UnderReview' || project.permissions === undefined
      ? []
      : project.permissions

  return {
    permissions: permissions.map(
      (p): ApiPreviewPermission => ({
        addresses: p.accounts.map((a) => a.address.toString()),
        name: p.name,
        description: p.description,
        multisigParticipants: p.participants?.map((p) => p.address.toString()),
      }),
    ),
  }
}
