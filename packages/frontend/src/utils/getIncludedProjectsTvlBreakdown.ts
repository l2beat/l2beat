import {
  ProjectAssetsBreakdownApiResponse,
  ProjectId,
  TvlApiResponse,
} from '@l2beat/shared-pure'

export function getIncludedProjectsTvlBreakdown<
  T extends {
    id: ProjectId
    isUpcoming?: boolean
    type: 'bridge' | 'layer2' | 'layer3'
  },
>(
  projects: T[],
  tvlApiResponse: TvlApiResponse,
  tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse,
) {
  const included = projects
    .filter((x) => !x.isUpcoming)
    .filter(
      (x) =>
        !!tvlApiResponse.projects[x.id.toString()] &&
        !!tvlBreakdownApiResponse.breakdowns[x.id.toString()],
    )

  return included
}
