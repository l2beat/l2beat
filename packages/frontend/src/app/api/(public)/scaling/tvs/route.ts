import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { TvsChartDataParams } from '~/server/features/scaling/tvs/get-tvs-chart-data'
import { getScalingTvsApiData } from '../../_fns/getScalingTvsApiData'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const range = searchParams.get('range') as TvsChartDataParams['range'] | null
  const type = searchParams.get('type') as
    | TvsChartDataParams['filter']['type']
    | null
  const projectIds = searchParams.get('projectIds')

  if (type === 'projects' && !projectIds) {
    return NextResponse.json({
      success: false,
      errors: [{ message: 'projectIds is required for "projects" type' }],
    })
  }

  const params: TvsChartDataParams = {
    range: range ?? '30d',
    filter:
      type === 'projects'
        ? {
            type: 'projects',
            projectIds: projectIds?.split(',') ?? [],
          }
        : { type: type ?? 'layer2' },
    excludeAssociatedTokens:
      searchParams.get('excludeAssociatedTokens') === 'true',
    previewRecategorisation: false,
  }

  const parsedParams = TvsChartDataParams.safeParse(params)
  if (parsedParams.error) {
    return NextResponse.json({
      success: false,
      errors: parsedParams.error.errors,
    })
  }

  const response = await getCachedResponse({
    range: parsedParams.data.range,
    type: parsedParams.data.filter.type,
    projectIds:
      parsedParams.data.filter.type === 'projects'
        ? parsedParams.data.filter.projectIds
        : [],
    excludeAssociatedTokens: parsedParams.data.excludeAssociatedTokens,
  })

  return NextResponse.json(response)
}

const getCachedResponse = cache(getScalingTvsApiData, ['scaling-tvs-route'], {
  tags: ['hourly-data'],
  revalidate: UnixTime.HOUR,
})
