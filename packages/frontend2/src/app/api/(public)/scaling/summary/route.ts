import { NextResponse } from 'next/server'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'

export async function GET() {
  const entries = await getScalingSummaryEntries()
  return NextResponse.json({
    data: entries.reduce<Record<string, unknown>>((acc, entry) => {
      acc[entry.id] = {
        ...entry,
        // Remap change to change7d
        tvl: { ...entry.tvl, change: undefined, change7d: entry.tvl.change },
        // For stage - only return the stage name
        stage: entry.stage.stage,
        // Strip out the following fields
        entryType: undefined,
        href: undefined,
        isVerified: undefined,
        hasImplementationChanged: undefined,
        warning: undefined,
        showProjectUnderReview: undefined,
      }
      return acc
    }, {}),
  })
}
