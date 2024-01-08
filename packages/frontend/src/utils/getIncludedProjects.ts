import { ProjectId, TvlApiResponse } from '@l2beat/shared-pure'

export function getIncludedProjects<
  T extends {
    id: ProjectId
    isUpcoming?: boolean
    type: 'bridge' | 'layer2' | 'layer3'
  },
>(projects: T[], tvlApiResponse: TvlApiResponse, buildAllProjectPages = false) {
  if (buildAllProjectPages) {
    return projects
  }

  const included = projects
    .filter((x) => !x.isUpcoming)
    .filter((x) => !!tvlApiResponse.projects[x.id.toString()])

  if (projects.every((x) => x.type === 'layer2' || x.type === 'layer3')) {
    included.push(
      ...projects.filter((x) => x.isUpcoming && x.type === 'layer2'),
    )
    included.push(...projects.filter((x) => x.type === 'layer3'))
  }

  return included
}
