import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { NextResponse } from 'next/server'
import { getScalingTvsProjectBreakdownApiData } from '~/app/api/(public)/_fns/getScalingTvsProjectBreakdownApiData'

export async function GET(
  _: Request,
  props: { params: Promise<{ slug: string }> },
) {
  const params = await props.params
  const response = await getCachedResponse(params.slug)

  return NextResponse.json(response)
}

const getCachedResponse = cache(
  getScalingTvsProjectBreakdownApiData,
  ['scaling-tvs-project-breakdown-route'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)
