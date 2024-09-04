import { NextResponse } from 'next/server'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'

export async function GET() {
  return NextResponse.json({
    data: await getScalingSummaryEntries(),
  })
}
