import { NextResponse } from 'next/server'
import { getLatestTvlUsd } from '~/server/features/tvl/get-latest-tvl-usd'

export async function GET() {
  const latestTvlValues = await getLatestTvlUsd()

  return NextResponse.json(latestTvlValues)
}
