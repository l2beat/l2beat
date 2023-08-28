import {
  DetailedTvlApiResponse,
  ProjectId,
  TvlApiResponse,
  ProjectAssetsBreakdownApiResponse,
} from '@l2beat/shared-pure'

export function getIncludedProjectsTvlBreakdown<
  T extends { id: ProjectId; isUpcoming?: boolean; type: 'bridge' | 'layer2' },
>(
  projects: T[],
  tvlApiResponse: TvlApiResponse | DetailedTvlApiResponse,
  tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse | undefined,
  buildAllProjectPages = false,
) {
  if (buildAllProjectPages) {
    return projects
  }

  const included = projects
    .filter((x) => !x.isUpcoming)
    .filter(
      (x) =>
        !!tvlApiResponse.projects[x.id.toString()] &&
        !!tvlBreakdownApiResponse?.breakdowns[x.id.toString()],
    )

  if (projects.every((x) => x.type === 'layer2')) {
    included.push(...projects.filter((x) => x.isUpcoming))
  }

  return included
}
