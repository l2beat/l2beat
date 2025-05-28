import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { NextResponse } from 'next/server'
import { getScalingSummaryApiData } from '../../_fns/getScalingSummaryApiData'

export async function GET() {
  const data = await getCachedData()
  return NextResponse.json({ success: true, data })
}

const getCachedData = cache(
  getScalingSummaryApiData,
  ['scaling-summary-route'],
  { tags: ['hourly-data'], revalidate: UnixTime.HOUR },
)
