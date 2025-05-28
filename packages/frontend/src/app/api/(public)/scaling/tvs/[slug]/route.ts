import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { TvsChartDataParams } from '~/server/features/scaling/tvs/get-tvs-chart-data'
import { ps } from '~/server/projects'
import { getScalingTvsProjectApiData } from '../../../_fns/getScalingTvsProjectApiData'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params
  const searchParams = request.nextUrl.searchParams
  const range = searchParams.get('range') as TvsChartDataParams['range'] | null
  const excludeAssociatedTokens =
    searchParams.get('excludeAssociatedTokens') === 'true'

  const response = await getCachedResponse(slug, range, excludeAssociatedTokens)
  return NextResponse.json(response)
}

const getCachedResponse = cache(
  async (
    slug: string,
    range: TvsChartDataParams['range'] | null,
    excludeAssociatedTokens: boolean,
  ) => {
    const project = await ps.getProject({
      slug,
      where: ['tvsConfig', 'isScaling'],
    })

    if (!project) {
      return {
        success: false,
        error: 'Project not found.',
      } as const
    }

    const params: TvsChartDataParams = {
      range: range ?? '30d',
      filter: { type: 'projects', projectIds: [project.id] },
      excludeAssociatedTokens,
      previewRecategorisation: false,
    }
    const parsedParams = TvsChartDataParams.safeParse(params)

    if (parsedParams.error) {
      return {
        success: false,
        errors: parsedParams.error.errors,
      } as const
    }
    return getScalingTvsProjectApiData({
      slug,
      range: parsedParams.data.range,
      excludeAssociatedTokens: parsedParams.data.excludeAssociatedTokens,
    })
  },
  ['scaling-tvs-project-route'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)
