import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'

export async function GET() {
  return {
    data: await getScalingSummaryEntries(),
  }
}
