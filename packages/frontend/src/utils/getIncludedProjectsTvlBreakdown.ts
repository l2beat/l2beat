import {
  DetailedTvlApiResponse,
  ProjectAssetsBreakdownApiResponse,
  ProjectId,
} from '@l2beat/shared-pure'

export function getIncludedProjectsTvlBreakdown<
  T extends { id: ProjectId; isUpcoming?: boolean; type: 'bridge' | 'layer2' },
>(
  projects: T[],
  tvlApiResponse: DetailedTvlApiResponse,
  tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse,
) {
  const included = projects
    .filter((x) => !x.isUpcoming)
    .filter(
      (x) =>
        !!tvlApiResponse.projects[x.id.toString()] &&
        // eslint-disable-next-line
        !!tvlBreakdownApiResponse.breakdowns[x.id.toString()],
    )

  return included
}
