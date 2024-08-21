import { NextResponse } from 'next/server'
import { getActualTvlBreakdown } from '~/server/features/scaling/tvl/breakdown/get-actual-tvl-breakdown'

export async function GET() {
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  await getActualTvlBreakdown()
  return NextResponse.json({ msg: 'check console' })
}
