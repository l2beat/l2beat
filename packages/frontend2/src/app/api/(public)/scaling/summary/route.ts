import { NextResponse } from 'next/server'
import {
  getScalingSummaryEntries,
  type ScalingSummaryEntry,
} from '~/server/features/scaling/summary/get-scaling-summary-entries'

export async function GET() {
  const entries = await getScalingSummaryEntries()
  return NextResponse.json({
    data: entries.reduce<Record<string, ScalingSummaryEntry>>((acc, entry) => {
      acc[entry.id] = entry
      return acc
    }, {}),
  })
}
